/**
 * midi-ios-bridge.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Devine VersaKey 49 — Companion App · iOS MIDI Polyfill
 * Versie : 1.0.0
 * Datum  : 2026-04-07
 * Auteur : VersaKey Companion Project
 *
 * WAT DIT BESTAND DOET
 * ─────────────────────
 * Safari op iOS heeft geen Web MIDI API. Dit bestand simuleert die API volledig
 * zodat index.html denkt dat het gewoon in Chrome draait.
 *
 * HOE HET WERKT
 * ──────────────
 * 1. Dit script wordt geladen VOOR index.html via WKUserScript (Swift kant).
 * 2. Het overschrijft navigator.requestMIDIAccess() met een eigen implementatie.
 * 3. Swift stuurt MIDI berichten via evaluateJavaScript("window.iOSMIDIBridge(...)").
 * 4. iOSMIDIBridge() zet het bericht om naar een MIDIMessageEvent en vuurt het.
 * 5. index.html ontvangt het event via de onmidimessage handler — ongewijzigd.
 *
 * ONDERSTEUNDE MIDI BERICHTEN (van VersaKey naar iOS)
 * ─────────────────────────────────────────────────────
 *  Status 0x80–0x8F  Note Off        (kanaal 1–16)
 *  Status 0x90–0x9F  Note On         (kanaal 1–16)
 *  Status 0xA0–0xAF  Aftertouch Poly (kanaal 1–16)
 *  Status 0xB0–0xBF  Control Change  (kanaal 1–16)  ← encoders, pads
 *  Status 0xC0–0xCF  Program Change  (kanaal 1–16)
 *  Status 0xD0–0xDF  Channel Pressure (aftertouch)
 *  Status 0xE0–0xEF  Pitch Bend      (kanaal 1–16)  ← touch strip
 *
 * GEBRUIK (Swift kant — ViewController.swift)
 * ────────────────────────────────────────────
 *  // Injecteer dit script vóór index.html:
 *  let src = try! String(contentsOf: Bundle.main.url(forResource: "midi-ios-bridge", withExtension: "js")!)
 *  let script = WKUserScript(source: src, injectionTime: .atDocumentStart, forMainFrameOnly: true)
 *  webView.configuration.userContentController.addUserScript(script)
 *
 *  // Stuur een MIDI bericht vanuit Swift:
 *  let js = "window.iOSMIDIBridge(\(status), \(data1), \(data2))"
 *  webView.evaluateJavaScript(js, completionHandler: nil)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ── GUARD: alleen activeren als Web MIDI API ontbreekt ───────────────────
  // Als de browser al echte Web MIDI heeft (Chrome op Windows/Android),
  // dan doet dit script NIETS — de echte API blijft intact.
  if (navigator.requestMIDIAccess) {
    console.log('[iOS-MIDI-Bridge] Echte Web MIDI API gevonden — bridge inactief.');
    return;
  }

  console.log('[iOS-MIDI-Bridge] Web MIDI API niet gevonden — iOS bridge activeren.');

  // ── INTERNE STAAT ─────────────────────────────────────────────────────────

  // Lijst van alle geregistreerde onmidimessage handlers
  // Elke MIDIInput kan meerdere listeners hebben (addEventListener)
  const _messageListeners = new Set();

  // De virtuele VersaKey input poort — één device, één poort
  const VERSAKEY_ID   = 'versakey-ios-usb-001';
  const VERSAKEY_NAME = 'Devine VersaKey 49 (iOS USB)';

  // Houdt bij of de app MIDI toegang heeft gevraagd en gekregen
  let _accessGranted = false;

  // Houdt bij of de VersaKey verbonden is (Swift meldt dit via iOSMIDIStatus)
  let _deviceConnected = false;

  // De MIDIAccess instantie — wordt aangemaakt bij requestMIDIAccess()
  let _midiAccess = null;

  // ── MIDI MESSAGE EVENT ────────────────────────────────────────────────────
  // Simuleert een MIDIMessageEvent zoals de echte Web MIDI API die maakt.
  // index.html gebruikt: event.data[0], event.data[1], event.data[2]

  /**
   * Maak een MIDIMessageEvent object aan.
   * @param {number} status  - MIDI status byte (bijv. 0x90 = Note On kanaal 1)
   * @param {number} data1   - Eerste data byte (bijv. nootnummer)
   * @param {number} data2   - Tweede data byte (bijv. velocity), 0 als niet van toepassing
   * @param {string} inputId - ID van de virtuele input poort
   * @returns {object} MIDIMessageEvent-achtig object
   */
  function makeMIDIMessageEvent(status, data1, data2, inputId) {
    // Bepaal hoeveel bytes dit bericht heeft op basis van status byte
    // Program Change (0xC0) en Channel Pressure (0xD0) hebben maar 2 bytes
    const twoByteMessages = [0xC0, 0xD0];
    const statusBase = status & 0xF0; // Masker om kanaalinfo te verwijderen
    const isTwoByte  = twoByteMessages.includes(statusBase);

    // Maak de data array — identiek aan echte Web MIDI Uint8Array
    const dataArray = isTwoByte
      ? new Uint8Array([status, data1])
      : new Uint8Array([status, data1, data2]);

    // Tijdstempel in milliseconden vanaf app-start (zoals echte Web MIDI)
    const timestamp = performance.now();

    return {
      type      : 'midimessage',        // Event type naam
      data      : dataArray,            // De ruwe MIDI bytes
      target    : { id: inputId },      // De virtuele input poort
      timeStamp : timestamp,            // Tijdstempel
      receivedTime : timestamp,         // Alternatief veld (oudere apps)
      // Handige hulpvelden voor debugging
      _statusByte : status,
      _data1      : data1,
      _data2      : data2,
      _channel    : (status & 0x0F) + 1, // MIDI kanaal 1–16
      _type       : getMIDIMessageType(statusBase),
    };
  }

  /**
   * Geeft een leesbare naam voor het MIDI bericht type.
   * Alleen gebruikt voor logging en debugging.
   * @param {number} statusBase - Status byte met kanaal gemaskeerd (bijv. 0x90)
   * @returns {string} Naam van het bericht type
   */
  function getMIDIMessageType(statusBase) {
    const types = {
      0x80: 'Note Off',
      0x90: 'Note On',
      0xA0: 'Aftertouch (Poly)',
      0xB0: 'Control Change',
      0xC0: 'Program Change',
      0xD0: 'Channel Pressure',
      0xE0: 'Pitch Bend',
      0xF0: 'System',
    };
    return types[statusBase] || `Onbekend (0x${statusBase.toString(16).toUpperCase()})`;
  }

  // ── VIRTUELE MIDI INPUT POORT ─────────────────────────────────────────────
  // Simuleert een MIDIInput object — één voor de VersaKey.
  // index.html itereert over midiAccess.inputs en registreert handlers hierop.

  /**
   * Maak de virtuele MIDIInput voor de VersaKey aan.
   * Ondersteunt zowel .onmidimessage als addEventListener('midimessage', ...).
   * @returns {object} MIDIInput-achtig object
   */
  function makeVersaKeyInput() {
    // Private handler opslag voor deze input
    let _onmidimessageHandler = null;

    const input = {
      id           : VERSAKEY_ID,
      name         : VERSAKEY_NAME,
      manufacturer : 'Devine Music',
      version      : '1.0',
      type         : 'input',
      state        : 'connected',     // 'connected' of 'disconnected'
      connection   : 'open',          // Web MIDI vereist 'open'

      // ── onmidimessage property ────────────────────────────────────────────
      // index.html kan doen: input.onmidimessage = function(e) { ... }
      get onmidimessage() {
        return _onmidimessageHandler;
      },
      set onmidimessage(handler) {
        // Verwijder oude handler uit de centrale set
        if (_onmidimessageHandler) {
          _messageListeners.delete(_onmidimessageHandler);
        }
        // Registreer nieuwe handler
        _onmidimessageHandler = handler;
        if (handler && typeof handler === 'function') {
          _messageListeners.add(handler);
          console.log('[iOS-MIDI-Bridge] onmidimessage handler geregistreerd voor:', VERSAKEY_NAME);
        }
      },

      // ── addEventListener ──────────────────────────────────────────────────
      // index.html kan ook doen: input.addEventListener('midimessage', fn)
      addEventListener(eventType, handler) {
        if (eventType === 'midimessage' && typeof handler === 'function') {
          _messageListeners.add(handler);
          console.log('[iOS-MIDI-Bridge] addEventListener midimessage geregistreerd.');
        }
        // Andere event types (statechange etc.) worden genegeerd maar niet gecrasht
      },

      // ── removeEventListener ───────────────────────────────────────────────
      removeEventListener(eventType, handler) {
        if (eventType === 'midimessage') {
          _messageListeners.delete(handler);
        }
      },

      // ── open / close ──────────────────────────────────────────────────────
      // Sommige apps roepen input.open() aan — wij doen niets maar crashen niet
      open()  { return Promise.resolve(this); },
      close() { return Promise.resolve(this); },

      // ── onstatechange ─────────────────────────────────────────────────────
      onstatechange: null,
    };

    return input;
  }

  // ── VIRTUELE MIDI MAP (inputs collectie) ──────────────────────────────────
  // Simuleert MIDIInputMap — de Map die midiAccess.inputs retourneert.
  // index.html doet: for (let [id, input] of midiAccess.inputs) { ... }

  const _versaKeyInput = makeVersaKeyInput();

  /**
   * Maak een MIDIInputMap-achtig object aan.
   * Bevat één entry: de virtuele VersaKey input.
   * Ondersteunt forEach, entries(), values(), keys(), get(), has(), size.
   */
  function makeMIDIInputMap() {
    const _map = new Map([[VERSAKEY_ID, _versaKeyInput]]);

    return {
      // Grootte van de map (altijd 1 — één VersaKey)
      get size() { return _map.size; },

      // Haal input op via ID
      get(id)    { return _map.get(id); },
      has(id)    { return _map.has(id); },

      // Iteratie methoden — gebruikt door index.html
      forEach(cb)  { _map.forEach(cb); },
      entries()    { return _map.entries(); },
      values()     { return _map.values(); },
      keys()       { return _map.keys(); },

      // Symbol.iterator zodat for...of werkt
      [Symbol.iterator]() { return _map.entries(); },
    };
  }

  // ── VIRTUELE MIDI OUTPUT MAP ──────────────────────────────────────────────
  // Wij sturen geen MIDI UIT naar de VersaKey (niet nodig voor onze app).
  // Maar de Map moet bestaan zodat index.html niet crasht als het outputs checkt.

  function makeMIDIOutputMap() {
    const _map = new Map(); // Leeg — geen outputs
    return {
      get size()   { return 0; },
      get(id)      { return undefined; },
      has(id)      { return false; },
      forEach(cb)  {},
      entries()    { return _map.entries(); },
      values()     { return _map.values(); },
      keys()       { return _map.keys(); },
      [Symbol.iterator]() { return _map.entries(); },
    };
  }

  // ── MIDI ACCESS OBJECT ────────────────────────────────────────────────────
  // Het hoofd-object dat requestMIDIAccess() retourneert.
  // index.html ontvangt dit en gebruikt het om inputs te lezen.

  /**
   * Maak het MIDIAccess object aan.
   * @returns {object} MIDIAccess-achtig object
   */
  function makeMIDIAccess() {
    const access = {
      inputs  : makeMIDIInputMap(),   // De VersaKey input
      outputs : makeMIDIOutputMap(),  // Leeg

      sysexEnabled : false,           // Wij sturen geen SysEx

      // onstatechange — Swift roept iOSMIDIStatus aan om device verbinding te melden
      onstatechange: null,

      // Lees-only velden die sommige apps checken
      _isIOSBridge : true,            // Herkenningsveld voor debugging
    };

    return access;
  }

  // ── NAVIGATOR.REQUESTMIDIACCESS() OVERSCHRIJVEN ───────────────────────────
  // Dit is het kernpunt van de polyfill.
  // Elke aanroep van navigator.requestMIDIAccess() in index.html komt hier.

  /**
   * Vervangt de native (ontbrekende) Web MIDI API aanvraag.
   * Retourneert altijd een opgeloste Promise met het MIDIAccess object.
   * @param {object} options - { sysex: boolean } — wordt geaccepteerd maar genegeerd
   * @returns {Promise<MIDIAccess>}
   */
  navigator.requestMIDIAccess = function (options) {
    console.log('[iOS-MIDI-Bridge] requestMIDIAccess() aangeroepen — iOS bridge actief.');

    // Maak het MIDIAccess object aan als dat nog niet bestaat
    if (!_midiAccess) {
      _midiAccess = makeMIDIAccess();
      _accessGranted = true;
    }

    // Retourneer altijd success — iOS CoreMIDI heeft geen toestemming-popup
    return Promise.resolve(_midiAccess);
  };

  // ── GLOBALE BRIDGE FUNCTIE — AANROEP VANUIT SWIFT ────────────────────────
  // Swift roept deze functie aan via:
  //   webView.evaluateJavaScript("window.iOSMIDIBridge(144, 60, 80)")
  //
  // Parameters:
  //   status (number) - MIDI status byte  bijv. 144 = Note On kanaal 1
  //   data1  (number) - Eerste data byte  bijv. 60  = Middle C
  //   data2  (number) - Tweede data byte  bijv. 80  = velocity
  //   data2 is optioneel voor 2-byte berichten (Program Change, Channel Pressure)

  /**
   * Ontvangt een MIDI bericht van Swift en distribueert het naar alle handlers.
   * Dit is het enige entry-point vanuit de native Swift kant.
   *
   * @param {number} status - MIDI status byte
   * @param {number} data1  - Eerste data byte
   * @param {number} data2  - Tweede data byte (optioneel, default 0)
   */
  window.iOSMIDIBridge = function (status, data1, data2 = 0) {
    // Valideer de input — bescherm tegen ongeldige waarden van Swift
    if (typeof status !== 'number' || status < 0 || status > 255) {
      console.warn('[iOS-MIDI-Bridge] Ongeldig status byte ontvangen:', status);
      return;
    }

    // Bouw het event object
    const event = makeMIDIMessageEvent(status, data1, data2, VERSAKEY_ID);

    // Debug logging — alleen voor Note On/Off en CC (niet te veel spam)
    const statusBase = status & 0xF0;
    if ([0x80, 0x90, 0xB0, 0xE0].includes(statusBase)) {
      console.log(
        `[iOS-MIDI-Bridge] ${event._type} | kanaal ${event._channel} |`,
        `data1=${data1} data2=${data2}`
      );
    }

    // Stuur het event naar ALLE geregistreerde handlers
    // index.html registreert handlers via onmidimessage of addEventListener
    if (_messageListeners.size === 0) {
      // Nog geen handlers — index.html is misschien nog aan het laden
      console.warn('[iOS-MIDI-Bridge] Bericht ontvangen maar geen handlers geregistreerd. Wacht op index.html.');
      return;
    }

    _messageListeners.forEach(function (handler) {
      try {
        handler(event);
      } catch (err) {
        // Crash in één handler mag de andere handlers niet stoppen
        console.error('[iOS-MIDI-Bridge] Fout in MIDI handler:', err);
      }
    });
  };

  // ── DEVICE STATUS FUNCTIE — AANROEP VANUIT SWIFT ─────────────────────────
  // Swift roept dit aan als de VersaKey wordt aangesloten of verwijderd.
  // Hiermee kan index.html de verbindingsstatus bijhouden.
  //
  // Aanroep vanuit Swift:
  //   webView.evaluateJavaScript("window.iOSMIDIStatus('connected', 'Devine VersaKey 49')")
  //   webView.evaluateJavaScript("window.iOSMIDIStatus('disconnected', '')")

  /**
   * Meldt een verandering in device verbinding aan index.html.
   * Activeert onstatechange op het MIDIAccess object als dat geregistreerd is.
   *
   * @param {string} state  - 'connected' of 'disconnected'
   * @param {string} name   - Naam van het device (voor logging)
   */
  window.iOSMIDIStatus = function (state, name) {
    console.log(`[iOS-MIDI-Bridge] Device status: ${state} — ${name || '(geen naam)'}`);

    _deviceConnected = (state === 'connected');

    // Update de state op de virtuele input poort
    if (_versaKeyInput) {
      _versaKeyInput.state = state;
    }

    // Activeer onstatechange op het MIDIAccess object als index.html dat gebruikt
    if (_midiAccess && typeof _midiAccess.onstatechange === 'function') {
      try {
        _midiAccess.onstatechange({
          type  : 'statechange',
          port  : _versaKeyInput,
          target: _midiAccess,
        });
      } catch (err) {
        console.error('[iOS-MIDI-Bridge] Fout in onstatechange handler:', err);
      }
    }
  };

  // ── NAVIGATOR.MIDI PROPERTY (optioneel) ───────────────────────────────────
  // Sommige apps checken navigator.midi als alternatief. Wij bieden het aan.

  if (!navigator.midi) {
    Object.defineProperty(navigator, 'midi', {
      get: function () { return { supported: true, _isIOSBridge: true }; },
      configurable: true,
    });
  }

  // ── INITIALISATIE MELDING ─────────────────────────────────────────────────
  console.log([
    '[iOS-MIDI-Bridge] ✅ iOS MIDI polyfill geladen.',
    '  Versie : 1.0.0',
    '  Device : ' + VERSAKEY_NAME,
    '  Wacht op requestMIDIAccess() van index.html...',
  ].join('\n'));

  // ── PUBLIEK DEBUG OBJECT ──────────────────────────────────────────────────
  // Beschikbaar in Safari Web Inspector voor debugging op iPad.
  // Gebruik: window.__iOSMIDIDebug.status()

  window.__iOSMIDIDebug = {
    /**
     * Toon huidige status van de bridge.
     */
    status() {
      console.table({
        'Bridge actief'        : true,
        'Toegang verleend'     : _accessGranted,
        'Device verbonden'     : _deviceConnected,
        'Actieve handlers'     : _messageListeners.size,
        'Device naam'          : VERSAKEY_NAME,
      });
    },

    /**
     * Simuleer een MIDI bericht — handig voor testen zonder VersaKey hardware.
     * Gebruik: window.__iOSMIDIDebug.send(0x90, 60, 80)  → Note On C4 velocity 80
     * @param {number} status
     * @param {number} data1
     * @param {number} data2
     */
    send(status, data1, data2 = 0) {
      console.log(`[iOS-MIDI-Debug] Simuleer bericht: [${status}, ${data1}, ${data2}]`);
      window.iOSMIDIBridge(status, data1, data2);
    },

    /**
     * Stuur een Note On bericht voor een specifieke noot.
     * Gebruik: window.__iOSMIDIDebug.noteOn(60, 80)  → Middle C, velocity 80
     * @param {number} note     - MIDI nootnummer (0–127)
     * @param {number} velocity - Velocity (1–127, 0 = Note Off)
     * @param {number} channel  - MIDI kanaal (1–16, default 1)
     */
    noteOn(note, velocity = 80, channel = 1) {
      const status = 0x90 | ((channel - 1) & 0x0F); // Note On status byte
      this.send(status, note, velocity);
    },

    /**
     * Stuur een Note Off bericht.
     * @param {number} note    - MIDI nootnummer (0–127)
     * @param {number} channel - MIDI kanaal (1–16, default 1)
     */
    noteOff(note, channel = 1) {
      const status = 0x80 | ((channel - 1) & 0x0F); // Note Off status byte
      this.send(status, note, 0);
    },

    /**
     * Stuur een Control Change bericht (encoder draaien).
     * Gebruik: window.__iOSMIDIDebug.cc(7, 64)  → Volume halfweg
     * @param {number} cc      - CC nummer (0–127)
     * @param {number} value   - Waarde (0–127)
     * @param {number} channel - MIDI kanaal (1–16, default 1)
     */
    cc(cc, value, channel = 1) {
      const status = 0xB0 | ((channel - 1) & 0x0F); // Control Change status byte
      this.send(status, cc, value);
    },

    /**
     * Simuleer een complete noot — Note On gevolgd door Note Off na 500ms.
     * @param {number} note     - MIDI nootnummer (0–127)
     * @param {number} velocity - Velocity (default 80)
     * @param {number} channel  - MIDI kanaal (default 1)
     */
    playNote(note, velocity = 80, channel = 1) {
      this.noteOn(note, velocity, channel);
      setTimeout(() => this.noteOff(note, channel), 500);
    },

    /**
     * Lijst alle geregistreerde handlers.
     */
    listHandlers() {
      console.log(`[iOS-MIDI-Debug] ${_messageListeners.size} handler(s) geregistreerd.`);
    },
  };

}()); // Einde IIFE — alle variabelen blijven privé, alleen window.* is publiek
