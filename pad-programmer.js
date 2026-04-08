/**
 * pad-programmer.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Devine VersaKey 49 — Companion App
 * Versie : 1.0.0  (v2.6.0 van de Companion App)
 * Datum  : 2026-04-08
 *
 * WAT DIT BESTAND DOET
 * ─────────────────────
 * Voegt volledig pad-programmatie toe aan de bestaande Companion App:
 *   • MIDI noot per pad instellen (bank 1–8 én bank 9–16)
 *   • CC-nummer per pad instellen (pad als controller)
 *   • Pad naam aanpassen
 *   • Pad kleur kiezen uit 8 kleuren
 *   • MIDI Learn — klik pad in UI, sla VersaKey pad aan → koppeling opgeslagen
 *   • Reset per bank naar fabriekswaarden
 *   • Instellingen worden opgeslagen in localStorage
 *
 * HOE INTEGREREN IN index.html
 * ──────────────────────────────
 * Voeg ONE regel toe vóór </body> in je index.html:
 *
 *   <script src="pad-programmer.js"></script>
 *
 * De module hecht zichzelf automatisch aan de bestaande pad-elementen.
 * Verwacht DOM-elementen met:  data-pad="1" t/m data-pad="16"
 * (of class="drum-pad" met een data-pad of data-note attribuut)
 *
 * STANDALONE GEBRUIK (zonder index.html)
 * ────────────────────────────────────────
 * Open pad-programmer-demo.html in Chrome — volledig werkende demo.
 *
 * MIDI BERICHTEN DIE DIT MODULE VERWERKT
 * ────────────────────────────────────────
 *  Note On  (0x90–0x9F) → activeert de bijbehorende pad in de UI
 *  Note Off (0x80–0x8F) → deactiveert de pad
 *
 * MIDI BERICHTEN DIE DIT MODULE VERSTUURT (via window.dispatchEvent)
 * ────────────────────────────────────────────────────────────────────
 *  CustomEvent 'padMidiOut' met detail { note, velocity, channel }
 *  De bestaande app kan hierop luisteren voor geluidsweergave.
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ── FABRIEKSINSTELLINGEN ──────────────────────────────────────────────────
  // Bank 1 (pads 1–8): standaard drum kit
  // Noten in MIDI nummers: C1=36, D1=38, F#1=42, A#1=46, F1=41, D2=50, C#2=49, D#2=51

  const FACTORY_BANKS = [
    // Bank 1 — standaard drum kit
    [
      { id: 1,  name: 'Kick',          note: 36, cc: null, color: 'red',    channel: 10 },
      { id: 2,  name: 'Snare',         note: 38, cc: null, color: 'brown',  channel: 10 },
      { id: 3,  name: 'Hi-Hat (gest)', note: 42, cc: null, color: 'blue',   channel: 10 },
      { id: 4,  name: 'Hi-Hat (open)', note: 46, cc: null, color: 'green',  channel: 10 },
      { id: 5,  name: 'Tom Laag',      note: 41, cc: null, color: 'purple', channel: 10 },
      { id: 6,  name: 'Tom Hoog',      note: 50, cc: null, color: 'orange', channel: 10 },
      { id: 7,  name: 'Crash',         note: 49, cc: null, color: 'red',    channel: 10 },
      { id: 8,  name: 'Ride',          note: 51, cc: null, color: 'teal',   channel: 10 },
    ],
    // Bank 2 — vrij programmeerbaar (standaard percussie GM)
    [
      { id: 9,  name: 'Clap',          note: 39, cc: null, color: 'orange', channel: 10 },
      { id: 10, name: 'Rim Shot',      note: 37, cc: null, color: 'blue',   channel: 10 },
      { id: 11, name: 'Cowbell',       note: 56, cc: null, color: 'green',  channel: 10 },
      { id: 12, name: 'Tambourine',    note: 54, cc: null, color: 'purple', channel: 10 },
      { id: 13, name: 'High Bongo',    note: 60, cc: null, color: 'teal',   channel: 10 },
      { id: 14, name: 'Low Bongo',     note: 61, cc: null, color: 'brown',  channel: 10 },
      { id: 15, name: 'Agogo High',    note: 67, cc: null, color: 'red',    channel: 10 },
      { id: 16, name: 'Agogo Low',     note: 68, cc: null, color: 'orange', channel: 10 },
    ],
  ];

  // ── KLEUR DEFINITIES ──────────────────────────────────────────────────────
  // Elke kleur heeft een naam, achtergrondkleur en tekstkleur voor leesbaarheid

  const PAD_COLORS = {
    red:    { bg: '#E53935', text: '#fff', label: 'Rood' },
    orange: { bg: '#F4511E', text: '#fff', label: 'Oranje' },
    brown:  { bg: '#795548', text: '#fff', label: 'Bruin' },
    green:  { bg: '#2E7D32', text: '#fff', label: 'Groen' },
    teal:   { bg: '#00838F', text: '#fff', label: 'Blauwgroen' },
    blue:   { bg: '#1565C0', text: '#fff', label: 'Blauw' },
    purple: { bg: '#6A1B9A', text: '#fff', label: 'Paars' },
    gray:   { bg: '#546E7A', text: '#fff', label: 'Grijs' },
  };

  // ── MIDI NOOT HELPERS ────────────────────────────────────────────────────

  // Nootnamen voor weergave (MIDI 0–127)
  const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  /** Zet MIDI nootnummer om naar leesbare naam: 36 → "C2" */
  function noteToName(midi) {
    if (midi < 0 || midi > 127) return '—';
    const oct = Math.floor(midi / 12) - 2; // C2 = 36 in GM standaard
    return NOTE_NAMES[midi % 12] + oct;
  }

  /** Zet nootnaam om naar MIDI nummer: "C2" → 36 */
  function nameToNote(str) {
    const m = str.trim().toUpperCase().match(/^([A-G]#?)(-?\d+)$/);
    if (!m) return null;
    const noteIdx = NOTE_NAMES.indexOf(m[1]);
    if (noteIdx === -1) return null;
    const oct = parseInt(m[2], 10);
    const midi = (oct + 2) * 12 + noteIdx;
    return (midi >= 0 && midi <= 127) ? midi : null;
  }

  // ── INTERNE STAAT ─────────────────────────────────────────────────────────

  // Diepe kopie van de fabriekswaarden als startpunt
  let padBanks = JSON.parse(JSON.stringify(FACTORY_BANKS));

  // Actieve bank index: 0 = bank 1–8, 1 = bank 9–16
  let activeBankIdx = 0;

  // MIDI Learn staat: null = inactief, number = index van pad in leerstand
  let learnTarget = null;    // { bankIdx, padIdx } of null
  let learnMode = 'note';    // 'note' of 'cc' — wat leren we

  // Editor staat: welke pad is open
  let editorOpen = null;     // { bankIdx, padIdx } of null

  // DOM referenties — gevuld in init()
  let containerEl = null;    // De hoofd pad-container
  let editorEl    = null;    // De editor popup
  let statusEl    = null;    // Status balk bovenaan editor

  // ── OPSLAAN EN LADEN ──────────────────────────────────────────────────────

  const STORAGE_KEY = 'versakey_pad_banks_v1';

  /** Sla de huidige pad-instellingen op in localStorage. */
  function savePads() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(padBanks));
    } catch (e) {
      console.warn('[PadProgrammer] localStorage niet beschikbaar:', e);
    }
  }

  /** Laad opgeslagen pad-instellingen. Valt terug op fabriekswaarden. */
  function loadPads() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Valideer structuur: moet 2 banken zijn met elk 8 pads
      if (Array.isArray(parsed) && parsed.length === 2 &&
          parsed[0].length === 8 && parsed[1].length === 8) {
        padBanks = parsed;
      }
    } catch (e) {
      console.warn('[PadProgrammer] Laden mislukt, fabriekswaarden gebruikt:', e);
    }
  }

  // ── MIDI ONTVANGST ────────────────────────────────────────────────────────
  // Luistert naar MIDI berichten van de bestaande app.
  // De bestaande app dispatcht een CustomEvent 'midiMessage' op window.

  /** Verwerk een binnenkomend MIDI bericht. */
  function onMidiIn(statusByte, data1, data2) {
    const type = statusByte & 0xF0;

    // Note On (0x90) of Note Off (0x80)
    if (type === 0x90 || type === 0x80) {
      const note     = data1;
      const velocity = data2;
      const isOn     = (type === 0x90 && velocity > 0);

      // MIDI Learn modus actief?
      if (learnTarget !== null && isOn) {
        applyLearn(note, null);
        return;
      }

      // Zoek welke pad deze noot heeft
      padBanks.forEach((bank, bIdx) => {
        bank.forEach((pad, pIdx) => {
          if (pad.note === note) {
            flashPadUI(bIdx, pIdx, isOn);
          }
        });
      });
    }

    // Control Change (0xB0) — voor CC learn modus
    if ((statusByte & 0xF0) === 0xB0 && learnTarget !== null && learnMode === 'cc') {
      applyLearn(null, data1);
    }
  }

  /** Hecht aan de bestaande app's MIDI event of aan navigator.requestMIDIAccess. */
  function hookMidi() {
    // Methode 1: de bestaande app dispatcht 'midiMessage' events op window
    window.addEventListener('midiMessage', (e) => {
      if (e.detail) onMidiIn(e.detail.status, e.detail.data1, e.detail.data2);
    });

    // Methode 2: rechtstreeks via Web MIDI API (als de app die niet onderschept)
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(access => {
        access.inputs.forEach(input => {
          input.addEventListener('midimessage', (e) => {
            if (e.data && e.data.length >= 2) {
              onMidiIn(e.data[0], e.data[1] || 0, e.data[2] || 0);
            }
          });
        });
        // Nieuwe devices die later worden aangesloten
        access.onstatechange = () => {
          access.inputs.forEach(input => {
            input.addEventListener('midimessage', (e) => {
              if (e.data && e.data.length >= 2) {
                onMidiIn(e.data[0], e.data[1] || 0, e.data[2] || 0);
              }
            });
          });
        };
      }).catch(() => {});
    }

    // Methode 3: iOS bridge (window.iOSMIDIBridge wordt omgeleid)
    const origBridge = window.iOSMIDIBridge;
    window.iOSMIDIBridge = function(status, data1, data2) {
      onMidiIn(status, data1 || 0, data2 || 0);
      if (typeof origBridge === 'function') origBridge(status, data1, data2);
    };
  }

  // ── PAD AANSLAAN (output) ─────────────────────────────────────────────────

  /** Stuur een MIDI noot of CC uit voor een pad. */
  function triggerPad(bankIdx, padIdx, velocity) {
    const pad = padBanks[bankIdx][padIdx];
    velocity = velocity || 100;

    if (pad.cc !== null) {
      // CC modus — stuur een Control Change
      window.dispatchEvent(new CustomEvent('padMidiOut', {
        detail: { type: 'cc', cc: pad.cc, value: velocity, channel: pad.channel }
      }));
    } else {
      // Noot modus — stuur Note On gevolgd door Note Off na 120ms
      window.dispatchEvent(new CustomEvent('padMidiOut', {
        detail: { type: 'note', note: pad.note, velocity, channel: pad.channel }
      }));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('padMidiOut', {
          detail: { type: 'noteoff', note: pad.note, velocity: 0, channel: pad.channel }
        }));
      }, 120);
    }
  }

  // ── UI BOUWEN ─────────────────────────────────────────────────────────────

  /** Bouw de volledige pad-sectie in de DOM. */
  function buildUI() {
    // Zoek bestaande container of maak nieuwe aan
    containerEl = document.getElementById('pad-programmer-section');
    if (!containerEl) {
      containerEl = document.createElement('div');
      containerEl.id = 'pad-programmer-section';
      // Voeg in na de bestaande drum-pads sectie of bovenaan body
      const existing = document.getElementById('drum-pads') ||
                       document.querySelector('.drum-pads') ||
                       document.body.firstElementChild;
      if (existing && existing.parentNode) {
        existing.parentNode.insertBefore(containerEl, existing.nextSibling);
      } else {
        document.body.prepend(containerEl);
      }
    }

    containerEl.innerHTML = '';
    containerEl.style.cssText = `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 12px 0;
      user-select: none;
    `;

    // ── Balk: titel + bank wissel + reset ──────────────────────────────────
    const bar = document.createElement('div');
    bar.style.cssText = `
      display: flex; align-items: center; gap: 8px;
      padding: 6px 10px; background: #1a2535;
      border-radius: 8px 8px 0 0;
    `;

    // Titel
    const title = document.createElement('span');
    title.textContent = '🥁 Drum Pads';
    title.style.cssText = 'color:#fff; font-weight:600; font-size:13px; flex:1;';
    bar.appendChild(title);

    // Bank badge
    const badge = document.createElement('span');
    badge.id = 'pad-bank-badge';
    badge.style.cssText = `
      font-size:11px; font-weight:700; padding:2px 8px;
      border-radius:10px; background:#795548; color:#fff;
    `;
    badge.textContent = 'B1';
    bar.appendChild(badge);

    // Bank wissel knop
    const bankBtn = document.createElement('button');
    bankBtn.id = 'pad-bank-toggle';
    bankBtn.textContent = 'Wissel → 9–16';
    bankBtn.onclick = toggleBank;
    styleBtn(bankBtn, '#2c3e50');
    bar.appendChild(bankBtn);

    // Reset knop
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '↺ Reset bank';
    resetBtn.onclick = resetActiveBank;
    styleBtn(resetBtn, '#b71c1c');
    bar.appendChild(resetBtn);

    containerEl.appendChild(bar);

    // ── Pad grid ──────────────────────────────────────────────────────────
    const grid = document.createElement('div');
    grid.id = 'pad-grid';
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      padding: 8px;
      background: #111820;
      border-radius: 0 0 8px 8px;
    `;
    containerEl.appendChild(grid);

    // ── Editor popup ──────────────────────────────────────────────────────
    editorEl = document.createElement('div');
    editorEl.id = 'pad-editor';
    editorEl.style.cssText = `
      display:none; position:fixed; z-index:9999;
      background:#1e2d40; border:1px solid #3a5068;
      border-radius:10px; padding:14px; min-width:240px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    `;
    document.body.appendChild(editorEl);

    // ── Status balk voor MIDI Learn ───────────────────────────────────────
    statusEl = document.createElement('div');
    statusEl.id = 'pad-learn-status';
    statusEl.style.cssText = `
      display:none; position:fixed; bottom:12px; left:50%;
      transform:translateX(-50%);
      background:#E65100; color:#fff; font-weight:700;
      padding:10px 24px; border-radius:20px; z-index:10000;
      font-size:14px; box-shadow:0 4px 16px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(statusEl);

    renderPads();
  }

  /** Render alle 8 pads van de actieve bank. */
  function renderPads() {
    const grid = document.getElementById('pad-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const bank = padBanks[activeBankIdx];
    bank.forEach((pad, pIdx) => {
      const col = PAD_COLORS[pad.color] || PAD_COLORS.blue;

      const el = document.createElement('div');
      el.id = `pad-el-${activeBankIdx}-${pIdx}`;
      el.style.cssText = `
        background: ${col.bg};
        border-radius: 8px;
        padding: 10px 6px 8px;
        cursor: pointer;
        transition: filter 0.08s, transform 0.08s;
        min-height: 72px;
        display: flex; flex-direction: column;
        align-items: center; justify-content: space-between;
        position: relative;
        border: 2px solid transparent;
      `;

      // Pad nummer badge
      const numBadge = document.createElement('span');
      numBadge.textContent = pad.id;
      numBadge.style.cssText = `
        position:absolute; top:4px; left:6px;
        font-size:9px; font-weight:700;
        color:rgba(255,255,255,0.6);
      `;
      el.appendChild(numBadge);

      // Naam label
      const nameEl = document.createElement('div');
      nameEl.textContent = pad.name;
      nameEl.style.cssText = `
        color: ${col.text}; font-size:11px; font-weight:600;
        text-align:center; margin-top:12px;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        max-width:100%;
      `;
      el.appendChild(nameEl);

      // Noot / CC label
      const infoEl = document.createElement('div');
      infoEl.style.cssText = `
        color:rgba(255,255,255,0.75); font-size:10px;
        font-family: monospace; margin-top:2px;
      `;
      infoEl.textContent = pad.cc !== null
        ? `CC${pad.cc}`
        : noteToName(pad.note);
      el.appendChild(infoEl);

      // Aanslaan via muis/touch
      el.addEventListener('mousedown', () => { triggerPad(activeBankIdx, pIdx, 100); flashPadUI(activeBankIdx, pIdx, true); });
      el.addEventListener('mouseup',   () => flashPadUI(activeBankIdx, pIdx, false));
      el.addEventListener('mouseleave',() => flashPadUI(activeBankIdx, pIdx, false));
      el.addEventListener('touchstart', (e) => { e.preventDefault(); triggerPad(activeBankIdx, pIdx, 100); flashPadUI(activeBankIdx, pIdx, true); });
      el.addEventListener('touchend',   () => flashPadUI(activeBankIdx, pIdx, false));

      // Lang indrukken of rechtsklik → editor openen
      let holdTimer = null;
      el.addEventListener('mousedown', () => {
        holdTimer = setTimeout(() => openEditor(activeBankIdx, pIdx, el), 600);
      });
      el.addEventListener('mouseup', () => clearTimeout(holdTimer));
      el.addEventListener('mouseleave', () => clearTimeout(holdTimer));
      el.addEventListener('contextmenu', (e) => { e.preventDefault(); openEditor(activeBankIdx, pIdx, el); });

      grid.appendChild(el);
    });

    // Update bank badge kleur
    const badge = document.getElementById('pad-bank-badge');
    if (badge) {
      badge.textContent = activeBankIdx === 0 ? 'B1' : 'B2';
      badge.style.background = activeBankIdx === 0 ? '#795548' : '#2E7D32';
    }
    const toggleBtn = document.getElementById('pad-bank-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = activeBankIdx === 0 ? 'Wissel → 9–16' : 'Wissel → 1–8';
    }
  }

  /** Visuele feedback als een pad aangeslagen wordt. */
  function flashPadUI(bankIdx, padIdx, active) {
    const el = document.getElementById(`pad-el-${bankIdx}-${padIdx}`);
    if (!el) return;
    if (active) {
      el.style.filter  = 'brightness(1.5)';
      el.style.transform = 'scale(0.95)';
      el.style.border  = '2px solid rgba(255,255,255,0.8)';
    } else {
      el.style.filter  = '';
      el.style.transform = '';
      el.style.border  = '2px solid transparent';
    }
  }

  // ── EDITOR POPUP ──────────────────────────────────────────────────────────

  /** Open de editor voor een specifiek pad. */
  function openEditor(bankIdx, padIdx, anchorEl) {
    editorOpen = { bankIdx, padIdx };
    const pad = padBanks[bankIdx][padIdx];
    const col = PAD_COLORS[pad.color] || PAD_COLORS.blue;

    editorEl.innerHTML = '';

    // ── Header ──────────────────────────────────────────────────────────
    const hdr = document.createElement('div');
    hdr.style.cssText = `
      display:flex; align-items:center; gap:8px; margin-bottom:12px;
    `;

    const padPreview = document.createElement('div');
    padPreview.id = 'editor-pad-preview';
    padPreview.style.cssText = `
      width:28px; height:28px; border-radius:6px;
      background:${col.bg}; flex-shrink:0;
    `;
    hdr.appendChild(padPreview);

    const hTitle = document.createElement('span');
    hTitle.textContent = `Pad ${pad.id} — ${pad.name}`;
    hTitle.style.cssText = 'color:#fff; font-weight:700; font-size:13px; flex:1;';
    hdr.appendChild(hTitle);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.onclick = closeEditor;
    closeBtn.style.cssText = `
      background:none; border:none; color:#aaa; font-size:16px;
      cursor:pointer; padding:0 4px; line-height:1;
    `;
    hdr.appendChild(closeBtn);
    editorEl.appendChild(hdr);

    // ── Naam veld ──────────────────────────────────────────────────────
    addEditorSection(editorEl, 'Naam');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = pad.name;
    nameInput.maxLength = 16;
    styleInput(nameInput);
    nameInput.addEventListener('change', () => {
      padBanks[bankIdx][padIdx].name = nameInput.value.trim() || pad.name;
      savePads(); renderPads();
    });
    editorEl.appendChild(nameInput);

    // ── Noot / CC toggle ───────────────────────────────────────────────
    addEditorSection(editorEl, 'Modus');
    const modeRow = document.createElement('div');
    modeRow.style.cssText = 'display:flex; gap:6px; margin-bottom:8px;';

    const noteBtn = document.createElement('button');
    noteBtn.textContent = '🎵 Noot';
    noteBtn.onclick = () => setMode('note', bankIdx, padIdx);
    styleBtn(noteBtn, pad.cc === null ? '#1565C0' : '#2c3e50');
    noteBtn.id = 'mode-note-btn';
    modeRow.appendChild(noteBtn);

    const ccBtn = document.createElement('button');
    ccBtn.textContent = '🎛 CC';
    ccBtn.onclick = () => setMode('cc', bankIdx, padIdx);
    styleBtn(ccBtn, pad.cc !== null ? '#1565C0' : '#2c3e50');
    ccBtn.id = 'mode-cc-btn';
    modeRow.appendChild(ccBtn);
    editorEl.appendChild(modeRow);

    // ── Noot instelling ────────────────────────────────────────────────
    const noteSection = document.createElement('div');
    noteSection.id = 'note-section';
    noteSection.style.display = pad.cc !== null ? 'none' : 'block';

    addEditorSection(noteSection, 'MIDI Noot');
    const noteRow = document.createElement('div');
    noteRow.style.cssText = 'display:flex; gap:6px; align-items:center;';

    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.value = noteToName(pad.note);
    noteInput.placeholder = 'bijv. C2';
    styleInput(noteInput, '80px');
    noteInput.addEventListener('change', () => {
      const n = nameToNote(noteInput.value);
      if (n !== null) {
        padBanks[bankIdx][padIdx].note = n;
        noteInput.value = noteToName(n);
        savePads(); renderPads();
      } else {
        noteInput.value = noteToName(pad.note);
      }
    });
    noteRow.appendChild(noteInput);

    // Noot omhoog/omlaag knoppen
    const noteDown = document.createElement('button');
    noteDown.textContent = '▼';
    noteDown.onclick = () => {
      const cur = padBanks[bankIdx][padIdx].note;
      if (cur > 0) {
        padBanks[bankIdx][padIdx].note = cur - 1;
        noteInput.value = noteToName(cur - 1);
        savePads(); renderPads();
      }
    };
    styleBtn(noteDown, '#37474F', '28px');
    noteRow.appendChild(noteDown);

    const noteUp = document.createElement('button');
    noteUp.textContent = '▲';
    noteUp.onclick = () => {
      const cur = padBanks[bankIdx][padIdx].note;
      if (cur < 127) {
        padBanks[bankIdx][padIdx].note = cur + 1;
        noteInput.value = noteToName(cur + 1);
        savePads(); renderPads();
      }
    };
    styleBtn(noteUp, '#37474F', '28px');
    noteRow.appendChild(noteUp);
    noteSection.appendChild(noteRow);

    // MIDI Learn knop voor noot
    const learnNoteBtn = document.createElement('button');
    learnNoteBtn.textContent = '🎹 MIDI Learn noot';
    learnNoteBtn.style.cssText = 'margin-top:6px; width:100%;';
    learnNoteBtn.onclick = () => startLearn(bankIdx, padIdx, 'note');
    styleBtn(learnNoteBtn, '#E65100');
    noteSection.appendChild(learnNoteBtn);

    // Kanaal instelling
    addEditorSection(noteSection, 'MIDI Kanaal');
    const chanInput = document.createElement('input');
    chanInput.type = 'number';
    chanInput.min = 1; chanInput.max = 16;
    chanInput.value = pad.channel;
    styleInput(chanInput, '60px');
    chanInput.addEventListener('change', () => {
      const v = parseInt(chanInput.value, 10);
      if (v >= 1 && v <= 16) {
        padBanks[bankIdx][padIdx].channel = v;
        savePads();
      }
    });
    noteSection.appendChild(chanInput);
    editorEl.appendChild(noteSection);

    // ── CC instelling ──────────────────────────────────────────────────
    const ccSection = document.createElement('div');
    ccSection.id = 'cc-section';
    ccSection.style.display = pad.cc !== null ? 'block' : 'none';

    addEditorSection(ccSection, 'CC Nummer (0–127)');
    const ccRow = document.createElement('div');
    ccRow.style.cssText = 'display:flex; gap:6px; align-items:center;';

    const ccInput = document.createElement('input');
    ccInput.type = 'number';
    ccInput.min = 0; ccInput.max = 127;
    ccInput.value = pad.cc !== null ? pad.cc : 0;
    styleInput(ccInput, '70px');
    ccInput.addEventListener('change', () => {
      const v = parseInt(ccInput.value, 10);
      if (v >= 0 && v <= 127) {
        padBanks[bankIdx][padIdx].cc = v;
        savePads(); renderPads();
      }
    });
    ccRow.appendChild(ccInput);

    const learnCCBtn = document.createElement('button');
    learnCCBtn.textContent = '🎛 Learn CC';
    learnCCBtn.onclick = () => startLearn(bankIdx, padIdx, 'cc');
    styleBtn(learnCCBtn, '#E65100');
    ccRow.appendChild(learnCCBtn);
    ccSection.appendChild(ccRow);
    editorEl.appendChild(ccSection);

    // ── Kleur kiezer ──────────────────────────────────────────────────
    addEditorSection(editorEl, 'Kleur');
    const colorGrid = document.createElement('div');
    colorGrid.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px;';

    Object.entries(PAD_COLORS).forEach(([key, def]) => {
      const sw = document.createElement('div');
      sw.title = def.label;
      sw.style.cssText = `
        width:28px; height:28px; border-radius:6px;
        background:${def.bg}; cursor:pointer;
        border: 3px solid ${pad.color === key ? '#fff' : 'transparent'};
        transition: border-color 0.15s;
      `;
      sw.addEventListener('click', () => {
        padBanks[bankIdx][padIdx].color = key;
        savePads(); renderPads();
        // Update preview en alle swatches
        document.getElementById('editor-pad-preview').style.background = def.bg;
        colorGrid.querySelectorAll('div').forEach(s => s.style.border = '3px solid transparent');
        sw.style.border = '3px solid #fff';
      });
      colorGrid.appendChild(sw);
    });
    editorEl.appendChild(colorGrid);

    // ── Positie editor naast het pad ──────────────────────────────────
    editorEl.style.display = 'block';
    const rect = anchorEl.getBoundingClientRect();
    let left = rect.right + 8;
    let top  = rect.top;
    // Zorg dat editor niet buiten het scherm valt
    const edW = 260;
    const edH = 400;
    if (left + edW > window.innerWidth)  left = rect.left - edW - 8;
    if (top  + edH > window.innerHeight) top  = window.innerHeight - edH - 8;
    editorEl.style.left = Math.max(8, left) + 'px';
    editorEl.style.top  = Math.max(8, top)  + 'px';

    // Klik buiten editor sluit hem
    setTimeout(() => {
      document.addEventListener('mousedown', outsideClick);
    }, 100);
  }

  /** Sluit de editor. */
  function closeEditor() {
    if (editorEl) editorEl.style.display = 'none';
    editorOpen = null;
    document.removeEventListener('mousedown', outsideClick);
  }

  /** Sluit editor als er buiten geklikt wordt. */
  function outsideClick(e) {
    if (editorEl && !editorEl.contains(e.target)) {
      closeEditor();
    }
  }

  /** Wissel modus tussen noot en CC voor een pad. */
  function setMode(mode, bankIdx, padIdx) {
    if (mode === 'note') {
      padBanks[bankIdx][padIdx].cc = null;
    } else {
      padBanks[bankIdx][padIdx].cc = 0;
    }
    savePads();
    // Update editor UI
    document.getElementById('note-section').style.display = mode === 'note' ? 'block' : 'none';
    document.getElementById('cc-section').style.display   = mode === 'cc'   ? 'block' : 'none';
    document.getElementById('mode-note-btn').style.background = mode === 'note' ? '#1565C0' : '#2c3e50';
    document.getElementById('mode-cc-btn').style.background   = mode === 'cc'   ? '#1565C0' : '#2c3e50';
    renderPads();
  }

  // ── MIDI LEARN ────────────────────────────────────────────────────────────

  /** Start MIDI Learn voor een pad. */
  function startLearn(bankIdx, padIdx, mode) {
    learnTarget = { bankIdx, padIdx };
    learnMode   = mode;

    const pad = padBanks[bankIdx][padIdx];
    statusEl.textContent = mode === 'note'
      ? `🎹 Sla pad ${pad.id} aan op de VersaKey…`
      : `🎛 Draai een knop op de VersaKey voor CC…`;
    statusEl.style.display = 'block';

    // Highlight de pad
    const el = document.getElementById(`pad-el-${bankIdx}-${padIdx}`);
    if (el) el.style.border = '2px solid #FF6D00';

    // Automatisch stoppen na 10 seconden
    setTimeout(() => {
      if (learnTarget) cancelLearn();
    }, 10000);
  }

  /** Pas de MIDI Learn resultaten toe. */
  function applyLearn(note, cc) {
    if (!learnTarget) return;
    const { bankIdx, padIdx } = learnTarget;

    if (learnMode === 'note' && note !== null) {
      padBanks[bankIdx][padIdx].note = note;
      padBanks[bankIdx][padIdx].cc   = null;
      showLearnConfirm(`✅ Noot: ${noteToName(note)}`);
    } else if (learnMode === 'cc' && cc !== null) {
      padBanks[bankIdx][padIdx].cc = cc;
      showLearnConfirm(`✅ CC${cc} gekoppeld`);
    }

    savePads();
    cancelLearn();
    renderPads();
    // Heropen editor met bijgewerkte waarden
    if (editorOpen) {
      const el = document.getElementById(`pad-el-${editorOpen.bankIdx}-${editorOpen.padIdx}`);
      if (el) openEditor(editorOpen.bankIdx, editorOpen.padIdx, el);
    }
  }

  /** Annuleer MIDI Learn. */
  function cancelLearn() {
    if (learnTarget) {
      const el = document.getElementById(`pad-el-${learnTarget.bankIdx}-${learnTarget.padIdx}`);
      if (el) el.style.border = '2px solid transparent';
    }
    learnTarget = null;
    statusEl.style.display = 'none';
  }

  /** Toon korte bevestiging na succesvolle learn. */
  function showLearnConfirm(msg) {
    statusEl.textContent = msg;
    statusEl.style.background = '#2E7D32';
    statusEl.style.display = 'block';
    setTimeout(() => {
      statusEl.style.background = '#E65100';
      statusEl.style.display = 'none';
    }, 1800);
  }

  // ── BANK WISSELEN ─────────────────────────────────────────────────────────

  /** Wissel tussen bank 1–8 en bank 9–16. */
  function toggleBank() {
    activeBankIdx = activeBankIdx === 0 ? 1 : 0;
    closeEditor();
    cancelLearn();
    renderPads();
  }

  // ── RESET ─────────────────────────────────────────────────────────────────

  /** Reset de actieve bank naar fabriekswaarden. */
  function resetActiveBank() {
    if (!confirm(`Bank ${activeBankIdx + 1} terugzetten naar fabriekswaarden?`)) return;
    padBanks[activeBankIdx] = JSON.parse(JSON.stringify(FACTORY_BANKS[activeBankIdx]));
    savePads();
    closeEditor();
    renderPads();
  }

  // ── STIJL HELPERS ─────────────────────────────────────────────────────────

  function styleBtn(btn, bg, width) {
    btn.style.cssText = `
      background:${bg}; color:#fff; border:none; border-radius:6px;
      padding:5px ${width ? '6px' : '10px'}; font-size:11px; font-weight:600;
      cursor:pointer; ${width ? 'width:' + width + ';' : ''}
      transition: filter 0.1s;
    `;
    btn.addEventListener('mouseenter', () => btn.style.filter = 'brightness(1.2)');
    btn.addEventListener('mouseleave', () => btn.style.filter = '');
  }

  function styleInput(el, width) {
    el.style.cssText = `
      background:#0d1821; color:#fff; border:1px solid #3a5068;
      border-radius:6px; padding:5px 8px; font-size:12px;
      ${width ? 'width:' + width + ';' : 'width:100%;'}
      box-sizing:border-box; margin-bottom:6px;
    `;
  }

  function addEditorSection(parent, label) {
    const lbl = document.createElement('div');
    lbl.textContent = label;
    lbl.style.cssText = `
      color:#78909C; font-size:10px; font-weight:700;
      text-transform:uppercase; letter-spacing:0.5px;
      margin: 10px 0 4px;
    `;
    parent.appendChild(lbl);
  }

  // ── INITIALISATIE ─────────────────────────────────────────────────────────

  /** Start de pad-programmer module. */
  function init() {
    loadPads();
    buildUI();
    hookMidi();
    console.log('[PadProgrammer] ✅ v1.0.0 geladen — 16 pads (2 banken) klaar');
  }

  // Start zodra de DOM gereed is
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── PUBLIEK API (voor debugging en integratie) ───────────────────────────
  window.PadProgrammer = {
    /** Haal huidige pad-instellingen op. */
    getBanks:  () => JSON.parse(JSON.stringify(padBanks)),
    /** Sla een pad direct in (voor integratie met bestaande app). */
    setPad: (bankIdx, padIdx, props) => {
      Object.assign(padBanks[bankIdx][padIdx], props);
      savePads(); renderPads();
    },
    /** Reset alles naar fabriekswaarden. */
    resetAll: () => {
      padBanks = JSON.parse(JSON.stringify(FACTORY_BANKS));
      savePads(); renderPads();
    },
    /** Wissel bank. */
    switchBank: toggleBank,
  };

}());
