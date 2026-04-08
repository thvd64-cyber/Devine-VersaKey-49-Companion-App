// MIDIManager.swift
// ─────────────────────────────────────────────────────────────────────────────
// Devine VersaKey 49 — Companion App · iOS
// Versie : 1.0.0
// Datum  : 2026-04-07
//
// WAT DIT BESTAND DOET
// ─────────────────────
// MIDIManager is verantwoordelijk voor ALLES wat met MIDI hardware te maken
// heeft. Het gebruikt Apple's CoreMIDI framework dat standaard in iOS zit.
//
// VERANTWOORDELIJKHEDEN
// ──────────────────────
//  1. Opstart  — maakt een MIDIClient aan (toegangspunt tot CoreMIDI)
//  2. Detectie — scant verbonden USB MIDI devices, herkent de VersaKey
//  3. Hot-plug — reageert als de VersaKey wordt aan/losgekoppeld
//  4. Ontvangst — vangt alle MIDI berichten op (Note On/Off, CC, Pitch Bend…)
//  5. Callback  — stuurt berichten door naar ViewController via onMIDIMessage
//
// GEBRUIK (in ViewController.swift)
// ──────────────────────────────────
//  let midi = MIDIManager()
//  midi.onMIDIMessage = { status, data1, data2 in
//      // stuur naar WKWebView
//  }
//  midi.onDeviceStateChange = { connected, name in
//      // update UI
//  }
//  midi.start()
// ─────────────────────────────────────────────────────────────────────────────

import CoreMIDI      // Apple MIDI framework — altijd aanwezig op iOS
import Foundation    // Voor logging, NotificationCenter

// ── MIDI MANAGER KLASSE ───────────────────────────────────────────────────────

/// Beheert de CoreMIDI verbinding met de Devine VersaKey 49.
/// Stuurt ontvangen MIDI berichten door via callback closures.
final class MIDIManager {

    // ── CALLBACKS — ViewController koppelt hier aan ───────────────────────────

    /// Aangeroepen voor elk ontvangen MIDI bericht van de VersaKey.
    /// Parameters: status byte, data byte 1, data byte 2
    /// Voorbeeld: onMIDIMessage(0x90, 60, 80) = Note On C4 velocity 80
    var onMIDIMessage: ((_ status: UInt8, _ data1: UInt8, _ data2: UInt8) -> Void)?

    /// Aangeroepen als de VersaKey verbinding verandert.
    /// Parameters: isConnected (true/false), device naam
    var onDeviceStateChange: ((_ connected: Bool, _ deviceName: String) -> Void)?

    // ── INTERNE STAAT ─────────────────────────────────────────────────────────

    /// CoreMIDI client handle — het toegangspunt tot het MIDI systeem
    private var midiClient: MIDIClientRef = 0

    /// Onze input poort — hierop ontvangen wij berichten van de VersaKey
    private var inputPort: MIDIPortRef = 0

    /// Naam van de VersaKey zoals iOS die ziet (voor logging en herkenning)
    private var connectedDeviceName: String = ""

    /// Bijhouden of er een VersaKey verbonden is
    private(set) var isDeviceConnected: Bool = false

    /// Zoekwoorden om de VersaKey te herkennen tussen andere MIDI devices
    /// iOS ziet het device als "Devine VersaKey" of vergelijkbaar
    private let recognitionKeywords = ["versakey", "devine", "versakey 49"]

    // ── OPSTART ───────────────────────────────────────────────────────────────

    /// Start de MIDI manager. Aanroepen vanuit viewDidLoad() in ViewController.
    func start() {
        log("MIDIManager start — CoreMIDI initialiseren")
        createMIDIClient()
        createInputPort()
        scanExistingDevices()
    }

    // ── STAP 1: MIDI CLIENT AANMAKEN ──────────────────────────────────────────

    /// Maakt een CoreMIDI client aan en registreert de notification callback.
    /// De notification callback wordt aangeroepen als devices worden
    /// aangesloten of verwijderd (hot-plug).
    private func createMIDIClient() {
        // De naam van onze client — zichtbaar in MIDI Monitor apps
        let clientName = "VersaKeyCompanionClient" as CFString

        // Zelf-referentie als UnsafeMutableRawPointer voor de C callback
        // Dit is de standaard manier om 'self' door te geven aan C callbacks in Swift
        let selfPtr = Unmanaged.passRetained(self).toOpaque()

        // Maak de MIDI client aan met een notification callback
        // De callback wordt aangeroepen bij elke MIDI systeem verandering
        let status = MIDIClientCreate(
            clientName,
            { notificationPtr, contextPtr in
                // Haal de MIDIManager instantie terug uit de context pointer
                guard let ctx = contextPtr else { return }
                let manager = Unmanaged<MIDIManager>.fromOpaque(ctx).takeUnretainedValue()
                // Verwerk de notificatie (device aan/losgekoppeld)
                manager.handleMIDINotification(notificationPtr)
            },
            selfPtr,
            &midiClient
        )

        if status != noErr {
            log("❌ Kon geen MIDI client aanmaken. Status: \(status)")
        } else {
            log("✅ MIDI client aangemaakt")
        }
    }

