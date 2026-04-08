// ViewController.swift
// ─────────────────────────────────────────────────────────────────────────────
// Devine VersaKey 49 — Companion App · iOS
// Versie : 1.0.0
// Datum  : 2026-04-07
//
// WAT DIT BESTAND DOET
// ─────────────────────
// ViewController is de spil van de app. Het combineert drie dingen:
//  1. WKWebView   — laadt index.html en toont de Companion App
//  2. MIDI bridge — stuurt berichten van MIDIManager door naar de webpagina
//  3. Status UI   — toont een overlay als er geen VersaKey gevonden wordt
//
// COMMUNICATIE SCHEMA
// ────────────────────
//  VersaKey → CoreMIDI → MIDIManager → ViewController → WKWebView → index.html
//                                           ↑
//                              evaluateJavaScript("window.iOSMIDIBridge(...)")
//
// WEBVIEW INJECTIE VOLGORDE
// ──────────────────────────
//  1. midi-ios-bridge.js wordt geladen VIA WKUserScript (atDocumentStart)
//  2. index.html wordt geladen — ziet navigator.requestMIDIAccess() als aanwezig
//  3. index.html roept requestMIDIAccess() aan — bridge retourneert MIDIAccess
//  4. index.html registreert onmidimessage handlers
//  5. Wij sturen MIDI via evaluateJavaScript() — index.html reageert normaal
// ─────────────────────────────────────────────────────────────────────────────

import UIKit
import WebKit      // WKWebView — de ingebouwde browser engine
import CoreMIDI    // Voor de MIDIManager

// ── VIEW CONTROLLER ───────────────────────────────────────────────────────────

/// Hoofd view controller van de VersaKey Companion App voor iOS.
/// Beheert de WKWebView, de MIDI bridge en de status overlay.
final class ViewController: UIViewController {

    // ── INTERNE OBJECTEN ──────────────────────────────────────────────────────

    /// De webview die index.html toont
    private var webView: WKWebView!

    /// De MIDI manager die de VersaKey hardware beheert
    private var midiManager: MIDIManager!

    /// Overlay view die wordt getoond als er geen VersaKey gevonden is
    private var statusOverlay: UIView!

    /// Label in de overlay met de statusmelding
    private var statusLabel: UILabel!

    /// Verbinding gemeld status bijhouden om dubbele bridge-aanroepen te voorkomen
    private var lastReportedConnection: Bool? = nil

    // ── LIFECYCLE ─────────────────────────────────────────────────────────────

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black

        log("App gestart — opbouw UI")

        // Stap 1: Laad de JavaScript bridge polyfill uit de app bundle
        let bridgeScript = loadBridgeScript()

        // Stap 2: Maak de WKWebView aan met de bridge injectie
        setupWebView(bridgeScript: bridgeScript)

        // Stap 3: Maak de status overlay aan (verborgen totdat nodig)
        setupStatusOverlay()

        // Stap 4: Laad index.html in de webview
        loadCompanionApp()

