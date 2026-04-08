// SceneDelegate.swift
// ─────────────────────────────────────────────────────────────────────────────
// Devine VersaKey 49 — Companion App · iOS
// Versie : 1.0.0
// Datum  : 2026-04-07
//
// WAT DIT BESTAND DOET
// ─────────────────────
// Beheert het app venster (UIWindow) en laadt de ViewController.
// iOS 13+ gebruikt scenes voor venster beheer.
// ─────────────────────────────────────────────────────────────────────────────

import UIKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    /// Het hoofd app venster
    var window: UIWindow?

    // ── SCENE AANMAKEN ────────────────────────────────────────────────────────

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        // Zorg dat het een UIWindowScene is (niet een andere scene type)
        guard let windowScene = scene as? UIWindowScene else { return }

        // Maak het venster aan — vult het volledige scherm
        let window = UIWindow(windowScene: windowScene)

        // Zet de ViewController als root — dit start de app UI
        window.rootViewController = ViewController()

        // Toon het venster
        window.makeKeyAndVisible()

        // Bewaar referentie
        self.window = window

        print("[SceneDelegate] ✅ Venster aangemaakt — ViewController geladen")
    }

    // ── ACHTERGROND / VOORGROND ────────────────────────────────────────────────
    // Wij hoeven hier niets te doen — MIDIManager blijft actief dankzij
    // de UIBackgroundModes: audio instelling in Info.plist.

    func sceneDidBecomeActive(_ scene: UIScene) {
        print("[SceneDelegate] App actief")
    }

    func sceneWillResignActive(_ scene: UIScene) {
        print("[SceneDelegate] App naar achtergrond")
    }
}