    // ── STAP 2: INPUT POORT AANMAKEN ─────────────────────────────────────────

    /// Maakt een MIDI input poort aan.
    /// Alle MIDI berichten van verbonden devices komen binnen op deze poort.
    private func createInputPort() {
        let portName = "VersaKeyInputPort" as CFString

        // Zelf-referentie voor de C read callback
        let selfPtr = Unmanaged.passRetained(self).toOpaque()

        // Maak de input poort aan met een read callback
        // De read callback wordt aangeroepen voor elk ontvangen MIDI bericht
        let status = MIDIInputPortCreate(
            midiClient,
            portName,
            { packetListPtr, contextPtr, _ in
                // Haal de MIDIManager terug
                guard let ctx = contextPtr else { return }
                let manager = Unmanaged<MIDIManager>.fromOpaque(ctx).takeUnretainedValue()
                // Verwerk het MIDI packet
                manager.handleMIDIPacketList(packetListPtr)
            },
            selfPtr,
            &inputPort
        )

        if status != noErr {
            log("❌ Kon geen input poort aanmaken. Status: \(status)")
        } else {
            log("✅ MIDI input poort aangemaakt")
        }
    }

    // ── STAP 3: BESTAANDE DEVICES SCANNEN ────────────────────────────────────

    /// Scant alle MIDI sources die al verbonden zijn bij app-start.
    /// Nodig als de VersaKey al was aangesloten voordat de app startte.
    private func scanExistingDevices() {
        // Aantal MIDI sources (= inputs van externe devices)
        let sourceCount = MIDIGetNumberOfSources()
        log("Scannen — \(sourceCount) MIDI source(s) gevonden")

        for i in 0 ..< sourceCount {
            let source = MIDIGetSource(i)
            connectSourceIfVersaKey(source)
        }

        if !isDeviceConnected {
            log("⚠️  Geen VersaKey gevonden bij opstart. Wacht op aansluiting...")
        }
    }

    // ── DEVICE HERKENNING ─────────────────────────────────────────────────────

    /// Controleert of een MIDI source de VersaKey is en verbindt hem zo ja.
    /// Herkenning op basis van device naam (hoofdletterongevoelig).
    private func connectSourceIfVersaKey(_ source: MIDIEndpointRef) {
        // Lees de naam van dit MIDI device
        guard let name = getMIDIPropertyString(source, property: kMIDIPropertyName) else {
            log("  Device zonder naam — overgeslagen")
            return
        }

        let nameLower = name.lowercased()
        log("  Gevonden MIDI source: '\(name)'")

        // Controleer of de naam één van onze zoekwoorden bevat
        let isVersaKey = recognitionKeywords.contains { nameLower.contains($0) }

        if isVersaKey {
            connectSource(source, name: name)
        }
    }

    /// Verbindt een MIDI source met onze input poort.
    /// Vanaf dit moment ontvangen wij alle berichten van dit device.
    private func connectSource(_ source: MIDIEndpointRef, name: String) {
        // Verbind de source met onze input poort
        // selfPtr als connectionRefCon zodat wij hem later kunnen identificeren
        let selfPtr = Unmanaged.passRetained(self).toOpaque()
        let status = MIDIPortConnectSource(inputPort, source, selfPtr)

        if status == noErr {
            connectedDeviceName = name
            isDeviceConnected = true
            log("✅ VersaKey verbonden: '\(name)'")

            // Informeer ViewController via callback (op main thread voor UI updates)
            DispatchQueue.main.async { [weak self] in
                self?.onDeviceStateChange?(true, name)
            }
        } else {
            log("❌ Kon niet verbinden met '\(name)'. Status: \(status)")
        }
    }

    // ── HOT-PLUG NOTIFICATIES ─────────────────────────────────────────────────

    /// Verwerkt CoreMIDI notificaties — device aan/losgekoppeld, setup verandering.
    /// Wordt aangeroepen door de C callback in createMIDIClient().
    private func handleMIDINotification(_ notificationPtr: UnsafePointer<MIDINotification>?) {
        guard let notification = notificationPtr?.pointee else { return }

        switch notification.messageID {

        case .msgObjectAdded:
            // Nieuw MIDI device aangesloten
            log("📡 MIDI device aangesloten — opnieuw scannen")
            // Korte vertraging zodat iOS het device volledig heeft geregistreerd
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
                self?.scanExistingDevices()
            }

        case .msgObjectRemoved:
            // MIDI device verwijderd
            log("📡 MIDI device verwijderd")
            if isDeviceConnected {
                let name = connectedDeviceName
                isDeviceConnected = false
                connectedDeviceName = ""

                DispatchQueue.main.async { [weak self] in
                    self?.onDeviceStateChange?(false, name)
                }
            }

        case .msgSetupChanged:
            // MIDI setup veranderd — rescan
            log("📡 MIDI setup veranderd — opnieuw scannen")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in
                self?.scanExistingDevices()
            }