        // Stap 5: Start de MIDI manager
        setupMIDIManager()
    }

    // ── STAP 1: BRIDGE SCRIPT LADEN ──────────────────────────────────────────

    /// Leest midi-ios-bridge.js uit de app bundle.
    /// Dit bestand wordt meegebundeld in Xcode als onderdeel van WebApp/.
    /// Retourneert een lege string als het bestand niet gevonden wordt.
    private func loadBridgeScript() -> String {
        guard let url = Bundle.main.url(
            forResource: "midi-ios-bridge",
            withExtension: "js",
            subdirectory: "WebApp"       // map in de app bundle
        ) else {
            log("❌ midi-ios-bridge.js niet gevonden in app bundle!")
            return ""
        }

        do {
            let source = try String(contentsOf: url, encoding: .utf8)
            log("✅ midi-ios-bridge.js geladen (\(source.count) tekens)")
            return source
        } catch {
            log("❌ Kon midi-ios-bridge.js niet lezen: \(error)")
            return ""
        }
    }

    // ── STAP 2: WEBVIEW AANMAKEN ──────────────────────────────────────────────

    /// Maakt de WKWebView aan en configureert de JavaScript bridge injectie.
    /// De bridge wordt geladen VOOR index.html via WKUserScript atDocumentStart.
    private func setupWebView(bridgeScript: String) {
        // Configureer de WKWebView
        let config = WKWebViewConfiguration()

        // ── JavaScript bridge injectie ────────────────────────────────────────
        // WKUserScript injecteert het script vóór de pagina laadt.
        // .atDocumentStart = script is beschikbaar voordat index.html zijn eigen
        // scripts laadt — dit is essentieel zodat requestMIDIAccess() al bestaat.
        if !bridgeScript.isEmpty {
            let userScript = WKUserScript(
                source: bridgeScript,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: true  // Alleen in de hoofdpagina, niet in iframes
            )
            config.userContentController.addUserScript(userScript)
            log("✅ MIDI bridge script geregistreerd voor injectie")
        }

        // ── Web Audio toestaan ────────────────────────────────────────────────
        // index.html gebruikt Web Audio API voor geluidsweergave.
        // mediaTypesRequiringUserActionForPlayback = [] = audio zonder gebruikersactie
        config.mediaTypesRequiringUserActionForPlayback = []

        // ── Maak de WKWebView aan ─────────────────────────────────────────────
        webView = WKWebView(frame: .zero, configuration: config)
        webView.translatesAutoresizingMaskIntoConstraints = false

        // Achtergrondkleur zwart tijdens laden (voorkomt witte flits)
        webView.backgroundColor = .black
        webView.isOpaque = false

        // Schakel pinch-to-zoom uit — onze app heeft eigen zoom functie
        webView.scrollView.pinchGestureRecognizer?.isEnabled = false

        // Delegate voor load callbacks
        webView.navigationDelegate = self

        // Voeg de webview toe aan de view
        view.addSubview(webView)

        // ── Auto Layout: webview vult het volledige scherm ────────────────────
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])

        log("✅ WKWebView aangemaakt en geconfigureerd")
    }

    // ── STAP 3: STATUS OVERLAY ────────────────────────────────────────────────

    /// Maakt een overlay aan die getoond wordt als er geen VersaKey verbonden is.
    /// De overlay laat de webview zien maar toont een informatieve banner bovenaan.
    private func setupStatusOverlay() {
        // Container view — semi-transparant bovenaan het scherm
        statusOverlay = UIView()
        statusOverlay.translatesAutoresizingMaskIntoConstraints = false
        statusOverlay.backgroundColor = UIColor(red: 0.12, green: 0.22, blue: 0.37, alpha: 0.95)
        statusOverlay.layer.cornerRadius = 12
        statusOverlay.layer.maskedCorners = [.layerMinXMaxYCorner, .layerMaxXMaxYCorner]
        statusOverlay.isHidden = true  // Verborgen bij start

        // Status label
        statusLabel = UILabel()
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        statusLabel.text = "🎹  Sluit de VersaKey 49 aan via USB Camera Adapter"
        statusLabel.textColor = .white
        statusLabel.font = UIFont.systemFont(ofSize: 15, weight: .medium)
        statusLabel.textAlignment = .center
        statusLabel.numberOfLines = 2

        statusOverlay.addSubview(statusLabel)
        view.addSubview(statusOverlay)

        // Layout: overlay bovenaan, label gecentreerd
        NSLayoutConstraint.activate([
            // Overlay spans de volledige breedte bovenaan
            statusOverlay.topAnchor.constraint(equalTo: view.topAnchor),
            statusOverlay.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            statusOverlay.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            statusOverlay.heightAnchor.constraint(equalToConstant: 80),

            // Label gecentreerd in de overlay, met ruimte voor de safe area
            statusLabel.centerXAnchor.constraint(equalTo: statusOverlay.centerXAnchor),
            statusLabel.bottomAnchor.constraint(equalTo: statusOverlay.bottomAnchor, constant: -12),
            statusLabel.leadingAnchor.constraint(equalTo: statusOverlay.leadingAnchor, constant: 16),
            statusLabel.trailingAnchor.constraint(equalTo: statusOverlay.trailingAnchor, constant: -16),
        ])

        log("✅ Status overlay aangemaakt")
    }

    // ── STAP 4: INDEX.HTML LADEN ──────────────────────────────────────────────

    /// Laadt index.html uit de app bundle in de WKWebView.
    /// Het bestand wordt lokaal geladen — geen server of internet nodig.
    private func loadCompanionApp() {
        guard let htmlURL = Bundle.main.url(
            forResource: "index",
            withExtension: "html",
            subdirectory: "WebApp"
        ) else {
            log("❌ index.html niet gevonden in app bundle!")
            showError("index.html ontbreekt in de app. Herinstalleer de app.")
            return
        }

        // Laad het HTML bestand — allowingReadAccessTo geeft toegang tot de WebApp/ map
        // zodat ook sw.js, manifest.json en andere bestanden geladen kunnen worden
        webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlURL.deletingLastPathComponent())
        log("✅ index.html geladen vanuit app bundle")
    }

    // ── STAP 5: MIDI MANAGER STARTEN ─────────────────────────────────────────

    /// Initialiseert de MIDIManager en koppelt de callbacks.
    private func setupMIDIManager() {
        midiManager = MIDIManager()

        // ── Callback: MIDI bericht ontvangen ─────────────────────────────────
        // Wordt aangeroepen vanuit MIDIManager voor elk bericht van de VersaKey.
        // Wij sturen het door naar de WKWebView via JavaScript.
        midiManager.onMIDIMessage = { [weak self] status, data1, data2 in
            self?.sendMIDIToWebView(status: status, data1: data1, data2: data2)
        }

        // ── Callback: Device verbinding veranderd ─────────────────────────────
        // Wordt aangeroepen als de VersaKey wordt aangesloten of verwijderd.
        midiManager.onDeviceStateChange = { [weak self] connected, name in
            self?.handleDeviceStateChange(connected: connected, name: name)
        }

        // Start de MIDI manager — scan bestaande devices en luister op notificaties
        midiManager.start()
        log("✅ MIDIManager gestart")
    }

    // ── MIDI NAAR WEBVIEW STUREN ──────────────────────────────────────────────

    /// Stuurt een MIDI bericht door naar index.html via JavaScript.
    /// Roept window.iOSMIDIBridge() aan in de WKWebView.
    ///
    /// - Parameters:
    ///   - status: MIDI status byte (bijv. 0x90 = Note On kanaal 1)
    ///   - data1:  Eerste data byte  (bijv. 60 = Middle C)
    ///   - data2:  Tweede data byte  (bijv. 80 = velocity)
    private func sendMIDIToWebView(status: UInt8, data1: UInt8, data2: UInt8) {
        // Bouw de JavaScript aanroep
        // window.iOSMIDIBridge is gedefinieerd in midi-ios-bridge.js
        let js = "window.iOSMIDIBridge(\(status), \(data1), \(data2))"

        // evaluateJavaScript moet altijd op de main thread — dit is al gegarandeerd
        // door de DispatchQueue.main.async in MIDIManager.handleMIDIPacket()
        webView.evaluateJavaScript(js) { _, error in
            if let error = error {
                // Veelvoorkomende oorzaak: pagina nog aan het laden
                // Wij loggen maar stoppen de app niet
                print("[ViewController] JavaScript fout: \(error.localizedDescription)")
            }
        }
    }

    // ── DEVICE STATUS AFHANDELING ─────────────────────────────────────────────

    /// Verwerkt een verandering in device verbinding.
    /// Toont/verbergt de overlay en informeert de webpagina.
    private func handleDeviceStateChange(connected: Bool, name: String) {
        // Vermijd dubbele meldingen (CoreMIDI kan meerdere notificaties sturen)
        guard lastReportedConnection != connected else { return }
        lastReportedConnection = connected

        log("Device staat veranderd: \(connected ? "verbonden" : "verbroken") — \(name)")

        // Update de status overlay
        updateStatusOverlay(connected: connected, name: name)

        // Informeer de webpagina via window.iOSMIDIStatus()
        let stateName = connected ? "connected" : "disconnected"
        let safeName  = name.replacingOccurrences(of: "'", with: "\\'")
        let js = "window.iOSMIDIStatus('\(stateName)', '\(safeName)')"

        webView.evaluateJavaScript(js) { _, error in
            if let error = error {
                print("[ViewController] iOSMIDIStatus fout: \(error.localizedDescription)")
            }
        }
    }

    /// Toont of verbergt de status overlay met animatie.
    private func updateStatusOverlay(connected: Bool, name: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            if connected {
                // Verberg de overlay met fade-out animatie
                UIView.animate(withDuration: 0.4) {
                    self.statusOverlay.alpha = 0
                } completion: { _ in
                    self.statusOverlay.isHidden = true
                    self.statusOverlay.alpha = 1
                }
                self.log("Overlay verborgen — VersaKey verbonden")
            } else {
                // Toon de overlay
                self.statusOverlay.isHidden = false
                self.statusOverlay.alpha = 0
                UIView.animate(withDuration: 0.4) {
                    self.statusOverlay.alpha = 1
                }
                self.log("Overlay getoond — wacht op VersaKey")
            }
        }
    }

    // ── FOUTMELDINGEN ─────────────────────────────────────────────────────────

    /// Toont een fatale foutmelding als de app niet kan starten.
    private func showError(_ message: String) {
        let alert = UIAlertController(
            title: "Fout bij opstarten",
            message: message,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }

    // ── LOGGING ───────────────────────────────────────────────────────────────

    private func log(_ message: String) {
        print("[ViewController] \(message)")
    }

    // ── SCHERM ORIËNTATIE ─────────────────────────────────────────────────────

    /// Ondersteun alle oriëntaties — de app werkt zowel staand als liggend.
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .all
    }
}

// ── WKNAVIGATION DELEGATE ─────────────────────────────────────────────────────

/// Callbacks voor webview navigatie events.
extension ViewController: WKNavigationDelegate {

    /// index.html is volledig geladen — app is klaar voor gebruik.
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        log("✅ index.html volledig geladen — app klaar")

        // Als er bij het laden nog geen VersaKey was: toon de overlay
        if !midiManager.isDeviceConnected {
            updateStatusOverlay(connected: false, name: "")
        }
    }

    /// Laad fout — toon een foutmelding.
    func webView(
        _ webView: WKWebView,
        didFailProvisionalNavigation navigation: WKNavigation!,
        withError error: Error
    ) {
        log("❌ Laad fout: \(error.localizedDescription)")
        showError("Kon de app niet laden: \(error.localizedDescription)")
    }

    /// Toestaan dat lokale bestanden geladen worden (voor sw.js, manifest.json etc.)
    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        decisionHandler(.allow)
    }
}
