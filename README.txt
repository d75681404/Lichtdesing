LichtFarben Pro — Farbdatenbank & Lichttechnik-Werkzeug
=========================================================

INBETRIEBNAHME
---------------
Einfach die Datei "index.html" per Doppelklick im Browser öffnen.
Kein Server, keine Installation, keine Internetverbindung nötig.
Optimiert für Safari auf iPad Pro, funktioniert aber in jedem
modernen Browser (Chrome, Edge, Firefox, Safari).

Hinweis: Manche Browser blockieren beim direkten Öffnen von lokalen
Dateien (file://) den Zugriff per fetch() auf farben.json. Die App
erkennt das automatisch und verwendet dann eine intern eingebettete
Kopie der vollständigen Farbdatenbank — die App funktioniert in
jedem Fall vollständig, auch ganz ohne lokalen Server.

DATEIEN
--------
- index.html   Struktur der Anwendung
- style.css    Dunkles, modernes Design mit Blur-Effekten
- script.js    Gesamte Anwendungslogik (ES6, keine Bibliotheken)
- farben.json  Farbdatenbank mit 246 professionellen Lichtfarben

FUNKTIONEN
-----------
1. Datenbank: 246 Lichtfarben mit RGB, RGBW, HEX, HSL, CMYK und
   Farbtemperatur (bei Weißtönen), durchsuch- und filterbar.
2. Vergleich: zwei Farben gegenüberstellen, Kontrastverhältnis (WCAG),
   Komplementärfarbe, Analog-, Triaden-, Split-Komplementär-,
   Tetraden- und Monochrom-Harmonien.
3. Lichttechnik: RGB→RGBW-Rechner, Live-Regler (Helligkeit, Sättigung,
   White-Level, Dimmer), additive Farbmischung, Crossfade-Überblendung.
4. Bühnenvorschau: 4 bis 36 Moving Heads, Wash-/Beam-Darstellung,
   Strobe-Effekt, schwarzer Bühnenhintergrund.
5. Favoriten & Presets: Farben speichern, Presets aus Favoriten
   erstellen, als JSON exportieren/importieren.
6. Extras: interaktiver Farbkreis, RGB-/HEX-Picker, Verlaufsgenerator,
   Zufalls-Farbkombinationen, Farbhistorie, Kopieren-Buttons.

Alle Einstellungen (Favoriten, Presets, Historie) werden lokal im
Browser gespeichert (localStorage) und bleiben zwischen Sitzungen
erhalten.