        default:
            break // Andere notificaties negeren
        }
    }

    // ── MIDI BERICHT VERWERKING ───────────────────────────────────────────────

    /// Verwerkt een binnenkomende MIDIPacketList.
    /// Eén PacketList kan meerdere packets bevatten — wij verwerken ze allemaal.
    /// Wordt aangeroepen door de C read callback in createInputPort().
    private func handleMIDIPacketList(_ packetListPtr: UnsafePointer<MIDIPacketList>?) {
        guard let packetList = packetListPtr?.pointee else { return }

        // Itereer over alle packets in de lijst
        var packet = packetList.packet
        for _ in 0 ..< packetList.numPackets {
            handleMIDIPacket(packet)
            // Ga naar het volgende packet in de lijst
            packet = MIDIPacketNext(&packet).pointee
        }
    }

    /// Verwerkt één MIDI packet.
    /// Extraheert de bytes en stuurt ze door naar de callback.
    private func handleMIDIPacket(_ packet: MIDIPacket) {
        // Een MIDI packet bevat 1 of meer bytes
        // De eerste byte is altijd de status byte
        // Wij lezen maximaal 3 bytes (het maximum voor standaard MIDI berichten)

        // packet.data is een tuple van 256 bytes — wij lezen via mirror of directe index
        let byte0 = packet.data.0  // Status byte
        let byte1 = packet.data.1  // Data byte 1 (bijv. nootnummer)
        let byte2 = packet.data.2  // Data byte 2 (bijv. velocity)

        // Filter ongeldige berichten
        guard packet.length >= 1 else { return }
        guard byte0 >= 0x80 else { return } // Echte status bytes beginnen vanaf 0x80

        // Bepaal hoeveel bytes dit bericht heeft
        let expectedLength = midiMessageLength(status: byte0)
        guard packet.length >= expectedLength else { return }

        // Stuur door naar ViewController callback (op main thread)
        let status = byte0
        let data1  = packet.length > 1 ? byte1 : 0
        let data2  = packet.length > 2 ? byte2 : 0

        DispatchQueue.main.async { [weak self] in
            self?.onMIDIMessage?(status, data1, data2)
        }
    }

    /// Geeft de verwachte lengte van een MIDI bericht op basis van de status byte.
    /// Gebruikt om incomplete packets te filteren.
    private func midiMessageLength(status: UInt8) -> Int {
        let type = status & 0xF0  // Status type zonder kanaalinformatie

        switch type {
        case 0x80, // Note Off          — 3 bytes
             0x90, // Note On           — 3 bytes
             0xA0, // Aftertouch Poly   — 3 bytes
             0xB0, // Control Change    — 3 bytes
             0xE0: // Pitch Bend        — 3 bytes
            return 3

        case 0xC0, // Program Change    — 2 bytes
             0xD0: // Channel Pressure  — 2 bytes
            return 2

        case 0xF0: // System berichten  — variabel, wij accepteren elk
            return 1

        default:
            return 1
        }
    }

    // ── COREMIDI HULPFUNCTIES ─────────────────────────────────────────────────

    /// Leest een string property van een MIDI object (device, endpoint).
    /// Retourneert nil als de property niet bestaat of leeg is.
    private func getMIDIPropertyString(
        _ object: MIDIObjectRef,
        property: CFString
    ) -> String? {
        var value: Unmanaged<CFString>?
        let status = MIDIObjectGetStringProperty(object, property, &value)
        guard status == noErr, let cfString = value?.takeRetainedValue() else {
            return nil
        }
        let result = cfString as String
        return result.isEmpty ? nil : result
    }

    // ── LOGGING ───────────────────────────────────────────────────────────────

    /// Interne log functie — prefix maakt het makkelijk te filteren in Xcode.
    private func log(_ message: String) {
        print("[MIDIManager] \(message)")
    }

    // ── OPRUIMEN ─────────────────────────────────────────────────────────────

    /// Geeft CoreMIDI resources vrij bij app-afsluiting.
    deinit {
        if inputPort != 0  { MIDIPortDispose(inputPort) }
        if midiClient != 0 { MIDIClientDispose(midiClient) }
        log("MIDIManager vrijgegeven")
    }
}
