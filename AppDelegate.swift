// AppDelegate.swift
// ─────────────────────────────────────────────────────────────────────────────
// Devine VersaKey 49 — Companion App · iOS
// Versie : 1.0.0
// Datum  : 2026-04-07
//
// WAT DIT BESTAND DOET
// ─────────────────────
// Standaard iOS app entry point. Beheert de app lifecycle.
// De meeste logica zit in ViewController.swift en MIDIManager.swift.
// ─────────────────────────────────────────────────────────────────────────────

import UIKit
import AVFoundation   // Voor audio sessie configuratie (MIDI + audio)

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {

    /// Het hoofd app venster
    var window: UIWindow?

    // ── APP GESTART ───────────────────────────────────────────────────────────

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {

        // ── Audio sessie configuratie ─────────────────────────────────────────
        // Wij configureren de AVAudioSession zodat:
        //  - Geluid werkt ook als de stille schakelaar aan staat
        //  - Audio blijft werken als de app op de achtergrond staat
        //  - MIDI verwerking blijft actief op de achtergrond
        configureAudioSession()

        print("[AppDelegate] VersaKey Companion App gestart")
        return true
    }

    // ── AUDIO SESSIE ──────────────────────────────────────────────────────────

    /// Configureert de AVAudioSession voor muziek-app gebruik.
    /// .playback categorie = audio speelt ook met stille schakelaar aan.
    private func configureAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()

            // .playback = audio ook bij stille modus
            // .mixWithOthers optie = andere audio (Spotify, etc.) wordt niet gestopt
            try session.setCategory(.playback, options: [.mixWithOthers])
            try session.setActive(true)

            print("[AppDelegate] ✅ Audio sessie geconfigureerd (.playback)")
        } catch {
            print("[AppDelegate] ❌ Audio sessie fout: \(error.localizedDescription)")
            // Geen fatale fout — de app werkt nog maar audio gedraagt zich misschien anders
        }
    }

    // ── SCENE DELEGATE (iOS 13+) ──────────────────────────────────────────────
    // iOS 13+ gebruikt SceneDelegate voor venster beheer.
    // Wij verwijzen hier naar de SceneDelegate class.

    func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        return UISceneConfiguration(
            name: "Default Configuration",
            sessionRole: connectingSceneSession.role
        )
    }
}
