/* =========================================================================
   LichtFarben Pro — script.js
   Vollständige Anwendungslogik: Datenbank, Suche, Vergleich, Lichttechnik,
   Bühnenvorschau, Favoriten/Presets, Extras.
   Reines ES6, keine externen Bibliotheken, vollständig offlinefähig.
   ========================================================================= */

"use strict";

/* ======================================================================
   0) EINGEBETTETE FALLBACK-FARBDATEN
   Der Browser blockiert bei lokal geöffneten Dateien (file://) häufig
   fetch()-Zugriffe auf farben.json (CORS-Restriktion). Damit die App nach
   einfachem Doppelklick auf index.html garantiert funktioniert, wird
   zusätzlich eine identische Kopie der Datenbank eingebettet. Beim Start
   wird zunächst versucht, farben.json regulär zu laden (z. B. wenn die
   App über einen lokalen Server läuft); schlägt das fehl, springt die App
   automatisch auf die eingebettete Kopie um.
   ====================================================================== */
const EMBEDDED_FARBEN_DATA = [{"id": 1, "name": "Rot Vibrant", "category": "Vollspektrum", "hex": "#FF0000", "rgb": {"r": 255, "g": 0, "b": 0}, "rgbw": {"r": 255, "g": 0, "b": 0, "w": 0}, "hsl": {"h": 0, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 100, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 2, "name": "Rot Pastell", "category": "Pastell", "hex": "#EAB8B8", "rgb": {"r": 234, "g": 184, "b": 184}, "rgbw": {"r": 50, "g": 0, "b": 0, "w": 184}, "hsl": {"h": 0, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 21, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 3, "name": "Rot Dunkel", "category": "Vollspektrum", "hex": "#8F0000", "rgb": {"r": 143, "g": 0, "b": 0}, "rgbw": {"r": 143, "g": 0, "b": 0, "w": 0}, "hsl": {"h": 0, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 100, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 4, "name": "Rot Sanft", "category": "Pastell", "hex": "#C57777", "rgb": {"r": 197, "g": 119, "b": 119}, "rgbw": {"r": 78, "g": 0, "b": 0, "w": 119}, "hsl": {"h": 0, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 40, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 5, "name": "Rot-Orange Vibrant", "category": "Vollspektrum", "hex": "#FF2A00", "rgb": {"r": 255, "g": 42, "b": 0}, "rgbw": {"r": 255, "g": 42, "b": 0, "w": 0}, "hsl": {"h": 10, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 84, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 6, "name": "Rot-Orange Pastell", "category": "Pastell", "hex": "#EAC0B8", "rgb": {"r": 234, "g": 192, "b": 184}, "rgbw": {"r": 50, "g": 8, "b": 0, "w": 184}, "hsl": {"h": 10, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 18, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 7, "name": "Rot-Orange Dunkel", "category": "Vollspektrum", "hex": "#8F1800", "rgb": {"r": 143, "g": 24, "b": 0}, "rgbw": {"r": 143, "g": 24, "b": 0, "w": 0}, "hsl": {"h": 10, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 83, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 8, "name": "Rot-Orange Sanft", "category": "Pastell", "hex": "#C58477", "rgb": {"r": 197, "g": 132, "b": 119}, "rgbw": {"r": 78, "g": 13, "b": 0, "w": 119}, "hsl": {"h": 10, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 33, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 9, "name": "Blutorange Vibrant", "category": "Vollspektrum", "hex": "#FF5500", "rgb": {"r": 255, "g": 85, "b": 0}, "rgbw": {"r": 255, "g": 85, "b": 0, "w": 0}, "hsl": {"h": 20, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 67, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 10, "name": "Blutorange Pastell", "category": "Pastell", "hex": "#EAC9B8", "rgb": {"r": 234, "g": 201, "b": 184}, "rgbw": {"r": 50, "g": 17, "b": 0, "w": 184}, "hsl": {"h": 20, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 14, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 11, "name": "Blutorange Dunkel", "category": "Vollspektrum", "hex": "#8F3000", "rgb": {"r": 143, "g": 48, "b": 0}, "rgbw": {"r": 143, "g": 48, "b": 0, "w": 0}, "hsl": {"h": 20, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 66, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 12, "name": "Blutorange Sanft", "category": "Pastell", "hex": "#C59177", "rgb": {"r": 197, "g": 145, "b": 119}, "rgbw": {"r": 78, "g": 26, "b": 0, "w": 119}, "hsl": {"h": 20, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 26, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 13, "name": "Orange Vibrant", "category": "Vollspektrum", "hex": "#FF8000", "rgb": {"r": 255, "g": 128, "b": 0}, "rgbw": {"r": 255, "g": 128, "b": 0, "w": 0}, "hsl": {"h": 30, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 50, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 14, "name": "Orange Pastell", "category": "Pastell", "hex": "#EAD1B8", "rgb": {"r": 234, "g": 209, "b": 184}, "rgbw": {"r": 50, "g": 25, "b": 0, "w": 184}, "hsl": {"h": 30, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 11, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 15, "name": "Orange Dunkel", "category": "Vollspektrum", "hex": "#8F4700", "rgb": {"r": 143, "g": 71, "b": 0}, "rgbw": {"r": 143, "g": 71, "b": 0, "w": 0}, "hsl": {"h": 30, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 50, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 16, "name": "Orange Sanft", "category": "Pastell", "hex": "#C59E77", "rgb": {"r": 197, "g": 158, "b": 119}, "rgbw": {"r": 78, "g": 39, "b": 0, "w": 119}, "hsl": {"h": 30, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 20, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 17, "name": "Bernstein Vibrant", "category": "Vollspektrum", "hex": "#FFAA00", "rgb": {"r": 255, "g": 170, "b": 0}, "rgbw": {"r": 255, "g": 170, "b": 0, "w": 0}, "hsl": {"h": 40, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 33, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 18, "name": "Bernstein Pastell", "category": "Pastell", "hex": "#EADAB8", "rgb": {"r": 234, "g": 218, "b": 184}, "rgbw": {"r": 50, "g": 34, "b": 0, "w": 184}, "hsl": {"h": 41, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 7, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 19, "name": "Bernstein Dunkel", "category": "Vollspektrum", "hex": "#8F5F00", "rgb": {"r": 143, "g": 95, "b": 0}, "rgbw": {"r": 143, "g": 95, "b": 0, "w": 0}, "hsl": {"h": 40, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 34, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 20, "name": "Bernstein Sanft", "category": "Pastell", "hex": "#C5AB77", "rgb": {"r": 197, "g": 171, "b": 119}, "rgbw": {"r": 78, "g": 52, "b": 0, "w": 119}, "hsl": {"h": 40, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 13, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 21, "name": "Amber Vibrant", "category": "Vollspektrum", "hex": "#FFD400", "rgb": {"r": 255, "g": 212, "b": 0}, "rgbw": {"r": 255, "g": 212, "b": 0, "w": 0}, "hsl": {"h": 50, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 17, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 22, "name": "Amber Pastell", "category": "Pastell", "hex": "#EAE2B8", "rgb": {"r": 234, "g": 226, "b": 184}, "rgbw": {"r": 50, "g": 42, "b": 0, "w": 184}, "hsl": {"h": 50, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 3, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 23, "name": "Amber Dunkel", "category": "Vollspektrum", "hex": "#8F7700", "rgb": {"r": 143, "g": 119, "b": 0}, "rgbw": {"r": 143, "g": 119, "b": 0, "w": 0}, "hsl": {"h": 50, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 17, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 24, "name": "Amber Sanft", "category": "Pastell", "hex": "#C5B877", "rgb": {"r": 197, "g": 184, "b": 119}, "rgbw": {"r": 78, "g": 65, "b": 0, "w": 119}, "hsl": {"h": 50, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 7, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 25, "name": "Gold Vibrant", "category": "Vollspektrum", "hex": "#FFFF00", "rgb": {"r": 255, "g": 255, "b": 0}, "rgbw": {"r": 255, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 60, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 26, "name": "Gold Pastell", "category": "Pastell", "hex": "#EAEAB8", "rgb": {"r": 234, "g": 234, "b": 184}, "rgbw": {"r": 50, "g": 50, "b": 0, "w": 184}, "hsl": {"h": 60, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 0, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 27, "name": "Gold Dunkel", "category": "Vollspektrum", "hex": "#8F8F00", "rgb": {"r": 143, "g": 143, "b": 0}, "rgbw": {"r": 143, "g": 143, "b": 0, "w": 0}, "hsl": {"h": 60, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 0, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 28, "name": "Gold Sanft", "category": "Pastell", "hex": "#C5C577", "rgb": {"r": 197, "g": 197, "b": 119}, "rgbw": {"r": 78, "g": 78, "b": 0, "w": 119}, "hsl": {"h": 60, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 0, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 29, "name": "Gelb-Orange Vibrant", "category": "Vollspektrum", "hex": "#D4FF00", "rgb": {"r": 212, "g": 255, "b": 0}, "rgbw": {"r": 212, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 70, "s": 100, "l": 50}, "cmyk": {"c": 17, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 30, "name": "Gelb-Orange Pastell", "category": "Pastell", "hex": "#E2EAB8", "rgb": {"r": 226, "g": 234, "b": 184}, "rgbw": {"r": 42, "g": 50, "b": 0, "w": 184}, "hsl": {"h": 70, "s": 54, "l": 82}, "cmyk": {"c": 3, "m": 0, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 31, "name": "Gelb-Orange Dunkel", "category": "Vollspektrum", "hex": "#778F00", "rgb": {"r": 119, "g": 143, "b": 0}, "rgbw": {"r": 119, "g": 143, "b": 0, "w": 0}, "hsl": {"h": 70, "s": 100, "l": 28}, "cmyk": {"c": 17, "m": 0, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 32, "name": "Gelb-Orange Sanft", "category": "Pastell", "hex": "#B8C577", "rgb": {"r": 184, "g": 197, "b": 119}, "rgbw": {"r": 65, "g": 78, "b": 0, "w": 119}, "hsl": {"h": 70, "s": 40, "l": 62}, "cmyk": {"c": 7, "m": 0, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 33, "name": "Gelb Vibrant", "category": "Vollspektrum", "hex": "#AAFF00", "rgb": {"r": 170, "g": 255, "b": 0}, "rgbw": {"r": 170, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 80, "s": 100, "l": 50}, "cmyk": {"c": 33, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 34, "name": "Gelb Pastell", "category": "Pastell", "hex": "#DAEAB8", "rgb": {"r": 218, "g": 234, "b": 184}, "rgbw": {"r": 34, "g": 50, "b": 0, "w": 184}, "hsl": {"h": 79, "s": 54, "l": 82}, "cmyk": {"c": 7, "m": 0, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 35, "name": "Gelb Dunkel", "category": "Vollspektrum", "hex": "#5F8F00", "rgb": {"r": 95, "g": 143, "b": 0}, "rgbw": {"r": 95, "g": 143, "b": 0, "w": 0}, "hsl": {"h": 80, "s": 100, "l": 28}, "cmyk": {"c": 34, "m": 0, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 36, "name": "Gelb Sanft", "category": "Pastell", "hex": "#ABC577", "rgb": {"r": 171, "g": 197, "b": 119}, "rgbw": {"r": 52, "g": 78, "b": 0, "w": 119}, "hsl": {"h": 80, "s": 40, "l": 62}, "cmyk": {"c": 13, "m": 0, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 37, "name": "Zitrone Vibrant", "category": "Vollspektrum", "hex": "#80FF00", "rgb": {"r": 128, "g": 255, "b": 0}, "rgbw": {"r": 128, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 90, "s": 100, "l": 50}, "cmyk": {"c": 50, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 38, "name": "Zitrone Pastell", "category": "Pastell", "hex": "#D1EAB8", "rgb": {"r": 209, "g": 234, "b": 184}, "rgbw": {"r": 25, "g": 50, "b": 0, "w": 184}, "hsl": {"h": 90, "s": 54, "l": 82}, "cmyk": {"c": 11, "m": 0, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 39, "name": "Zitrone Dunkel", "category": "Vollspektrum", "hex": "#478F00", "rgb": {"r": 71, "g": 143, "b": 0}, "rgbw": {"r": 71, "g": 143, "b": 0, "w": 0}, "hsl": {"h": 90, "s": 100, "l": 28}, "cmyk": {"c": 50, "m": 0, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 40, "name": "Zitrone Sanft", "category": "Pastell", "hex": "#9EC577", "rgb": {"r": 158, "g": 197, "b": 119}, "rgbw": {"r": 39, "g": 78, "b": 0, "w": 119}, "hsl": {"h": 90, "s": 40, "l": 62}, "cmyk": {"c": 20, "m": 0, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 41, "name": "Gelb-Grün Vibrant", "category": "Vollspektrum", "hex": "#55FF00", "rgb": {"r": 85, "g": 255, "b": 0}, "rgbw": {"r": 85, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 100, "s": 100, "l": 50}, "cmyk": {"c": 67, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 42, "name": "Gelb-Grün Pastell", "category": "Pastell", "hex": "#C9EAB8", "rgb": {"r": 201, "g": 234, "b": 184}, "rgbw": {"r": 17, "g": 50, "b": 0, "w": 184}, "hsl": {"h": 100, "s": 54, "l": 82}, "cmyk": {"c": 14, "m": 0, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 43, "name": "Gelb-Grün Dunkel", "category": "Vollspektrum", "hex": "#308F00", "rgb": {"r": 48, "g": 143, "b": 0}, "rgbw": {"r": 48, "g": 143, "b": 0, "w": 0}, "hsl": {"h": 100, "s": 100, "l": 28}, "cmyk": {"c": 66, "m": 0, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 44, "name": "Gelb-Grün Sanft", "category": "Pastell", "hex": "#91C577", "rgb": {"r": 145, "g": 197, "b": 119}, "rgbw": {"r": 26, "g": 78, "b": 0, "w": 119}, "hsl": {"h": 100, "s": 40, "l": 62}, "cmyk": {"c": 26, "m": 0, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 45, "name": "Chartreuse Vibrant", "category": "Vollspektrum", "hex": "#2BFF00", "rgb": {"r": 43, "g": 255, "b": 0}, "rgbw": {"r": 43, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 110, "s": 100, "l": 50}, "cmyk": {"c": 83, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 46, "name": "Chartreuse Pastell", "category": "Pastell", "hex": "#C0EAB8", "rgb": {"r": 192, "g": 234, "b": 184}, "rgbw": {"r": 8, "g": 50, "b": 0, "w": 184}, "hsl": {"h": 110, "s": 54, "l": 82}, "cmyk": {"c": 18, "m": 0, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 47, "name": "Chartreuse Dunkel", "category": "Vollspektrum", "hex": "#188F00", "rgb": {"r": 24, "g": 143, "b": 0}, "rgbw": {"r": 24, "g": 143, "b": 0, "w": 0}, "hsl": {"h": 110, "s": 100, "l": 28}, "cmyk": {"c": 83, "m": 0, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 48, "name": "Chartreuse Sanft", "category": "Pastell", "hex": "#84C577", "rgb": {"r": 132, "g": 197, "b": 119}, "rgbw": {"r": 13, "g": 78, "b": 0, "w": 119}, "hsl": {"h": 110, "s": 40, "l": 62}, "cmyk": {"c": 33, "m": 0, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 49, "name": "Frühlingsgrün Vibrant", "category": "Vollspektrum", "hex": "#00FF00", "rgb": {"r": 0, "g": 255, "b": 0}, "rgbw": {"r": 0, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 120, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 50, "name": "Frühlingsgrün Pastell", "category": "Pastell", "hex": "#B8EAB8", "rgb": {"r": 184, "g": 234, "b": 184}, "rgbw": {"r": 0, "g": 50, "b": 0, "w": 184}, "hsl": {"h": 120, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 0, "y": 21, "k": 8}, "colorTempKelvin": null}, {"id": 51, "name": "Frühlingsgrün Dunkel", "category": "Vollspektrum", "hex": "#008F00", "rgb": {"r": 0, "g": 143, "b": 0}, "rgbw": {"r": 0, "g": 143, "b": 0, "w": 0}, "hsl": {"h": 120, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 0, "y": 100, "k": 44}, "colorTempKelvin": null}, {"id": 52, "name": "Frühlingsgrün Sanft", "category": "Pastell", "hex": "#77C577", "rgb": {"r": 119, "g": 197, "b": 119}, "rgbw": {"r": 0, "g": 78, "b": 0, "w": 119}, "hsl": {"h": 120, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 0, "y": 40, "k": 23}, "colorTempKelvin": null}, {"id": 53, "name": "Grün Vibrant", "category": "Vollspektrum", "hex": "#00FF2B", "rgb": {"r": 0, "g": 255, "b": 43}, "rgbw": {"r": 0, "g": 255, "b": 43, "w": 0}, "hsl": {"h": 130, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 0, "y": 83, "k": 0}, "colorTempKelvin": null}, {"id": 54, "name": "Grün Pastell", "category": "Pastell", "hex": "#B8EAC0", "rgb": {"r": 184, "g": 234, "b": 192}, "rgbw": {"r": 0, "g": 50, "b": 8, "w": 184}, "hsl": {"h": 130, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 0, "y": 18, "k": 8}, "colorTempKelvin": null}, {"id": 55, "name": "Grün Dunkel", "category": "Vollspektrum", "hex": "#008F18", "rgb": {"r": 0, "g": 143, "b": 24}, "rgbw": {"r": 0, "g": 143, "b": 24, "w": 0}, "hsl": {"h": 130, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 0, "y": 83, "k": 44}, "colorTempKelvin": null}, {"id": 56, "name": "Grün Sanft", "category": "Pastell", "hex": "#77C584", "rgb": {"r": 119, "g": 197, "b": 132}, "rgbw": {"r": 0, "g": 78, "b": 13, "w": 119}, "hsl": {"h": 130, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 0, "y": 33, "k": 23}, "colorTempKelvin": null}, {"id": 57, "name": "Smaragd Vibrant", "category": "Vollspektrum", "hex": "#00FF55", "rgb": {"r": 0, "g": 255, "b": 85}, "rgbw": {"r": 0, "g": 255, "b": 85, "w": 0}, "hsl": {"h": 140, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 0, "y": 67, "k": 0}, "colorTempKelvin": null}, {"id": 58, "name": "Smaragd Pastell", "category": "Pastell", "hex": "#B8EAC9", "rgb": {"r": 184, "g": 234, "b": 201}, "rgbw": {"r": 0, "g": 50, "b": 17, "w": 184}, "hsl": {"h": 140, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 0, "y": 14, "k": 8}, "colorTempKelvin": null}, {"id": 59, "name": "Smaragd Dunkel", "category": "Vollspektrum", "hex": "#008F30", "rgb": {"r": 0, "g": 143, "b": 48}, "rgbw": {"r": 0, "g": 143, "b": 48, "w": 0}, "hsl": {"h": 140, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 0, "y": 66, "k": 44}, "colorTempKelvin": null}, {"id": 60, "name": "Smaragd Sanft", "category": "Pastell", "hex": "#77C591", "rgb": {"r": 119, "g": 197, "b": 145}, "rgbw": {"r": 0, "g": 78, "b": 26, "w": 119}, "hsl": {"h": 140, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 0, "y": 26, "k": 23}, "colorTempKelvin": null}, {"id": 61, "name": "Minzgrün Vibrant", "category": "Vollspektrum", "hex": "#00FF80", "rgb": {"r": 0, "g": 255, "b": 128}, "rgbw": {"r": 0, "g": 255, "b": 128, "w": 0}, "hsl": {"h": 150, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 0, "y": 50, "k": 0}, "colorTempKelvin": null}, {"id": 62, "name": "Minzgrün Pastell", "category": "Pastell", "hex": "#B8EAD1", "rgb": {"r": 184, "g": 234, "b": 209}, "rgbw": {"r": 0, "g": 50, "b": 25, "w": 184}, "hsl": {"h": 150, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 0, "y": 11, "k": 8}, "colorTempKelvin": null}, {"id": 63, "name": "Minzgrün Dunkel", "category": "Vollspektrum", "hex": "#008F47", "rgb": {"r": 0, "g": 143, "b": 71}, "rgbw": {"r": 0, "g": 143, "b": 71, "w": 0}, "hsl": {"h": 150, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 0, "y": 50, "k": 44}, "colorTempKelvin": null}, {"id": 64, "name": "Minzgrün Sanft", "category": "Pastell", "hex": "#77C59E", "rgb": {"r": 119, "g": 197, "b": 158}, "rgbw": {"r": 0, "g": 78, "b": 39, "w": 119}, "hsl": {"h": 150, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 0, "y": 20, "k": 23}, "colorTempKelvin": null}, {"id": 65, "name": "Türkisgrün Vibrant", "category": "Vollspektrum", "hex": "#00FFAA", "rgb": {"r": 0, "g": 255, "b": 170}, "rgbw": {"r": 0, "g": 255, "b": 170, "w": 0}, "hsl": {"h": 160, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 0, "y": 33, "k": 0}, "colorTempKelvin": null}, {"id": 66, "name": "Türkisgrün Pastell", "category": "Pastell", "hex": "#B8EADA", "rgb": {"r": 184, "g": 234, "b": 218}, "rgbw": {"r": 0, "g": 50, "b": 34, "w": 184}, "hsl": {"h": 161, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 0, "y": 7, "k": 8}, "colorTempKelvin": null}, {"id": 67, "name": "Türkisgrün Dunkel", "category": "Vollspektrum", "hex": "#008F5F", "rgb": {"r": 0, "g": 143, "b": 95}, "rgbw": {"r": 0, "g": 143, "b": 95, "w": 0}, "hsl": {"h": 160, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 0, "y": 34, "k": 44}, "colorTempKelvin": null}, {"id": 68, "name": "Türkisgrün Sanft", "category": "Pastell", "hex": "#77C5AB", "rgb": {"r": 119, "g": 197, "b": 171}, "rgbw": {"r": 0, "g": 78, "b": 52, "w": 119}, "hsl": {"h": 160, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 0, "y": 13, "k": 23}, "colorTempKelvin": null}, {"id": 69, "name": "Türkis Vibrant", "category": "Vollspektrum", "hex": "#00FFD4", "rgb": {"r": 0, "g": 255, "b": 212}, "rgbw": {"r": 0, "g": 255, "b": 212, "w": 0}, "hsl": {"h": 170, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 0, "y": 17, "k": 0}, "colorTempKelvin": null}, {"id": 70, "name": "Türkis Pastell", "category": "Pastell", "hex": "#B8EAE2", "rgb": {"r": 184, "g": 234, "b": 226}, "rgbw": {"r": 0, "g": 50, "b": 42, "w": 184}, "hsl": {"h": 170, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 0, "y": 3, "k": 8}, "colorTempKelvin": null}, {"id": 71, "name": "Türkis Dunkel", "category": "Vollspektrum", "hex": "#008F77", "rgb": {"r": 0, "g": 143, "b": 119}, "rgbw": {"r": 0, "g": 143, "b": 119, "w": 0}, "hsl": {"h": 170, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 0, "y": 17, "k": 44}, "colorTempKelvin": null}, {"id": 72, "name": "Türkis Sanft", "category": "Pastell", "hex": "#77C5B8", "rgb": {"r": 119, "g": 197, "b": 184}, "rgbw": {"r": 0, "g": 78, "b": 65, "w": 119}, "hsl": {"h": 170, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 0, "y": 7, "k": 23}, "colorTempKelvin": null}, {"id": 73, "name": "Cyan Vibrant", "category": "Vollspektrum", "hex": "#00FFFF", "rgb": {"r": 0, "g": 255, "b": 255}, "rgbw": {"r": 0, "g": 255, "b": 255, "w": 0}, "hsl": {"h": 180, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 0, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 74, "name": "Cyan Pastell", "category": "Pastell", "hex": "#B8EAEA", "rgb": {"r": 184, "g": 234, "b": 234}, "rgbw": {"r": 0, "g": 50, "b": 50, "w": 184}, "hsl": {"h": 180, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 0, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 75, "name": "Cyan Dunkel", "category": "Vollspektrum", "hex": "#008F8F", "rgb": {"r": 0, "g": 143, "b": 143}, "rgbw": {"r": 0, "g": 143, "b": 143, "w": 0}, "hsl": {"h": 180, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 0, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 76, "name": "Cyan Sanft", "category": "Pastell", "hex": "#77C5C5", "rgb": {"r": 119, "g": 197, "b": 197}, "rgbw": {"r": 0, "g": 78, "b": 78, "w": 119}, "hsl": {"h": 180, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 0, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 77, "name": "Himmelblau Vibrant", "category": "Vollspektrum", "hex": "#00D4FF", "rgb": {"r": 0, "g": 212, "b": 255}, "rgbw": {"r": 0, "g": 212, "b": 255, "w": 0}, "hsl": {"h": 190, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 17, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 78, "name": "Himmelblau Pastell", "category": "Pastell", "hex": "#B8E2EA", "rgb": {"r": 184, "g": 226, "b": 234}, "rgbw": {"r": 0, "g": 42, "b": 50, "w": 184}, "hsl": {"h": 190, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 3, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 79, "name": "Himmelblau Dunkel", "category": "Vollspektrum", "hex": "#00778F", "rgb": {"r": 0, "g": 119, "b": 143}, "rgbw": {"r": 0, "g": 119, "b": 143, "w": 0}, "hsl": {"h": 190, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 17, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 80, "name": "Himmelblau Sanft", "category": "Pastell", "hex": "#77B8C5", "rgb": {"r": 119, "g": 184, "b": 197}, "rgbw": {"r": 0, "g": 65, "b": 78, "w": 119}, "hsl": {"h": 190, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 7, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 81, "name": "Azurblau Vibrant", "category": "Vollspektrum", "hex": "#00AAFF", "rgb": {"r": 0, "g": 170, "b": 255}, "rgbw": {"r": 0, "g": 170, "b": 255, "w": 0}, "hsl": {"h": 200, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 33, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 82, "name": "Azurblau Pastell", "category": "Pastell", "hex": "#B8DAEA", "rgb": {"r": 184, "g": 218, "b": 234}, "rgbw": {"r": 0, "g": 34, "b": 50, "w": 184}, "hsl": {"h": 199, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 7, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 83, "name": "Azurblau Dunkel", "category": "Vollspektrum", "hex": "#005F8F", "rgb": {"r": 0, "g": 95, "b": 143}, "rgbw": {"r": 0, "g": 95, "b": 143, "w": 0}, "hsl": {"h": 200, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 34, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 84, "name": "Azurblau Sanft", "category": "Pastell", "hex": "#77ABC5", "rgb": {"r": 119, "g": 171, "b": 197}, "rgbw": {"r": 0, "g": 52, "b": 78, "w": 119}, "hsl": {"h": 200, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 13, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 85, "name": "Kobaltblau Vibrant", "category": "Vollspektrum", "hex": "#007FFF", "rgb": {"r": 0, "g": 127, "b": 255}, "rgbw": {"r": 0, "g": 127, "b": 255, "w": 0}, "hsl": {"h": 210, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 50, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 86, "name": "Kobaltblau Pastell", "category": "Pastell", "hex": "#B8D1EA", "rgb": {"r": 184, "g": 209, "b": 234}, "rgbw": {"r": 0, "g": 25, "b": 50, "w": 184}, "hsl": {"h": 210, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 11, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 87, "name": "Kobaltblau Dunkel", "category": "Vollspektrum", "hex": "#00478F", "rgb": {"r": 0, "g": 71, "b": 143}, "rgbw": {"r": 0, "g": 71, "b": 143, "w": 0}, "hsl": {"h": 210, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 50, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 88, "name": "Kobaltblau Sanft", "category": "Pastell", "hex": "#779EC5", "rgb": {"r": 119, "g": 158, "b": 197}, "rgbw": {"r": 0, "g": 39, "b": 78, "w": 119}, "hsl": {"h": 210, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 20, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 89, "name": "Blau Vibrant", "category": "Vollspektrum", "hex": "#0055FF", "rgb": {"r": 0, "g": 85, "b": 255}, "rgbw": {"r": 0, "g": 85, "b": 255, "w": 0}, "hsl": {"h": 220, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 67, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 90, "name": "Blau Pastell", "category": "Pastell", "hex": "#B8C9EA", "rgb": {"r": 184, "g": 201, "b": 234}, "rgbw": {"r": 0, "g": 17, "b": 50, "w": 184}, "hsl": {"h": 220, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 14, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 91, "name": "Blau Dunkel", "category": "Vollspektrum", "hex": "#00308F", "rgb": {"r": 0, "g": 48, "b": 143}, "rgbw": {"r": 0, "g": 48, "b": 143, "w": 0}, "hsl": {"h": 220, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 66, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 92, "name": "Blau Sanft", "category": "Pastell", "hex": "#7791C5", "rgb": {"r": 119, "g": 145, "b": 197}, "rgbw": {"r": 0, "g": 26, "b": 78, "w": 119}, "hsl": {"h": 220, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 26, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 93, "name": "Ultramarin Vibrant", "category": "Vollspektrum", "hex": "#002BFF", "rgb": {"r": 0, "g": 43, "b": 255}, "rgbw": {"r": 0, "g": 43, "b": 255, "w": 0}, "hsl": {"h": 230, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 83, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 94, "name": "Ultramarin Pastell", "category": "Pastell", "hex": "#B8C0EA", "rgb": {"r": 184, "g": 192, "b": 234}, "rgbw": {"r": 0, "g": 8, "b": 50, "w": 184}, "hsl": {"h": 230, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 18, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 95, "name": "Ultramarin Dunkel", "category": "Vollspektrum", "hex": "#00188F", "rgb": {"r": 0, "g": 24, "b": 143}, "rgbw": {"r": 0, "g": 24, "b": 143, "w": 0}, "hsl": {"h": 230, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 83, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 96, "name": "Ultramarin Sanft", "category": "Pastell", "hex": "#7784C5", "rgb": {"r": 119, "g": 132, "b": 197}, "rgbw": {"r": 0, "g": 13, "b": 78, "w": 119}, "hsl": {"h": 230, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 33, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 97, "name": "Indigo Vibrant", "category": "Vollspektrum", "hex": "#0000FF", "rgb": {"r": 0, "g": 0, "b": 255}, "rgbw": {"r": 0, "g": 0, "b": 255, "w": 0}, "hsl": {"h": 240, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 100, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 98, "name": "Indigo Pastell", "category": "Pastell", "hex": "#B8B8EA", "rgb": {"r": 184, "g": 184, "b": 234}, "rgbw": {"r": 0, "g": 0, "b": 50, "w": 184}, "hsl": {"h": 240, "s": 54, "l": 82}, "cmyk": {"c": 21, "m": 21, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 99, "name": "Indigo Dunkel", "category": "Vollspektrum", "hex": "#00008F", "rgb": {"r": 0, "g": 0, "b": 143}, "rgbw": {"r": 0, "g": 0, "b": 143, "w": 0}, "hsl": {"h": 240, "s": 100, "l": 28}, "cmyk": {"c": 100, "m": 100, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 100, "name": "Indigo Sanft", "category": "Pastell", "hex": "#7777C5", "rgb": {"r": 119, "g": 119, "b": 197}, "rgbw": {"r": 0, "g": 0, "b": 78, "w": 119}, "hsl": {"h": 240, "s": 40, "l": 62}, "cmyk": {"c": 40, "m": 40, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 101, "name": "Violettblau Vibrant", "category": "Vollspektrum", "hex": "#2A00FF", "rgb": {"r": 42, "g": 0, "b": 255}, "rgbw": {"r": 42, "g": 0, "b": 255, "w": 0}, "hsl": {"h": 250, "s": 100, "l": 50}, "cmyk": {"c": 84, "m": 100, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 102, "name": "Violettblau Pastell", "category": "Pastell", "hex": "#C0B8EA", "rgb": {"r": 192, "g": 184, "b": 234}, "rgbw": {"r": 8, "g": 0, "b": 50, "w": 184}, "hsl": {"h": 250, "s": 54, "l": 82}, "cmyk": {"c": 18, "m": 21, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 103, "name": "Violettblau Dunkel", "category": "Vollspektrum", "hex": "#18008F", "rgb": {"r": 24, "g": 0, "b": 143}, "rgbw": {"r": 24, "g": 0, "b": 143, "w": 0}, "hsl": {"h": 250, "s": 100, "l": 28}, "cmyk": {"c": 83, "m": 100, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 104, "name": "Violettblau Sanft", "category": "Pastell", "hex": "#8477C5", "rgb": {"r": 132, "g": 119, "b": 197}, "rgbw": {"r": 13, "g": 0, "b": 78, "w": 119}, "hsl": {"h": 250, "s": 40, "l": 62}, "cmyk": {"c": 33, "m": 40, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 105, "name": "Violett Vibrant", "category": "Vollspektrum", "hex": "#5500FF", "rgb": {"r": 85, "g": 0, "b": 255}, "rgbw": {"r": 85, "g": 0, "b": 255, "w": 0}, "hsl": {"h": 260, "s": 100, "l": 50}, "cmyk": {"c": 67, "m": 100, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 106, "name": "Violett Pastell", "category": "Pastell", "hex": "#C9B8EA", "rgb": {"r": 201, "g": 184, "b": 234}, "rgbw": {"r": 17, "g": 0, "b": 50, "w": 184}, "hsl": {"h": 260, "s": 54, "l": 82}, "cmyk": {"c": 14, "m": 21, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 107, "name": "Violett Dunkel", "category": "Vollspektrum", "hex": "#30008F", "rgb": {"r": 48, "g": 0, "b": 143}, "rgbw": {"r": 48, "g": 0, "b": 143, "w": 0}, "hsl": {"h": 260, "s": 100, "l": 28}, "cmyk": {"c": 66, "m": 100, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 108, "name": "Violett Sanft", "category": "Pastell", "hex": "#9177C5", "rgb": {"r": 145, "g": 119, "b": 197}, "rgbw": {"r": 26, "g": 0, "b": 78, "w": 119}, "hsl": {"h": 260, "s": 40, "l": 62}, "cmyk": {"c": 26, "m": 40, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 109, "name": "Lavendel Vibrant", "category": "Vollspektrum", "hex": "#7F00FF", "rgb": {"r": 127, "g": 0, "b": 255}, "rgbw": {"r": 127, "g": 0, "b": 255, "w": 0}, "hsl": {"h": 270, "s": 100, "l": 50}, "cmyk": {"c": 50, "m": 100, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 110, "name": "Lavendel Pastell", "category": "Pastell", "hex": "#D1B8EA", "rgb": {"r": 209, "g": 184, "b": 234}, "rgbw": {"r": 25, "g": 0, "b": 50, "w": 184}, "hsl": {"h": 270, "s": 54, "l": 82}, "cmyk": {"c": 11, "m": 21, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 111, "name": "Lavendel Dunkel", "category": "Vollspektrum", "hex": "#47008F", "rgb": {"r": 71, "g": 0, "b": 143}, "rgbw": {"r": 71, "g": 0, "b": 143, "w": 0}, "hsl": {"h": 270, "s": 100, "l": 28}, "cmyk": {"c": 50, "m": 100, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 112, "name": "Lavendel Sanft", "category": "Pastell", "hex": "#9E77C5", "rgb": {"r": 158, "g": 119, "b": 197}, "rgbw": {"r": 39, "g": 0, "b": 78, "w": 119}, "hsl": {"h": 270, "s": 40, "l": 62}, "cmyk": {"c": 20, "m": 40, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 113, "name": "Purpur Vibrant", "category": "Vollspektrum", "hex": "#AA00FF", "rgb": {"r": 170, "g": 0, "b": 255}, "rgbw": {"r": 170, "g": 0, "b": 255, "w": 0}, "hsl": {"h": 280, "s": 100, "l": 50}, "cmyk": {"c": 33, "m": 100, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 114, "name": "Purpur Pastell", "category": "Pastell", "hex": "#DAB8EA", "rgb": {"r": 218, "g": 184, "b": 234}, "rgbw": {"r": 34, "g": 0, "b": 50, "w": 184}, "hsl": {"h": 281, "s": 54, "l": 82}, "cmyk": {"c": 7, "m": 21, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 115, "name": "Purpur Dunkel", "category": "Vollspektrum", "hex": "#5F008F", "rgb": {"r": 95, "g": 0, "b": 143}, "rgbw": {"r": 95, "g": 0, "b": 143, "w": 0}, "hsl": {"h": 280, "s": 100, "l": 28}, "cmyk": {"c": 34, "m": 100, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 116, "name": "Purpur Sanft", "category": "Pastell", "hex": "#AB77C5", "rgb": {"r": 171, "g": 119, "b": 197}, "rgbw": {"r": 52, "g": 0, "b": 78, "w": 119}, "hsl": {"h": 280, "s": 40, "l": 62}, "cmyk": {"c": 13, "m": 40, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 117, "name": "Magenta Vibrant", "category": "Vollspektrum", "hex": "#D400FF", "rgb": {"r": 212, "g": 0, "b": 255}, "rgbw": {"r": 212, "g": 0, "b": 255, "w": 0}, "hsl": {"h": 290, "s": 100, "l": 50}, "cmyk": {"c": 17, "m": 100, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 118, "name": "Magenta Pastell", "category": "Pastell", "hex": "#E2B8EA", "rgb": {"r": 226, "g": 184, "b": 234}, "rgbw": {"r": 42, "g": 0, "b": 50, "w": 184}, "hsl": {"h": 290, "s": 54, "l": 82}, "cmyk": {"c": 3, "m": 21, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 119, "name": "Magenta Dunkel", "category": "Vollspektrum", "hex": "#77008F", "rgb": {"r": 119, "g": 0, "b": 143}, "rgbw": {"r": 119, "g": 0, "b": 143, "w": 0}, "hsl": {"h": 290, "s": 100, "l": 28}, "cmyk": {"c": 17, "m": 100, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 120, "name": "Magenta Sanft", "category": "Pastell", "hex": "#B877C5", "rgb": {"r": 184, "g": 119, "b": 197}, "rgbw": {"r": 65, "g": 0, "b": 78, "w": 119}, "hsl": {"h": 290, "s": 40, "l": 62}, "cmyk": {"c": 7, "m": 40, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 121, "name": "Fuchsia Vibrant", "category": "Vollspektrum", "hex": "#FF00FF", "rgb": {"r": 255, "g": 0, "b": 255}, "rgbw": {"r": 255, "g": 0, "b": 255, "w": 0}, "hsl": {"h": 300, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 100, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 122, "name": "Fuchsia Pastell", "category": "Pastell", "hex": "#EAB8EA", "rgb": {"r": 234, "g": 184, "b": 234}, "rgbw": {"r": 50, "g": 0, "b": 50, "w": 184}, "hsl": {"h": 300, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 21, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 123, "name": "Fuchsia Dunkel", "category": "Vollspektrum", "hex": "#8F008F", "rgb": {"r": 143, "g": 0, "b": 143}, "rgbw": {"r": 143, "g": 0, "b": 143, "w": 0}, "hsl": {"h": 300, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 100, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 124, "name": "Fuchsia Sanft", "category": "Pastell", "hex": "#C577C5", "rgb": {"r": 197, "g": 119, "b": 197}, "rgbw": {"r": 78, "g": 0, "b": 78, "w": 119}, "hsl": {"h": 300, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 40, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 125, "name": "Pink Vibrant", "category": "Vollspektrum", "hex": "#FF00D4", "rgb": {"r": 255, "g": 0, "b": 212}, "rgbw": {"r": 255, "g": 0, "b": 212, "w": 0}, "hsl": {"h": 310, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 100, "y": 17, "k": 0}, "colorTempKelvin": null}, {"id": 126, "name": "Pink Pastell", "category": "Pastell", "hex": "#EAB8E2", "rgb": {"r": 234, "g": 184, "b": 226}, "rgbw": {"r": 50, "g": 0, "b": 42, "w": 184}, "hsl": {"h": 310, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 21, "y": 3, "k": 8}, "colorTempKelvin": null}, {"id": 127, "name": "Pink Dunkel", "category": "Vollspektrum", "hex": "#8F0077", "rgb": {"r": 143, "g": 0, "b": 119}, "rgbw": {"r": 143, "g": 0, "b": 119, "w": 0}, "hsl": {"h": 310, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 100, "y": 17, "k": 44}, "colorTempKelvin": null}, {"id": 128, "name": "Pink Sanft", "category": "Pastell", "hex": "#C577B8", "rgb": {"r": 197, "g": 119, "b": 184}, "rgbw": {"r": 78, "g": 0, "b": 65, "w": 119}, "hsl": {"h": 310, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 40, "y": 7, "k": 23}, "colorTempKelvin": null}, {"id": 129, "name": "Rosa Vibrant", "category": "Vollspektrum", "hex": "#FF00AA", "rgb": {"r": 255, "g": 0, "b": 170}, "rgbw": {"r": 255, "g": 0, "b": 170, "w": 0}, "hsl": {"h": 320, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 100, "y": 33, "k": 0}, "colorTempKelvin": null}, {"id": 130, "name": "Rosa Pastell", "category": "Pastell", "hex": "#EAB8DA", "rgb": {"r": 234, "g": 184, "b": 218}, "rgbw": {"r": 50, "g": 0, "b": 34, "w": 184}, "hsl": {"h": 319, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 21, "y": 7, "k": 8}, "colorTempKelvin": null}, {"id": 131, "name": "Rosa Dunkel", "category": "Vollspektrum", "hex": "#8F005F", "rgb": {"r": 143, "g": 0, "b": 95}, "rgbw": {"r": 143, "g": 0, "b": 95, "w": 0}, "hsl": {"h": 320, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 100, "y": 34, "k": 44}, "colorTempKelvin": null}, {"id": 132, "name": "Rosa Sanft", "category": "Pastell", "hex": "#C577AB", "rgb": {"r": 197, "g": 119, "b": 171}, "rgbw": {"r": 78, "g": 0, "b": 52, "w": 119}, "hsl": {"h": 320, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 40, "y": 13, "k": 23}, "colorTempKelvin": null}, {"id": 133, "name": "Kirschrot Vibrant", "category": "Vollspektrum", "hex": "#FF0080", "rgb": {"r": 255, "g": 0, "b": 128}, "rgbw": {"r": 255, "g": 0, "b": 128, "w": 0}, "hsl": {"h": 330, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 100, "y": 50, "k": 0}, "colorTempKelvin": null}, {"id": 134, "name": "Kirschrot Pastell", "category": "Pastell", "hex": "#EAB8D1", "rgb": {"r": 234, "g": 184, "b": 209}, "rgbw": {"r": 50, "g": 0, "b": 25, "w": 184}, "hsl": {"h": 330, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 21, "y": 11, "k": 8}, "colorTempKelvin": null}, {"id": 135, "name": "Kirschrot Dunkel", "category": "Vollspektrum", "hex": "#8F0047", "rgb": {"r": 143, "g": 0, "b": 71}, "rgbw": {"r": 143, "g": 0, "b": 71, "w": 0}, "hsl": {"h": 330, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 100, "y": 50, "k": 44}, "colorTempKelvin": null}, {"id": 136, "name": "Kirschrot Sanft", "category": "Pastell", "hex": "#C5779E", "rgb": {"r": 197, "g": 119, "b": 158}, "rgbw": {"r": 78, "g": 0, "b": 39, "w": 119}, "hsl": {"h": 330, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 40, "y": 20, "k": 23}, "colorTempKelvin": null}, {"id": 137, "name": "Karminrot Vibrant", "category": "Vollspektrum", "hex": "#FF0055", "rgb": {"r": 255, "g": 0, "b": 85}, "rgbw": {"r": 255, "g": 0, "b": 85, "w": 0}, "hsl": {"h": 340, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 100, "y": 67, "k": 0}, "colorTempKelvin": null}, {"id": 138, "name": "Karminrot Pastell", "category": "Pastell", "hex": "#EAB8C9", "rgb": {"r": 234, "g": 184, "b": 201}, "rgbw": {"r": 50, "g": 0, "b": 17, "w": 184}, "hsl": {"h": 340, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 21, "y": 14, "k": 8}, "colorTempKelvin": null}, {"id": 139, "name": "Karminrot Dunkel", "category": "Vollspektrum", "hex": "#8F0030", "rgb": {"r": 143, "g": 0, "b": 48}, "rgbw": {"r": 143, "g": 0, "b": 48, "w": 0}, "hsl": {"h": 340, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 100, "y": 66, "k": 44}, "colorTempKelvin": null}, {"id": 140, "name": "Karminrot Sanft", "category": "Pastell", "hex": "#C57791", "rgb": {"r": 197, "g": 119, "b": 145}, "rgbw": {"r": 78, "g": 0, "b": 26, "w": 119}, "hsl": {"h": 340, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 40, "y": 26, "k": 23}, "colorTempKelvin": null}, {"id": 141, "name": "Scharlachrot Vibrant", "category": "Vollspektrum", "hex": "#FF002B", "rgb": {"r": 255, "g": 0, "b": 43}, "rgbw": {"r": 255, "g": 0, "b": 43, "w": 0}, "hsl": {"h": 350, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 100, "y": 83, "k": 0}, "colorTempKelvin": null}, {"id": 142, "name": "Scharlachrot Pastell", "category": "Pastell", "hex": "#EAB8C0", "rgb": {"r": 234, "g": 184, "b": 192}, "rgbw": {"r": 50, "g": 0, "b": 8, "w": 184}, "hsl": {"h": 350, "s": 54, "l": 82}, "cmyk": {"c": 0, "m": 21, "y": 18, "k": 8}, "colorTempKelvin": null}, {"id": 143, "name": "Scharlachrot Dunkel", "category": "Vollspektrum", "hex": "#8F0018", "rgb": {"r": 143, "g": 0, "b": 24}, "rgbw": {"r": 143, "g": 0, "b": 24, "w": 0}, "hsl": {"h": 350, "s": 100, "l": 28}, "cmyk": {"c": 0, "m": 100, "y": 83, "k": 44}, "colorTempKelvin": null}, {"id": 144, "name": "Scharlachrot Sanft", "category": "Pastell", "hex": "#C57784", "rgb": {"r": 197, "g": 119, "b": 132}, "rgbw": {"r": 78, "g": 0, "b": 13, "w": 119}, "hsl": {"h": 350, "s": 40, "l": 62}, "cmyk": {"c": 0, "m": 40, "y": 33, "k": 23}, "colorTempKelvin": null}, {"id": 145, "name": "Kerzenlicht", "category": "Warmweiß", "hex": "#FF8400", "rgb": {"r": 255, "g": 132, "b": 0}, "rgbw": {"r": 255, "g": 132, "b": 0, "w": 0}, "hsl": {"h": 31, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 48, "y": 100, "k": 0}, "colorTempKelvin": 1900}, {"id": 146, "name": "Sonnenuntergang", "category": "Warmweiß", "hex": "#FF9227", "rgb": {"r": 255, "g": 146, "b": 39}, "rgbw": {"r": 216, "g": 107, "b": 0, "w": 39}, "hsl": {"h": 30, "s": 100, "l": 58}, "cmyk": {"c": 0, "m": 43, "y": 85, "k": 0}, "colorTempKelvin": 2200}, {"id": 147, "name": "Extra Warmweiß", "category": "Warmweiß", "hex": "#FF9B3D", "rgb": {"r": 255, "g": 155, "b": 61}, "rgbw": {"r": 194, "g": 94, "b": 0, "w": 61}, "hsl": {"h": 29, "s": 100, "l": 62}, "cmyk": {"c": 0, "m": 39, "y": 76, "k": 0}, "colorTempKelvin": 2400}, {"id": 148, "name": "Warmweiß 2700K", "category": "Warmweiß", "hex": "#FFA757", "rgb": {"r": 255, "g": 167, "b": 87}, "rgbw": {"r": 168, "g": 80, "b": 0, "w": 87}, "hsl": {"h": 29, "s": 100, "l": 67}, "cmyk": {"c": 0, "m": 35, "y": 66, "k": 0}, "colorTempKelvin": 2700}, {"id": 149, "name": "Warmweiß 3000K", "category": "Warmweiß", "hex": "#FFB16E", "rgb": {"r": 255, "g": 177, "b": 110}, "rgbw": {"r": 145, "g": 67, "b": 0, "w": 110}, "hsl": {"h": 28, "s": 100, "l": 72}, "cmyk": {"c": 0, "m": 31, "y": 57, "k": 0}, "colorTempKelvin": 3000}, {"id": 150, "name": "Warmweiß 3200K (Studio A)", "category": "Warmweiß", "hex": "#FFB87B", "rgb": {"r": 255, "g": 184, "b": 123}, "rgbw": {"r": 132, "g": 61, "b": 0, "w": 123}, "hsl": {"h": 28, "s": 100, "l": 74}, "cmyk": {"c": 0, "m": 28, "y": 52, "k": 0}, "colorTempKelvin": 3200}, {"id": 151, "name": "Neutralweiß 3500K", "category": "Neutralweiß", "hex": "#FFC18D", "rgb": {"r": 255, "g": 193, "b": 141}, "rgbw": {"r": 114, "g": 52, "b": 0, "w": 141}, "hsl": {"h": 27, "s": 100, "l": 78}, "cmyk": {"c": 0, "m": 24, "y": 45, "k": 0}, "colorTempKelvin": 3500}, {"id": 152, "name": "Neutralweiß 4000K", "category": "Neutralweiß", "hex": "#FFCEA6", "rgb": {"r": 255, "g": 206, "b": 166}, "rgbw": {"r": 89, "g": 40, "b": 0, "w": 166}, "hsl": {"h": 27, "s": 100, "l": 83}, "cmyk": {"c": 0, "m": 19, "y": 35, "k": 0}, "colorTempKelvin": 4000}, {"id": 153, "name": "Neutralweiß 4500K", "category": "Neutralweiß", "hex": "#FFDABB", "rgb": {"r": 255, "g": 218, "b": 187}, "rgbw": {"r": 68, "g": 31, "b": 0, "w": 187}, "hsl": {"h": 27, "s": 100, "l": 87}, "cmyk": {"c": 0, "m": 15, "y": 27, "k": 0}, "colorTempKelvin": 4500}, {"id": 154, "name": "Tageslicht 5000K", "category": "Kaltweiß", "hex": "#FFE4CE", "rgb": {"r": 255, "g": 228, "b": 206}, "rgbw": {"r": 49, "g": 22, "b": 0, "w": 206}, "hsl": {"h": 27, "s": 100, "l": 90}, "cmyk": {"c": 0, "m": 11, "y": 19, "k": 0}, "colorTempKelvin": 5000}, {"id": 155, "name": "Tageslicht 5600K (Studio D)", "category": "Kaltweiß", "hex": "#FFEFE1", "rgb": {"r": 255, "g": 239, "b": 225}, "rgbw": {"r": 30, "g": 14, "b": 0, "w": 225}, "hsl": {"h": 28, "s": 100, "l": 94}, "cmyk": {"c": 0, "m": 6, "y": 12, "k": 0}, "colorTempKelvin": 5600}, {"id": 156, "name": "Kaltweiß 6000K", "category": "Kaltweiß", "hex": "#FFF6ED", "rgb": {"r": 255, "g": 246, "b": 237}, "rgbw": {"r": 18, "g": 9, "b": 0, "w": 237}, "hsl": {"h": 30, "s": 100, "l": 96}, "cmyk": {"c": 0, "m": 4, "y": 7, "k": 0}, "colorTempKelvin": 6000}, {"id": 157, "name": "Kaltweiß 6500K (D65)", "category": "Kaltweiß", "hex": "#FFFEFA", "rgb": {"r": 255, "g": 254, "b": 250}, "rgbw": {"r": 5, "g": 4, "b": 0, "w": 250}, "hsl": {"h": 48, "s": 100, "l": 99}, "cmyk": {"c": 0, "m": 0, "y": 2, "k": 0}, "colorTempKelvin": 6500}, {"id": 158, "name": "Bewölkter Himmel 7000K", "category": "Kaltweiß", "hex": "#F3F2FF", "rgb": {"r": 243, "g": 242, "b": 255}, "rgbw": {"r": 1, "g": 0, "b": 13, "w": 242}, "hsl": {"h": 245, "s": 100, "l": 97}, "cmyk": {"c": 5, "m": 5, "y": 0, "k": 0}, "colorTempKelvin": 7000}, {"id": 159, "name": "Blauer Himmel 8000K", "category": "Kaltweiß", "hex": "#DDE6FF", "rgb": {"r": 221, "g": 230, "b": 255}, "rgbw": {"r": 0, "g": 9, "b": 34, "w": 221}, "hsl": {"h": 224, "s": 100, "l": 93}, "cmyk": {"c": 13, "m": 10, "y": 0, "k": 0}, "colorTempKelvin": 8000}, {"id": 160, "name": "Nordlicht 9000K", "category": "Kaltweiß", "hex": "#D2DFFF", "rgb": {"r": 210, "g": 223, "b": 255}, "rgbw": {"r": 0, "g": 13, "b": 45, "w": 210}, "hsl": {"h": 223, "s": 100, "l": 91}, "cmyk": {"c": 18, "m": 13, "y": 0, "k": 0}, "colorTempKelvin": 9000}, {"id": 161, "name": "Eisblau 10000K", "category": "Kaltweiß", "hex": "#CADAFF", "rgb": {"r": 202, "g": 218, "b": 255}, "rgbw": {"r": 0, "g": 16, "b": 53, "w": 202}, "hsl": {"h": 222, "s": 100, "l": 90}, "cmyk": {"c": 21, "m": 15, "y": 0, "k": 0}, "colorTempKelvin": 10000}, {"id": 162, "name": "Polarlicht 12000K", "category": "Kaltweiß", "hex": "#BFD3FF", "rgb": {"r": 191, "g": 211, "b": 255}, "rgbw": {"r": 0, "g": 20, "b": 64, "w": 191}, "hsl": {"h": 221, "s": 100, "l": 87}, "cmyk": {"c": 25, "m": 17, "y": 0, "k": 0}, "colorTempKelvin": 12000}, {"id": 163, "name": "Bastard Amber", "category": "Gel-Farbe", "hex": "#FFB04F", "rgb": {"r": 255, "g": 176, "b": 79}, "rgbw": {"r": 176, "g": 97, "b": 0, "w": 79}, "hsl": {"h": 33, "s": 100, "l": 65}, "cmyk": {"c": 0, "m": 31, "y": 69, "k": 0}, "colorTempKelvin": null}, {"id": 164, "name": "Congo Blue", "category": "Gel-Farbe", "hex": "#003F87", "rgb": {"r": 0, "g": 63, "b": 135}, "rgbw": {"r": 0, "g": 63, "b": 135, "w": 0}, "hsl": {"h": 212, "s": 100, "l": 26}, "cmyk": {"c": 100, "m": 53, "y": 0, "k": 47}, "colorTempKelvin": null}, {"id": 165, "name": "Steel Blue", "category": "Gel-Farbe", "hex": "#5485A8", "rgb": {"r": 84, "g": 133, "b": 168}, "rgbw": {"r": 0, "g": 49, "b": 84, "w": 84}, "hsl": {"h": 205, "s": 33, "l": 49}, "cmyk": {"c": 50, "m": 21, "y": 0, "k": 34}, "colorTempKelvin": null}, {"id": 166, "name": "Fire", "category": "Gel-Farbe", "hex": "#ED1E24", "rgb": {"r": 237, "g": 30, "b": 36}, "rgbw": {"r": 207, "g": 0, "b": 6, "w": 30}, "hsl": {"h": 358, "s": 85, "l": 52}, "cmyk": {"c": 0, "m": 87, "y": 85, "k": 7}, "colorTempKelvin": null}, {"id": 167, "name": "Deep Amber", "category": "Gel-Farbe", "hex": "#F38519", "rgb": {"r": 243, "g": 133, "b": 25}, "rgbw": {"r": 218, "g": 108, "b": 0, "w": 25}, "hsl": {"h": 30, "s": 90, "l": 53}, "cmyk": {"c": 0, "m": 45, "y": 90, "k": 5}, "colorTempKelvin": null}, {"id": 168, "name": "Straw Tint", "category": "Gel-Farbe", "hex": "#FFEFB2", "rgb": {"r": 255, "g": 239, "b": 178}, "rgbw": {"r": 77, "g": 61, "b": 0, "w": 178}, "hsl": {"h": 48, "s": 100, "l": 85}, "cmyk": {"c": 0, "m": 6, "y": 30, "k": 0}, "colorTempKelvin": null}, {"id": 169, "name": "Surprise Peach", "category": "Gel-Farbe", "hex": "#FFBE96", "rgb": {"r": 255, "g": 190, "b": 150}, "rgbw": {"r": 105, "g": 40, "b": 0, "w": 150}, "hsl": {"h": 23, "s": 100, "l": 79}, "cmyk": {"c": 0, "m": 25, "y": 41, "k": 0}, "colorTempKelvin": null}, {"id": 170, "name": "No Color Straw", "category": "Gel-Farbe", "hex": "#FFF6D2", "rgb": {"r": 255, "g": 246, "b": 210}, "rgbw": {"r": 45, "g": 36, "b": 0, "w": 210}, "hsl": {"h": 48, "s": 100, "l": 91}, "cmyk": {"c": 0, "m": 4, "y": 18, "k": 0}, "colorTempKelvin": null}, {"id": 171, "name": "Rose Pink", "category": "Gel-Farbe", "hex": "#FFA5C8", "rgb": {"r": 255, "g": 165, "b": 200}, "rgbw": {"r": 90, "g": 0, "b": 35, "w": 165}, "hsl": {"h": 337, "s": 100, "l": 82}, "cmyk": {"c": 0, "m": 35, "y": 22, "k": 0}, "colorTempKelvin": null}, {"id": 172, "name": "Special Lavender", "category": "Gel-Farbe", "hex": "#C7B2E0", "rgb": {"r": 199, "g": 178, "b": 224}, "rgbw": {"r": 21, "g": 0, "b": 46, "w": 178}, "hsl": {"h": 267, "s": 43, "l": 79}, "cmyk": {"c": 11, "m": 21, "y": 0, "k": 12}, "colorTempKelvin": null}, {"id": 173, "name": "Moonlight Blue", "category": "Gel-Farbe", "hex": "#6A91C5", "rgb": {"r": 106, "g": 145, "b": 197}, "rgbw": {"r": 0, "g": 39, "b": 91, "w": 106}, "hsl": {"h": 214, "s": 44, "l": 59}, "cmyk": {"c": 46, "m": 26, "y": 0, "k": 23}, "colorTempKelvin": null}, {"id": 174, "name": "Dark Blue Green", "category": "Gel-Farbe", "hex": "#006F6C", "rgb": {"r": 0, "g": 111, "b": 108}, "rgbw": {"r": 0, "g": 111, "b": 108, "w": 0}, "hsl": {"h": 178, "s": 100, "l": 22}, "cmyk": {"c": 100, "m": 0, "y": 3, "k": 56}, "colorTempKelvin": null}, {"id": 175, "name": "Chrome Orange", "category": "Gel-Farbe", "hex": "#FF7420", "rgb": {"r": 255, "g": 116, "b": 32}, "rgbw": {"r": 223, "g": 84, "b": 0, "w": 32}, "hsl": {"h": 23, "s": 100, "l": 56}, "cmyk": {"c": 0, "m": 55, "y": 87, "k": 0}, "colorTempKelvin": null}, {"id": 176, "name": "Golden Amber", "category": "Gel-Farbe", "hex": "#FDB42D", "rgb": {"r": 253, "g": 180, "b": 45}, "rgbw": {"r": 208, "g": 135, "b": 0, "w": 45}, "hsl": {"h": 39, "s": 98, "l": 58}, "cmyk": {"c": 0, "m": 29, "y": 82, "k": 1}, "colorTempKelvin": null}, {"id": 177, "name": "Zenith Blue", "category": "Gel-Farbe", "hex": "#19559E", "rgb": {"r": 25, "g": 85, "b": 158}, "rgbw": {"r": 0, "g": 60, "b": 133, "w": 25}, "hsl": {"h": 213, "s": 73, "l": 36}, "cmyk": {"c": 84, "m": 46, "y": 0, "k": 38}, "colorTempKelvin": null}, {"id": 178, "name": "Storaro Blue", "category": "Gel-Farbe", "hex": "#004C97", "rgb": {"r": 0, "g": 76, "b": 151}, "rgbw": {"r": 0, "g": 76, "b": 151, "w": 0}, "hsl": {"h": 210, "s": 100, "l": 30}, "cmyk": {"c": 100, "m": 50, "y": 0, "k": 41}, "colorTempKelvin": null}, {"id": 179, "name": "Fuchsia Pink", "category": "Gel-Farbe", "hex": "#D9268F", "rgb": {"r": 217, "g": 38, "b": 143}, "rgbw": {"r": 179, "g": 0, "b": 105, "w": 38}, "hsl": {"h": 325, "s": 70, "l": 50}, "cmyk": {"c": 0, "m": 82, "y": 34, "k": 15}, "colorTempKelvin": null}, {"id": 180, "name": "Dark Green", "category": "Gel-Farbe", "hex": "#005C3E", "rgb": {"r": 0, "g": 92, "b": 62}, "rgbw": {"r": 0, "g": 92, "b": 62, "w": 0}, "hsl": {"h": 160, "s": 100, "l": 18}, "cmyk": {"c": 100, "m": 0, "y": 33, "k": 64}, "colorTempKelvin": null}, {"id": 181, "name": "Primary Red", "category": "Gel-Farbe", "hex": "#DA182E", "rgb": {"r": 218, "g": 24, "b": 46}, "rgbw": {"r": 194, "g": 0, "b": 22, "w": 24}, "hsl": {"h": 353, "s": 80, "l": 47}, "cmyk": {"c": 0, "m": 89, "y": 79, "k": 15}, "colorTempKelvin": null}, {"id": 182, "name": "Primary Blue", "category": "Gel-Farbe", "hex": "#004294", "rgb": {"r": 0, "g": 66, "b": 148}, "rgbw": {"r": 0, "g": 66, "b": 148, "w": 0}, "hsl": {"h": 213, "s": 100, "l": 29}, "cmyk": {"c": 100, "m": 55, "y": 0, "k": 42}, "colorTempKelvin": null}, {"id": 183, "name": "Primary Green", "category": "Gel-Farbe", "hex": "#00854A", "rgb": {"r": 0, "g": 133, "b": 74}, "rgbw": {"r": 0, "g": 133, "b": 74, "w": 0}, "hsl": {"h": 153, "s": 100, "l": 26}, "cmyk": {"c": 100, "m": 0, "y": 44, "k": 48}, "colorTempKelvin": null}, {"id": 184, "name": "Deep Lavender", "category": "Gel-Farbe", "hex": "#764E90", "rgb": {"r": 118, "g": 78, "b": 144}, "rgbw": {"r": 40, "g": 0, "b": 66, "w": 78}, "hsl": {"h": 276, "s": 30, "l": 44}, "cmyk": {"c": 18, "m": 46, "y": 0, "k": 44}, "colorTempKelvin": null}, {"id": 185, "name": "Peacock Blue", "category": "Gel-Farbe", "hex": "#00798C", "rgb": {"r": 0, "g": 121, "b": 140}, "rgbw": {"r": 0, "g": 121, "b": 140, "w": 0}, "hsl": {"h": 188, "s": 100, "l": 27}, "cmyk": {"c": 100, "m": 14, "y": 0, "k": 45}, "colorTempKelvin": null}, {"id": 186, "name": "Flame Red", "category": "Gel-Farbe", "hex": "#DE281E", "rgb": {"r": 222, "g": 40, "b": 30}, "rgbw": {"r": 192, "g": 10, "b": 0, "w": 30}, "hsl": {"h": 3, "s": 76, "l": 49}, "cmyk": {"c": 0, "m": 82, "y": 86, "k": 13}, "colorTempKelvin": null}, {"id": 187, "name": "Tangerine", "category": "Gel-Farbe", "hex": "#FF7414", "rgb": {"r": 255, "g": 116, "b": 20}, "rgbw": {"r": 235, "g": 96, "b": 0, "w": 20}, "hsl": {"h": 25, "s": 100, "l": 54}, "cmyk": {"c": 0, "m": 55, "y": 92, "k": 0}, "colorTempKelvin": null}, {"id": 188, "name": "Canary Yellow", "category": "Gel-Farbe", "hex": "#FFE020", "rgb": {"r": 255, "g": 224, "b": 32}, "rgbw": {"r": 223, "g": 192, "b": 0, "w": 32}, "hsl": {"h": 52, "s": 100, "l": 56}, "cmyk": {"c": 0, "m": 12, "y": 87, "k": 0}, "colorTempKelvin": null}, {"id": 189, "name": "Pea Green", "category": "Gel-Farbe", "hex": "#8FBA3C", "rgb": {"r": 143, "g": 186, "b": 60}, "rgbw": {"r": 83, "g": 126, "b": 0, "w": 60}, "hsl": {"h": 80, "s": 51, "l": 48}, "cmyk": {"c": 23, "m": 0, "y": 68, "k": 27}, "colorTempKelvin": null}, {"id": 190, "name": "Sea Blue", "category": "Gel-Farbe", "hex": "#006982", "rgb": {"r": 0, "g": 105, "b": 130}, "rgbw": {"r": 0, "g": 105, "b": 130, "w": 0}, "hsl": {"h": 192, "s": 100, "l": 25}, "cmyk": {"c": 100, "m": 19, "y": 0, "k": 49}, "colorTempKelvin": null}, {"id": 191, "name": "Royal Purple", "category": "Gel-Farbe", "hex": "#5A187A", "rgb": {"r": 90, "g": 24, "b": 122}, "rgbw": {"r": 66, "g": 0, "b": 98, "w": 24}, "hsl": {"h": 280, "s": 67, "l": 29}, "cmyk": {"c": 26, "m": 80, "y": 0, "k": 52}, "colorTempKelvin": null}, {"id": 192, "name": "Hot Magenta", "category": "Gel-Farbe", "hex": "#EC008C", "rgb": {"r": 236, "g": 0, "b": 140}, "rgbw": {"r": 236, "g": 0, "b": 140, "w": 0}, "hsl": {"h": 324, "s": 100, "l": 46}, "cmyk": {"c": 0, "m": 100, "y": 41, "k": 7}, "colorTempKelvin": null}, {"id": 193, "name": "UV Violett", "category": "Bühnenspezial", "hex": "#8A2BE2", "rgb": {"r": 138, "g": 43, "b": 226}, "rgbw": {"r": 95, "g": 0, "b": 183, "w": 43}, "hsl": {"h": 271, "s": 76, "l": 53}, "cmyk": {"c": 39, "m": 81, "y": 0, "k": 11}, "colorTempKelvin": null}, {"id": 194, "name": "Blacklight Purple", "category": "Bühnenspezial", "hex": "#6600CC", "rgb": {"r": 102, "g": 0, "b": 204}, "rgbw": {"r": 102, "g": 0, "b": 204, "w": 0}, "hsl": {"h": 270, "s": 100, "l": 40}, "cmyk": {"c": 50, "m": 100, "y": 0, "k": 20}, "colorTempKelvin": null}, {"id": 195, "name": "Laser Grün", "category": "Bühnenspezial", "hex": "#39FF14", "rgb": {"r": 57, "g": 255, "b": 20}, "rgbw": {"r": 37, "g": 235, "b": 0, "w": 20}, "hsl": {"h": 111, "s": 100, "l": 54}, "cmyk": {"c": 78, "m": 0, "y": 92, "k": 0}, "colorTempKelvin": null}, {"id": 196, "name": "Laser Rot", "category": "Bühnenspezial", "hex": "#FF0707", "rgb": {"r": 255, "g": 7, "b": 7}, "rgbw": {"r": 248, "g": 0, "b": 0, "w": 7}, "hsl": {"h": 0, "s": 100, "l": 51}, "cmyk": {"c": 0, "m": 97, "y": 97, "k": 0}, "colorTempKelvin": null}, {"id": 197, "name": "Plasma Blau", "category": "Bühnenspezial", "hex": "#1482FF", "rgb": {"r": 20, "g": 130, "b": 255}, "rgbw": {"r": 0, "g": 110, "b": 235, "w": 20}, "hsl": {"h": 212, "s": 100, "l": 54}, "cmyk": {"c": 92, "m": 49, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 198, "name": "Stroboskop Weiß", "category": "Bühnenspezial", "hex": "#FFFFFF", "rgb": {"r": 255, "g": 255, "b": 255}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 255}, "hsl": {"h": 0, "s": 0, "l": 100}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 199, "name": "Neon Pink", "category": "Bühnenspezial", "hex": "#FF10F0", "rgb": {"r": 255, "g": 16, "b": 240}, "rgbw": {"r": 239, "g": 0, "b": 224, "w": 16}, "hsl": {"h": 304, "s": 100, "l": 53}, "cmyk": {"c": 0, "m": 94, "y": 6, "k": 0}, "colorTempKelvin": null}, {"id": 200, "name": "Neon Grün", "category": "Bühnenspezial", "hex": "#39FF20", "rgb": {"r": 57, "g": 255, "b": 32}, "rgbw": {"r": 25, "g": 223, "b": 0, "w": 32}, "hsl": {"h": 113, "s": 100, "l": 56}, "cmyk": {"c": 78, "m": 0, "y": 87, "k": 0}, "colorTempKelvin": null}, {"id": 201, "name": "Neon Orange", "category": "Bühnenspezial", "hex": "#FF5F1F", "rgb": {"r": 255, "g": 95, "b": 31}, "rgbw": {"r": 224, "g": 64, "b": 0, "w": 31}, "hsl": {"h": 17, "s": 100, "l": 56}, "cmyk": {"c": 0, "m": 63, "y": 88, "k": 0}, "colorTempKelvin": null}, {"id": 202, "name": "Neon Gelb", "category": "Bühnenspezial", "hex": "#F5FF14", "rgb": {"r": 245, "g": 255, "b": 20}, "rgbw": {"r": 225, "g": 235, "b": 0, "w": 20}, "hsl": {"h": 63, "s": 100, "l": 54}, "cmyk": {"c": 4, "m": 0, "y": 92, "k": 0}, "colorTempKelvin": null}, {"id": 203, "name": "Electric Blue", "category": "Bühnenspezial", "hex": "#0096FF", "rgb": {"r": 0, "g": 150, "b": 255}, "rgbw": {"r": 0, "g": 150, "b": 255, "w": 0}, "hsl": {"h": 205, "s": 100, "l": 50}, "cmyk": {"c": 100, "m": 41, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 204, "name": "Acid Green", "category": "Bühnenspezial", "hex": "#B0FF00", "rgb": {"r": 176, "g": 255, "b": 0}, "rgbw": {"r": 176, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 79, "s": 100, "l": 50}, "cmyk": {"c": 31, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 205, "name": "Cyber Magenta", "category": "Bühnenspezial", "hex": "#FF00AA", "rgb": {"r": 255, "g": 0, "b": 170}, "rgbw": {"r": 255, "g": 0, "b": 170, "w": 0}, "hsl": {"h": 320, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 100, "y": 33, "k": 0}, "colorTempKelvin": null}, {"id": 206, "name": "Toxic Green", "category": "Bühnenspezial", "hex": "#80FF00", "rgb": {"r": 128, "g": 255, "b": 0}, "rgbw": {"r": 128, "g": 255, "b": 0, "w": 0}, "hsl": {"h": 90, "s": 100, "l": 50}, "cmyk": {"c": 50, "m": 0, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 207, "name": "Deep Space Blau", "category": "Bühnenspezial", "hex": "#0A0A3C", "rgb": {"r": 10, "g": 10, "b": 60}, "rgbw": {"r": 0, "g": 0, "b": 50, "w": 10}, "hsl": {"h": 240, "s": 71, "l": 14}, "cmyk": {"c": 83, "m": 83, "y": 0, "k": 76}, "colorTempKelvin": null}, {"id": 208, "name": "Feuerlicht", "category": "Bühnenspezial", "hex": "#FF4500", "rgb": {"r": 255, "g": 69, "b": 0}, "rgbw": {"r": 255, "g": 69, "b": 0, "w": 0}, "hsl": {"h": 16, "s": 100, "l": 50}, "cmyk": {"c": 0, "m": 73, "y": 100, "k": 0}, "colorTempKelvin": null}, {"id": 209, "name": "Eisfeuer", "category": "Bühnenspezial", "hex": "#B4FFFA", "rgb": {"r": 180, "g": 255, "b": 250}, "rgbw": {"r": 0, "g": 75, "b": 70, "w": 180}, "hsl": {"h": 176, "s": 100, "l": 85}, "cmyk": {"c": 29, "m": 0, "y": 2, "k": 0}, "colorTempKelvin": null}, {"id": 210, "name": "Vulkan Rot", "category": "Bühnenspezial", "hex": "#BE140A", "rgb": {"r": 190, "g": 20, "b": 10}, "rgbw": {"r": 180, "g": 10, "b": 0, "w": 10}, "hsl": {"h": 3, "s": 90, "l": 39}, "cmyk": {"c": 0, "m": 89, "y": 95, "k": 25}, "colorTempKelvin": null}, {"id": 211, "name": "Galaxie Violett", "category": "Bühnenspezial", "hex": "#4B0082", "rgb": {"r": 75, "g": 0, "b": 130}, "rgbw": {"r": 75, "g": 0, "b": 130, "w": 0}, "hsl": {"h": 275, "s": 100, "l": 25}, "cmyk": {"c": 42, "m": 100, "y": 0, "k": 49}, "colorTempKelvin": null}, {"id": 212, "name": "Sonnenaufgang", "category": "Bühnenspezial", "hex": "#FF934F", "rgb": {"r": 255, "g": 147, "b": 79}, "rgbw": {"r": 176, "g": 68, "b": 0, "w": 79}, "hsl": {"h": 23, "s": 100, "l": 65}, "cmyk": {"c": 0, "m": 42, "y": 69, "k": 0}, "colorTempKelvin": null}, {"id": 213, "name": "Hauttöne Hell 1", "category": "Hauttöne", "hex": "#FFE0C4", "rgb": {"r": 255, "g": 224, "b": 196}, "rgbw": {"r": 59, "g": 28, "b": 0, "w": 196}, "hsl": {"h": 28, "s": 100, "l": 88}, "cmyk": {"c": 0, "m": 12, "y": 23, "k": 0}, "colorTempKelvin": null}, {"id": 214, "name": "Hauttöne Hell 2", "category": "Hauttöne", "hex": "#FFD5B2", "rgb": {"r": 255, "g": 213, "b": 178}, "rgbw": {"r": 77, "g": 35, "b": 0, "w": 178}, "hsl": {"h": 27, "s": 100, "l": 85}, "cmyk": {"c": 0, "m": 16, "y": 30, "k": 0}, "colorTempKelvin": null}, {"id": 215, "name": "Hauttöne Mittel 1", "category": "Hauttöne", "hex": "#EAC096", "rgb": {"r": 234, "g": 192, "b": 150}, "rgbw": {"r": 84, "g": 42, "b": 0, "w": 150}, "hsl": {"h": 30, "s": 67, "l": 75}, "cmyk": {"c": 0, "m": 18, "y": 36, "k": 8}, "colorTempKelvin": null}, {"id": 216, "name": "Hauttöne Mittel 2", "category": "Hauttöne", "hex": "#D1A375", "rgb": {"r": 209, "g": 163, "b": 117}, "rgbw": {"r": 92, "g": 46, "b": 0, "w": 117}, "hsl": {"h": 30, "s": 50, "l": 64}, "cmyk": {"c": 0, "m": 22, "y": 44, "k": 18}, "colorTempKelvin": null}, {"id": 217, "name": "Hauttöne Warm 1", "category": "Hauttöne", "hex": "#C68642", "rgb": {"r": 198, "g": 134, "b": 66}, "rgbw": {"r": 132, "g": 68, "b": 0, "w": 66}, "hsl": {"h": 31, "s": 54, "l": 52}, "cmyk": {"c": 0, "m": 32, "y": 67, "k": 22}, "colorTempKelvin": null}, {"id": 218, "name": "Hauttöne Warm 2", "category": "Hauttöne", "hex": "#A1665E", "rgb": {"r": 161, "g": 102, "b": 94}, "rgbw": {"r": 67, "g": 8, "b": 0, "w": 94}, "hsl": {"h": 7, "s": 26, "l": 50}, "cmyk": {"c": 0, "m": 37, "y": 42, "k": 37}, "colorTempKelvin": null}, {"id": 219, "name": "Hauttöne Dunkel 1", "category": "Hauttöne", "hex": "#8D5524", "rgb": {"r": 141, "g": 85, "b": 36}, "rgbw": {"r": 105, "g": 49, "b": 0, "w": 36}, "hsl": {"h": 28, "s": 59, "l": 35}, "cmyk": {"c": 0, "m": 40, "y": 74, "k": 45}, "colorTempKelvin": null}, {"id": 220, "name": "Hauttöne Dunkel 2", "category": "Hauttöne", "hex": "#5C3317", "rgb": {"r": 92, "g": 51, "b": 23}, "rgbw": {"r": 69, "g": 28, "b": 0, "w": 23}, "hsl": {"h": 24, "s": 60, "l": 23}, "cmyk": {"c": 0, "m": 45, "y": 75, "k": 64}, "colorTempKelvin": null}, {"id": 221, "name": "Bronzeton", "category": "Hauttöne", "hex": "#CD7F32", "rgb": {"r": 205, "g": 127, "b": 50}, "rgbw": {"r": 155, "g": 77, "b": 0, "w": 50}, "hsl": {"h": 30, "s": 61, "l": 50}, "cmyk": {"c": 0, "m": 38, "y": 76, "k": 20}, "colorTempKelvin": null}, {"id": 222, "name": "Terracotta", "category": "Hauttöne", "hex": "#CC4E5C", "rgb": {"r": 204, "g": 78, "b": 92}, "rgbw": {"r": 126, "g": 0, "b": 14, "w": 78}, "hsl": {"h": 353, "s": 55, "l": 55}, "cmyk": {"c": 0, "m": 62, "y": 55, "k": 20}, "colorTempKelvin": null}, {"id": 223, "name": "Reinweiß", "category": "Grautöne", "hex": "#FFFFFF", "rgb": {"r": 255, "g": 255, "b": 255}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 255}, "hsl": {"h": 0, "s": 0, "l": 100}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 0}, "colorTempKelvin": null}, {"id": 224, "name": "Silberweiß", "category": "Grautöne", "hex": "#F0F0F0", "rgb": {"r": 240, "g": 240, "b": 240}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 240}, "hsl": {"h": 0, "s": 0, "l": 94}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 6}, "colorTempKelvin": null}, {"id": 225, "name": "Hellgrau", "category": "Grautöne", "hex": "#D2D2D2", "rgb": {"r": 210, "g": 210, "b": 210}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 210}, "hsl": {"h": 0, "s": 0, "l": 82}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 18}, "colorTempKelvin": null}, {"id": 226, "name": "Grau", "category": "Grautöne", "hex": "#AAAAAA", "rgb": {"r": 170, "g": 170, "b": 170}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 170}, "hsl": {"h": 0, "s": 0, "l": 67}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 33}, "colorTempKelvin": null}, {"id": 227, "name": "Mittelgrau", "category": "Grautöne", "hex": "#808080", "rgb": {"r": 128, "g": 128, "b": 128}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 128}, "hsl": {"h": 0, "s": 0, "l": 50}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 50}, "colorTempKelvin": null}, {"id": 228, "name": "Dunkelgrau", "category": "Grautöne", "hex": "#5A5A5A", "rgb": {"r": 90, "g": 90, "b": 90}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 90}, "hsl": {"h": 0, "s": 0, "l": 35}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 65}, "colorTempKelvin": null}, {"id": 229, "name": "Anthrazit", "category": "Grautöne", "hex": "#373737", "rgb": {"r": 55, "g": 55, "b": 55}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 55}, "hsl": {"h": 0, "s": 0, "l": 22}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 78}, "colorTempKelvin": null}, {"id": 230, "name": "Tiefschwarz", "category": "Grautöne", "hex": "#0F0F0F", "rgb": {"r": 15, "g": 15, "b": 15}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 15}, "hsl": {"h": 0, "s": 0, "l": 6}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 94}, "colorTempKelvin": null}, {"id": 231, "name": "Absolutschwarz (Bühne aus)", "category": "Grautöne", "hex": "#000000", "rgb": {"r": 0, "g": 0, "b": 0}, "rgbw": {"r": 0, "g": 0, "b": 0, "w": 0}, "hsl": {"h": 0, "s": 0, "l": 0}, "cmyk": {"c": 0, "m": 0, "y": 0, "k": 100}, "colorTempKelvin": null}, {"id": 232, "name": "Waldgrün", "category": "Naturtöne", "hex": "#225926", "rgb": {"r": 34, "g": 89, "b": 38}, "rgbw": {"r": 0, "g": 55, "b": 4, "w": 34}, "hsl": {"h": 124, "s": 45, "l": 24}, "cmyk": {"c": 62, "m": 0, "y": 57, "k": 65}, "colorTempKelvin": null}, {"id": 233, "name": "Moosgrün", "category": "Naturtöne", "hex": "#52662E", "rgb": {"r": 82, "g": 102, "b": 46}, "rgbw": {"r": 36, "g": 56, "b": 0, "w": 46}, "hsl": {"h": 81, "s": 38, "l": 29}, "cmyk": {"c": 20, "m": 0, "y": 55, "k": 60}, "colorTempKelvin": null}, {"id": 234, "name": "Olivgrün", "category": "Naturtöne", "hex": "#808000", "rgb": {"r": 128, "g": 128, "b": 0}, "rgbw": {"r": 128, "g": 128, "b": 0, "w": 0}, "hsl": {"h": 60, "s": 100, "l": 25}, "cmyk": {"c": 0, "m": 0, "y": 100, "k": 50}, "colorTempKelvin": null}, {"id": 235, "name": "Himmelsblau Tag", "category": "Naturtöne", "hex": "#87CEEB", "rgb": {"r": 135, "g": 206, "b": 235}, "rgbw": {"r": 0, "g": 71, "b": 100, "w": 135}, "hsl": {"h": 197, "s": 71, "l": 73}, "cmyk": {"c": 43, "m": 12, "y": 0, "k": 8}, "colorTempKelvin": null}, {"id": 236, "name": "Ozeanblau", "category": "Naturtöne", "hex": "#006994", "rgb": {"r": 0, "g": 105, "b": 148}, "rgbw": {"r": 0, "g": 105, "b": 148, "w": 0}, "hsl": {"h": 197, "s": 100, "l": 29}, "cmyk": {"c": 100, "m": 29, "y": 0, "k": 42}, "colorTempKelvin": null}, {"id": 237, "name": "Sandbeige", "category": "Naturtöne", "hex": "#EDC9AF", "rgb": {"r": 237, "g": 201, "b": 175}, "rgbw": {"r": 62, "g": 26, "b": 0, "w": 175}, "hsl": {"h": 25, "s": 63, "l": 81}, "cmyk": {"c": 0, "m": 15, "y": 26, "k": 7}, "colorTempKelvin": null}, {"id": 238, "name": "Wüstensand", "category": "Naturtöne", "hex": "#EDB287", "rgb": {"r": 237, "g": 178, "b": 135}, "rgbw": {"r": 102, "g": 43, "b": 0, "w": 135}, "hsl": {"h": 25, "s": 74, "l": 73}, "cmyk": {"c": 0, "m": 25, "y": 43, "k": 7}, "colorTempKelvin": null}, {"id": 239, "name": "Herbstlaub", "category": "Naturtöne", "hex": "#BF5700", "rgb": {"r": 191, "g": 87, "b": 0}, "rgbw": {"r": 191, "g": 87, "b": 0, "w": 0}, "hsl": {"h": 27, "s": 100, "l": 37}, "cmyk": {"c": 0, "m": 54, "y": 100, "k": 25}, "colorTempKelvin": null}, {"id": 240, "name": "Rostrot", "category": "Naturtöne", "hex": "#B7410E", "rgb": {"r": 183, "g": 65, "b": 14}, "rgbw": {"r": 169, "g": 51, "b": 0, "w": 14}, "hsl": {"h": 18, "s": 86, "l": 39}, "cmyk": {"c": 0, "m": 64, "y": 92, "k": 28}, "colorTempKelvin": null}, {"id": 241, "name": "Lehmbraun", "category": "Naturtöne", "hex": "#82502B", "rgb": {"r": 130, "g": 80, "b": 43}, "rgbw": {"r": 87, "g": 37, "b": 0, "w": 43}, "hsl": {"h": 26, "s": 50, "l": 34}, "cmyk": {"c": 0, "m": 38, "y": 67, "k": 49}, "colorTempKelvin": null}, {"id": 242, "name": "Korallenrot", "category": "Naturtöne", "hex": "#FF7F50", "rgb": {"r": 255, "g": 127, "b": 80}, "rgbw": {"r": 175, "g": 47, "b": 0, "w": 80}, "hsl": {"h": 16, "s": 100, "l": 66}, "cmyk": {"c": 0, "m": 50, "y": 69, "k": 0}, "colorTempKelvin": null}, {"id": 243, "name": "Lavendelfeld", "category": "Naturtöne", "hex": "#B57EDC", "rgb": {"r": 181, "g": 126, "b": 220}, "rgbw": {"r": 55, "g": 0, "b": 94, "w": 126}, "hsl": {"h": 275, "s": 57, "l": 68}, "cmyk": {"c": 18, "m": 43, "y": 0, "k": 14}, "colorTempKelvin": null}, {"id": 244, "name": "Frühlingsblüte", "category": "Naturtöne", "hex": "#FFB7C5", "rgb": {"r": 255, "g": 183, "b": 197}, "rgbw": {"r": 72, "g": 0, "b": 14, "w": 183}, "hsl": {"h": 348, "s": 100, "l": 86}, "cmyk": {"c": 0, "m": 28, "y": 23, "k": 0}, "colorTempKelvin": null}, {"id": 245, "name": "Weinrot", "category": "Naturtöne", "hex": "#722F37", "rgb": {"r": 114, "g": 47, "b": 55}, "rgbw": {"r": 67, "g": 0, "b": 8, "w": 47}, "hsl": {"h": 353, "s": 42, "l": 32}, "cmyk": {"c": 0, "m": 59, "y": 52, "k": 55}, "colorTempKelvin": null}, {"id": 246, "name": "Mahagoni", "category": "Naturtöne", "hex": "#592317", "rgb": {"r": 89, "g": 35, "b": 23}, "rgbw": {"r": 66, "g": 12, "b": 0, "w": 23}, "hsl": {"h": 11, "s": 59, "l": 22}, "cmyk": {"c": 0, "m": 61, "y": 74, "k": 65}, "colorTempKelvin": null}];


/* ======================================================================
   1) GLOBALER ANWENDUNGSZUSTAND
   ====================================================================== */
const App = {
  colors: [],                 // vollständige Farbdatenbank
  filtered: [],                // aktuell gefilterte Ansicht (Datenbank-Tab)
  favorites: [],               // gespeicherte Favoriten (Array von Farbobjekten)
  presets: [],                 // gespeicherte Presets [{name, colors:[...]}]
  history: [],                 // zuletzt angesehene Farben (max. 24)
  compareA: null,              // aktuell gewählte Farbe A (Vergleich)
  compareB: null,              // aktuell gewählte Farbe B (Vergleich)
  selectedForLighting: null,   // Basisfarbe für den Live-Regler (Lichttechnik)
  fadeAnimTimer: null
};

const STORAGE_KEYS = {
  favorites: "lichtfarben_favorites_v1",
  presets: "lichtfarben_presets_v1",
  history: "lichtfarben_history_v1"
};

/* ======================================================================
   2) FARBMATHEMATIK — reine Umrechnungsfunktionen
   ====================================================================== */
const ColorMath = {
  clamp(v, min = 0, max = 255) {
    return Math.max(min, Math.min(max, v));
  },

  hexToRgb(hex) {
    hex = hex.replace("#", "").trim();
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  },

  rgbToHex(r, g, b) {
    const h = (n) => this.clamp(Math.round(n)).toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
  },

  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  },

  hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  },

  rgbToCmyk(r, g, b) {
    if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
    const rf = r / 255, gf = g / 255, bf = b / 255;
    const k = 1 - Math.max(rf, gf, bf);
    const c = (1 - rf - k) / (1 - k);
    const m = (1 - gf - k) / (1 - k);
    const y = (1 - bf - k) / (1 - k);
    return {
      c: Math.round(c * 100), m: Math.round(m * 100),
      y: Math.round(y * 100), k: Math.round(k * 100)
    };
  },

  /* Lichttechnisch korrekte RGB->RGBW Umrechnung: der gemeinsame
     Mindestanteil aller drei Kanäle wird als "reines Weiß" extrahiert. */
  rgbToRgbw(r, g, b) {
    const w = Math.min(r, g, b);
    return {
      r: Math.round(r - w),
      g: Math.round(g - w),
      b: Math.round(b - w),
      w: Math.round(w)
    };
  },

  /* Relative Luminanz nach WCAG (für Kontrastberechnung) */
  relativeLuminance(r, g, b) {
    const toLinear = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const R = toLinear(r), G = toLinear(g), B = toLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },

  /* WCAG-Kontrastverhältnis zweier Farben (1 - 21) */
  contrastRatio(rgbA, rgbB) {
    const lA = this.relativeLuminance(rgbA.r, rgbA.g, rgbA.b) + 0.05;
    const lB = this.relativeLuminance(rgbB.r, rgbB.g, rgbB.b) + 0.05;
    const ratio = lA > lB ? lA / lB : lB / lA;
    return Math.round(ratio * 100) / 100;
  },

  /* Additive Farbmischung mehrerer Lichtquellen (wie überlagerte Scheinwerfer) */
  additiveMix(rgbList) {
    let r = 0, g = 0, b = 0;
    rgbList.forEach((c) => {
      r += c.r; g += c.g; b += c.b;
    });
    return { r: this.clamp(r), g: this.clamp(g), b: this.clamp(b) };
  },

  /* Lineare Interpolation zwischen zwei RGB-Farben, t in [0,1] */
  lerpRgb(rgbA, rgbB, t) {
    return {
      r: Math.round(rgbA.r + (rgbB.r - rgbA.r) * t),
      g: Math.round(rgbA.g + (rgbB.g - rgbA.g) * t),
      b: Math.round(rgbA.b + (rgbB.b - rgbA.b) * t)
    };
  },

  hueDifference(hA, hB) {
    let d = Math.abs(hA - hB) % 360;
    return d > 180 ? 360 - d : d;
  }
};

/* ======================================================================
   3) DATENLADEN
   ====================================================================== */
async function loadColorDatabase() {
  try {
    const res = await fetch("farben.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    App.colors = data.farben;
    console.info(`[LichtFarben Pro] ${App.colors.length} Farben aus farben.json geladen.`);
  } catch (err) {
    // Fallback: eingebettete Kopie verwenden (z. B. bei file:// CORS-Sperre)
    App.colors = EMBEDDED_FARBEN_DATA;
    console.info(`[LichtFarben Pro] farben.json nicht per fetch verfügbar (${err.message}). Eingebettete Datenbank mit ${App.colors.length} Farben wird genutzt.`);
  }
  App.filtered = App.colors.slice();
}

function loadLocalStorage() {
  try {
    App.favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites)) || [];
  } catch { App.favorites = []; }
  try {
    App.presets = JSON.parse(localStorage.getItem(STORAGE_KEYS.presets)) || [];
  } catch { App.presets = []; }
  try {
    App.history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
  } catch { App.history = []; }
}

function persist(key) {
  const map = {
    favorites: STORAGE_KEYS.favorites,
    presets: STORAGE_KEYS.presets,
    history: STORAGE_KEYS.history
  };
  localStorage.setItem(map[key], JSON.stringify(App[key]));
}

/* ======================================================================
   4) HILFSFUNKTIONEN UI
   ====================================================================== */
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

let toastTimer = null;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Kopiert: ${text}`);
  } catch {
    // Fallback für ältere WebViews
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast(`Kopiert: ${text}`);
  }
}

function isFavorite(colorId) {
  return App.favorites.some((f) => f.id === colorId);
}

function toggleFavorite(color) {
  const idx = App.favorites.findIndex((f) => f.id === color.id);
  if (idx >= 0) {
    App.favorites.splice(idx, 1);
    showToast(`„${color.name}“ aus Favoriten entfernt`);
  } else {
    App.favorites.push(color);
    showToast(`„${color.name}“ zu Favoriten hinzugefügt`);
  }
  persist("favorites");
  renderColorGrid();
  renderFavorites();
}

function addToHistory(color) {
  App.history = App.history.filter((c) => c.id !== color.id);
  App.history.unshift(color);
  if (App.history.length > 24) App.history.length = 24;
  persist("history");
  renderHistory();
}

/* ======================================================================
   5) TAB-NAVIGATION
   ====================================================================== */
function initTabs() {
  $all(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $all(".tab-btn").forEach((b) => b.classList.remove("active"));
      $all(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      $(`#tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  $("#btnFavoritesTop").addEventListener("click", () => {
    $all(".tab-btn").forEach((b) => b.classList.remove("active"));
    $all(".tab-panel").forEach((p) => p.classList.remove("active"));
    $('.tab-btn[data-tab="favoriten"]').classList.add("active");
    $("#tab-favoriten").classList.add("active");
  });

  $("#btnHistory").addEventListener("click", () => {
    $all(".tab-btn").forEach((b) => b.classList.remove("active"));
    $all(".tab-panel").forEach((p) => p.classList.remove("active"));
    $('.tab-btn[data-tab="extras"]').classList.add("active");
    $("#tab-extras").classList.add("active");
  });
}

/* ======================================================================
   6) FARBKARTE (wiederverwendbare Kachel-Komponente)
   ====================================================================== */
function buildColorCard(color, options = {}) {
  const card = document.createElement("div");
  card.className = "color-card";

  const swatch = document.createElement("div");
  swatch.className = "swatch";
  swatch.style.background = color.hex;
  card.appendChild(swatch);

  const favBtn = document.createElement("button");
  favBtn.className = "fav-btn" + (isFavorite(color.id) ? " active" : "");
  favBtn.textContent = isFavorite(color.id) ? "★" : "☆";
  favBtn.title = "Zu Favoriten hinzufügen/entfernen";
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(color);
  });
  card.appendChild(favBtn);

  const info = document.createElement("div");
  info.className = "info";
  info.innerHTML = `
    <p class="name">${color.name}</p>
    <div class="meta"><span>${color.hex}</span><span>${color.category}</span></div>
  `;
  card.appendChild(info);

  card.addEventListener("click", () => {
    addToHistory(color);
    App.selectedForLighting = color;
    updateLightingBaseFromColor(color);
    if (options.onSelect) options.onSelect(color);
    else showToast(`${color.name} ausgewählt`);
  });

  return card;
}

function renderColorGrid() {
  const grid = $("#colorGrid");
  grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  App.filtered.forEach((c) => frag.appendChild(buildColorCard(c)));
  grid.appendChild(frag);
  $("#resultCount").textContent = `${App.filtered.length} Farbe${App.filtered.length === 1 ? "" : "n"}`;
}

function populateCategoryFilter() {
  const select = $("#categoryFilter");
  const categories = Array.from(new Set(App.colors.map((c) => c.category))).sort();
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function applyFilters() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const category = $("#categoryFilter").value;

  App.filtered = App.colors.filter((c) => {
    const matchesCategory = !category || c.category === category;
    if (!matchesCategory) return false;
    if (!query) return true;
    const rgbStr = `${c.rgb.r},${c.rgb.g},${c.rgb.b}`;
    const haystack = [
      c.name.toLowerCase(),
      c.category.toLowerCase(),
      c.hex.toLowerCase(),
      rgbStr,
      String(c.rgb.r), String(c.rgb.g), String(c.rgb.b)
    ].join(" ");
    return haystack.includes(query);
  });
  renderColorGrid();
}

function initSearch() {
  $("#searchInput").addEventListener("input", applyFilters);
  $("#categoryFilter").addEventListener("change", applyFilters);
}

/* ======================================================================
   7) HISTORIE (Extras-Tab)
   ====================================================================== */
function renderHistory() {
  const grid = $("#historyGrid");
  grid.innerHTML = "";
  const hint = $("#historyEmptyHint");
  if (App.history.length === 0) {
    hint.style.display = "block";
    return;
  }
  hint.style.display = "none";
  const frag = document.createDocumentFragment();
  App.history.forEach((c) => frag.appendChild(buildColorCard(c)));
  grid.appendChild(frag);
}

/* ======================================================================
   8) VERGLEICHS-TAB
   ====================================================================== */
function renderMiniList(containerId, query, onPick) {
  const container = $(containerId);
  container.innerHTML = "";
  const q = query.trim().toLowerCase();
  const results = (q
    ? App.colors.filter((c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q))
    : App.colors
  ).slice(0, 40);

  results.forEach((c) => {
    const item = document.createElement("div");
    item.className = "mini-list-item";
    item.innerHTML = `<span class="dot" style="background:${c.hex}"></span><span>${c.name}</span>`;
    item.addEventListener("click", () => onPick(c));
    container.appendChild(item);
  });
}

function setCompareColor(slot, color) {
  if (slot === "A") App.compareA = color;
  else App.compareB = color;
  $(`#swatch${slot}`).style.background = color.hex;
  runComparison();
}

function initCompareTab() {
  App.compareA = App.colors[0];
  App.compareB = App.colors[40] || App.colors[1];

  renderMiniList("#listA", "", (c) => setCompareColor("A", c));
  renderMiniList("#listB", "", (c) => setCompareColor("B", c));

  $("#compareSearchA").addEventListener("input", (e) =>
    renderMiniList("#listA", e.target.value, (c) => setCompareColor("A", c))
  );
  $("#compareSearchB").addEventListener("input", (e) =>
    renderMiniList("#listB", e.target.value, (c) => setCompareColor("B", c))
  );

  $("#swatchA").style.background = App.compareA.hex;
  $("#swatchB").style.background = App.compareB.hex;
  runComparison();
}

function harmonyLabelFor(diff) {
  if (diff <= 15) return "Monochromatisch / Analog eng";
  if (diff <= 45) return "Analog";
  if (diff >= 150 && diff <= 180) return "Komplementär";
  if (diff >= 100 && diff < 150) return "Triadisch / Split-Komplementär";
  if (diff >= 60 && diff < 100) return "Tetradisch";
  return "Freie Kombination";
}

function runComparison() {
  const a = App.compareA, b = App.compareB;
  if (!a || !b) return;

  const rgbA = a.rgb, rgbB = b.rgb;
  const contrast = ColorMath.contrastRatio(rgbA, rgbB);
  const hueDiff = ColorMath.hueDifference(a.hsl.h, b.hsl.h);
  const complementHue = (a.hsl.h + 180) % 360;
  const complementRgb = ColorMath.hslToRgb(complementHue, a.hsl.s, a.hsl.l);
  const complementHex = ColorMath.rgbToHex(complementRgb.r, complementRgb.g, complementRgb.b);

  let wcagLabel = "AA-fähig (Text groß)";
  if (contrast >= 7) wcagLabel = "AAA (sehr hoher Kontrast)";
  else if (contrast >= 4.5) wcagLabel = "AA (normaler Text)";
  else if (contrast >= 3) wcagLabel = "AA (nur große Schrift)";
  else wcagLabel = "Unzureichender Kontrast";

  const grid = $("#analysisGrid");
  grid.innerHTML = `
    <div class="analysis-item">
      <div class="label">Kontrastverhältnis</div>
      <div class="value">${contrast}:1</div>
    </div>
    <div class="analysis-item">
      <div class="label">WCAG-Bewertung</div>
      <div class="value small">${wcagLabel}</div>
    </div>
    <div class="analysis-item">
      <div class="label">Farbton-Differenz</div>
      <div class="value">${hueDiff}°</div>
    </div>
    <div class="analysis-item">
      <div class="label">Harmonie-Typ (A ↔ B)</div>
      <div class="value small">${harmonyLabelFor(hueDiff)}</div>
    </div>
    <div class="analysis-item">
      <div class="label">Komplementärfarbe zu A</div>
      <div class="value small" style="display:flex; align-items:center; gap:8px;">
        <span style="width:18px;height:18px;border-radius:5px;background:${complementHex};display:inline-block;border:1px solid rgba(255,255,255,0.2)"></span>
        ${complementHex}
      </div>
    </div>
    <div class="analysis-item">
      <div class="label">Helligkeitsdifferenz (L)</div>
      <div class="value">${Math.abs(a.hsl.l - b.hsl.l)}%</div>
    </div>
  `;

  renderHarmonies(a);
}

/* Erzeugt eine Gruppe von Farb-Swatches aus einer Liste von Farbtönen (Grad) */
function harmonySwatchGroup(title, hues, baseS, baseL) {
  const group = document.createElement("div");
  group.className = "harmony-group";
  const label = document.createElement("div");
  label.className = "harmony-title";
  label.textContent = title;
  group.appendChild(label);

  const row = document.createElement("div");
  row.className = "harmony-swatches";
  hues.forEach((h) => {
    const rgb = ColorMath.hslToRgb(h, baseS, baseL);
    const hex = ColorMath.rgbToHex(rgb.r, rgb.g, rgb.b);
    const sw = document.createElement("div");
    sw.style.background = hex;
    sw.title = hex;
    sw.addEventListener("click", () => copyToClipboard(hex));
    row.appendChild(sw);
  });
  group.appendChild(row);
  return group;
}

function renderHarmonies(base) {
  const { h, s, l } = base.hsl;
  const container = $("#harmonyGrid");
  container.innerHTML = "";

  container.appendChild(harmonySwatchGroup("Komplementär", [h, (h + 180) % 360], s, l));
  container.appendChild(harmonySwatchGroup("Analog", [(h - 30 + 360) % 360, h, (h + 30) % 360], s, l));
  container.appendChild(harmonySwatchGroup("Triade", [h, (h + 120) % 360, (h + 240) % 360], s, l));
  container.appendChild(harmonySwatchGroup("Split-Komplementär", [h, (h + 150) % 360, (h + 210) % 360], s, l));
  container.appendChild(harmonySwatchGroup("Tetrade", [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360], s, l));

  // Monochromatische Reihe (gleicher Farbton, variierende Helligkeit)
  const mono = document.createElement("div");
  mono.className = "harmony-group";
  mono.innerHTML = `<div class="harmony-title">Monochromatisch (Helligkeitsreihe)</div>`;
  const row = document.createElement("div");
  row.className = "harmony-swatches";
  [20, 35, 50, 65, 80].forEach((lVal) => {
    const rgb = ColorMath.hslToRgb(h, s, lVal);
    const hex = ColorMath.rgbToHex(rgb.r, rgb.g, rgb.b);
    const sw = document.createElement("div");
    sw.style.background = hex;
    sw.title = hex;
    sw.addEventListener("click", () => copyToClipboard(hex));
    row.appendChild(sw);
  });
  mono.appendChild(row);
  container.appendChild(mono);
}

/* ======================================================================
   9) LICHTTECHNIK-TAB
   ====================================================================== */

/* --- 9.1 RGB -> RGBW Rechner --- */
function updateRgbwCalculator() {
  const r = Number($("#ltR").value);
  const g = Number($("#ltG").value);
  const b = Number($("#ltB").value);
  $("#ltRVal").textContent = r;
  $("#ltGVal").textContent = g;
  $("#ltBVal").textContent = b;

  const hex = ColorMath.rgbToHex(r, g, b);
  $("#ltSwatchRGB").style.background = hex;

  const rgbw = ColorMath.rgbToRgbw(r, g, b);
  $("#ltOutputRGBW").innerHTML = `
    <div>HEX: <b>${hex}</b></div>
    <div>RGB: <b>${r}, ${g}, ${b}</b></div>
    <div>RGBW: <b>R ${rgbw.r} · G ${rgbw.g} · B ${rgbw.b} · W ${rgbw.w}</b></div>
    <div>DMX-Kanäle (4-Kanal-Fixture): <b>${rgbw.r} / ${rgbw.g} / ${rgbw.b} / ${rgbw.w}</b></div>
  `;
}

function initRgbwCalculator() {
  ["ltR", "ltG", "ltB"].forEach((id) => {
    $("#" + id).addEventListener("input", updateRgbwCalculator);
  });
  updateRgbwCalculator();
}

/* --- 9.2 Live-Regler (Helligkeit / Sättigung / White-Level / Dimmer) --- */
function updateLightingBaseFromColor(color) {
  App.selectedForLighting = color;
  updateLiveRegler();
}

function updateLiveRegler() {
  const base = App.selectedForLighting || App.colors[0];
  const brightness = Number($("#ctrlBrightness").value);
  const saturation = Number($("#ctrlSaturation").value);
  const whiteLevel = Number($("#ctrlWhite").value);
  const dimmer = Number($("#ctrlDimmer").value);

  $("#ctrlBrightnessVal").textContent = brightness + "%";
  $("#ctrlSaturationVal").textContent = saturation + "%";
  $("#ctrlWhiteVal").textContent = whiteLevel + "%";
  $("#ctrlDimmerVal").textContent = dimmer + "%";

  // Helligkeit & Sättigung auf Basis-HSL anwenden
  const h = base.hsl.h;
  const s = saturation; // Sättigungsregler ersetzt direkt den S-Wert
  const l = ColorMath.clamp((brightness / 100) * 50, 0, 90); // Helligkeitsregler steuert Lightness
  let rgb = ColorMath.hslToRgb(h, s, l);

  // White-Level: additive Weißmischung (simuliert W-Kanal eines RGBW-Fixtures)
  const whiteAmount = whiteLevel / 100;
  rgb = {
    r: ColorMath.clamp(rgb.r + (255 - rgb.r) * whiteAmount),
    g: ColorMath.clamp(rgb.g + (255 - rgb.g) * whiteAmount),
    b: ColorMath.clamp(rgb.b + (255 - rgb.b) * whiteAmount)
  };

  // Dimmer: globale Helligkeitsskalierung (Master-Dimmer eines Movingheads)
  const dimAmount = dimmer / 100;
  rgb = {
    r: Math.round(rgb.r * dimAmount),
    g: Math.round(rgb.g * dimAmount),
    b: Math.round(rgb.b * dimAmount)
  };

  const hex = ColorMath.rgbToHex(rgb.r, rgb.g, rgb.b);
  $("#ctrlSwatch").style.background = hex;
  const rgbw = ColorMath.rgbToRgbw(rgb.r, rgb.g, rgb.b);
  $("#ctrlOutput").innerHTML = `
    <div>Basisfarbe: <b>${base.name}</b></div>
    <div>Ergebnis HEX: <b>${hex}</b></div>
    <div>Ergebnis RGB: <b>${rgb.r}, ${rgb.g}, ${rgb.b}</b></div>
    <div>Ergebnis RGBW: <b>${rgbw.r} / ${rgbw.g} / ${rgbw.b} / ${rgbw.w}</b></div>
  `;
}

function initLiveRegler() {
  App.selectedForLighting = App.colors[0];
  ["ctrlBrightness", "ctrlSaturation", "ctrlWhite", "ctrlDimmer"].forEach((id) => {
    $("#" + id).addEventListener("input", updateLiveRegler);
  });
  updateLiveRegler();
}

/* --- 9.3 Additive Farbmischung --- */
function updateAdditiveMix() {
  const c1 = ColorMath.hexToRgb($("#mixColor1").value);
  const c2 = ColorMath.hexToRgb($("#mixColor2").value);
  const c3 = ColorMath.hexToRgb($("#mixColor3").value);

  $("#mixSwatch1").style.background = $("#mixColor1").value;
  $("#mixSwatch2").style.background = $("#mixColor2").value;
  $("#mixSwatch3").style.background = $("#mixColor3").value;

  const result = ColorMath.additiveMix([c1, c2, c3]);
  const hex = ColorMath.rgbToHex(result.r, result.g, result.b);
  $("#mixResultSwatch").style.background = hex;
  const rgbw = ColorMath.rgbToRgbw(result.r, result.g, result.b);
  $("#mixResultOutput").innerHTML = `
    <div>Summe RGB: <b>${result.r}, ${result.g}, ${result.b}</b></div>
    <div>HEX: <b>${hex}</b></div>
    <div>RGBW-Äquivalent: <b>${rgbw.r} / ${rgbw.g} / ${rgbw.b} / ${rgbw.w}</b></div>
  `;
}

function initAdditiveMix() {
  ["mixColor1", "mixColor2", "mixColor3"].forEach((id) => {
    $("#" + id).addEventListener("input", updateAdditiveMix);
  });
  updateAdditiveMix();
}

/* --- 9.4 Farbüberblendung (Crossfade) --- */
function updateFade() {
  const from = ColorMath.hexToRgb($("#fadeColorFrom").value);
  const to = ColorMath.hexToRgb($("#fadeColorTo").value);
  const pos = Number($("#fadePosition").value);
  $("#fadePositionVal").textContent = pos + "%";

  $("#fadeBar").style.background = `linear-gradient(90deg, ${$("#fadeColorFrom").value}, ${$("#fadeColorTo").value})`;

  const rgb = ColorMath.lerpRgb(from, to, pos / 100);
  const hex = ColorMath.rgbToHex(rgb.r, rgb.g, rgb.b);
  $("#fadeSwatch").style.background = hex;
}

function initFade() {
  ["fadeColorFrom", "fadeColorTo", "fadePosition"].forEach((id) => {
    $("#" + id).addEventListener("input", updateFade);
  });

  $("#btnFadePlay").addEventListener("click", () => {
    clearInterval(App.fadeAnimTimer);
    let t = 0;
    const slider = $("#fadePosition");
    App.fadeAnimTimer = setInterval(() => {
      t += 2;
      if (t > 100) {
        clearInterval(App.fadeAnimTimer);
        return;
      }
      slider.value = t;
      updateFade();
    }, 40);
  });

  updateFade();
}

function initLightingTab() {
  initRgbwCalculator();
  initLiveRegler();
  initAdditiveMix();
  initFade();
}

/* ======================================================================
   10) BÜHNENVORSCHAU-TAB
   ====================================================================== */
const StageState = {
  count: 12,
  mode: "wash", // "wash" | "beam"
  color: "#0a84ff",
  strobe: false
};

function buildMovingHead() {
  const head = document.createElement("div");
  head.className = "moving-head";

  const beam = document.createElement("div");
  beam.className = "beam";

  const wash = document.createElement("div");
  wash.className = "wash";

  const lens = document.createElement("div");
  lens.className = "lens";

  head.appendChild(beam);
  head.appendChild(wash);
  head.appendChild(lens);
  return head;
}

function renderStage() {
  const stage = $("#stage");
  stage.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (let i = 0; i < StageState.count; i++) {
    frag.appendChild(buildMovingHead());
  }
  stage.appendChild(frag);
  updateStageColors();
}

function updateStageColors() {
  const color = StageState.color;
  const rgb = ColorMath.hexToRgb(color);
  const glow = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`;
  const beamGradient = `linear-gradient(180deg, ${glow}, rgba(${rgb.r},${rgb.g},${rgb.b},0))`;

  $all(".moving-head").forEach((head) => {
    const lens = head.querySelector(".lens");
    const beam = head.querySelector(".beam");
    const wash = head.querySelector(".wash");

    lens.style.background = `radial-gradient(circle, #fff 0%, ${color} 35%, ${color} 100%)`;
    lens.style.boxShadow = `0 0 18px 4px ${glow}`;

    beam.style.display = StageState.mode === "beam" ? "block" : "none";
    beam.style.background = beamGradient;

    wash.style.display = StageState.mode === "wash" ? "block" : "none";
    wash.style.background = `radial-gradient(circle, ${glow}, transparent 70%)`;

    head.classList.toggle("strobe", StageState.strobe);
  });
}

function initStageTab() {
  $("#movingHeadCount").addEventListener("change", (e) => {
    StageState.count = Number(e.target.value);
    renderStage();
  });

  $all(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $all(".toggle-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      StageState.mode = btn.dataset.mode;
      updateStageColors();
    });
  });

  $("#stageColor").addEventListener("input", (e) => {
    StageState.color = e.target.value;
    updateStageColors();
  });

  $("#stageStrobe").addEventListener("change", (e) => {
    StageState.strobe = e.target.checked;
    updateStageColors();
  });

  renderStage();
}

/* ======================================================================
   11) FAVORITEN- UND PRESET-TAB
   ====================================================================== */
function renderFavorites() {
  const grid = $("#favoritesGrid");
  grid.innerHTML = "";
  const hint = $("#favEmptyHint");
  if (App.favorites.length === 0) {
    hint.style.display = "block";
    return;
  }
  hint.style.display = "none";
  const frag = document.createDocumentFragment();
  App.favorites.forEach((c) => frag.appendChild(buildColorCard(c)));
  grid.appendChild(frag);
}

function renderPresets() {
  const list = $("#presetList");
  list.innerHTML = "";
  if (App.presets.length === 0) {
    list.innerHTML = `<p class="empty-hint">Noch keine Presets erstellt.</p>`;
    return;
  }
  App.presets.forEach((preset, idx) => {
    const item = document.createElement("div");
    item.className = "preset-item";
    const swatchesHtml = preset.colors
      .map((c) => `<span style="background:${c.hex}" title="${c.name}"></span>`)
      .join("");
    item.innerHTML = `
      <div class="preset-head">
        <h3>${preset.name}</h3>
        <div class="preset-actions">
          <button class="btn-secondary" data-action="apply" data-idx="${idx}">Auf Bühne anwenden</button>
          <button class="btn-danger" data-action="delete" data-idx="${idx}">Löschen</button>
        </div>
      </div>
      <div class="preset-swatches">${swatchesHtml}</div>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const name = App.presets[idx].name;
      App.presets.splice(idx, 1);
      persist("presets");
      renderPresets();
      showToast(`Preset „${name}“ gelöscht`);
    });
  });

  list.querySelectorAll('[data-action="apply"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const preset = App.presets[idx];
      if (preset.colors.length > 0) {
        StageState.color = preset.colors[0].hex;
        $("#stageColor").value = preset.colors[0].hex;
        updateStageColors();
        $all(".tab-btn").forEach((b) => b.classList.remove("active"));
        $all(".tab-panel").forEach((p) => p.classList.remove("active"));
        $('.tab-btn[data-tab="buehne"]').classList.add("active");
        $("#tab-buehne").classList.add("active");
        showToast(`Preset „${preset.name}“ auf Bühne angewendet`);
      }
    });
  });
}

function initFavoritesTab() {
  renderFavorites();
  renderPresets();

  $("#btnCreatePreset").addEventListener("click", () => {
    const name = $("#presetName").value.trim();
    if (!name) {
      showToast("Bitte einen Preset-Namen eingeben");
      return;
    }
    if (App.favorites.length === 0) {
      showToast("Keine Favoriten zum Speichern vorhanden");
      return;
    }
    App.presets.push({ name, colors: App.favorites.slice() });
    persist("presets");
    $("#presetName").value = "";
    renderPresets();
    showToast(`Preset „${name}“ erstellt`);
  });

  $("#btnClearFav").addEventListener("click", () => {
    if (App.favorites.length === 0) return;
    App.favorites = [];
    persist("favorites");
    renderFavorites();
    renderColorGrid();
    showToast("Alle Favoriten gelöscht");
  });

  $("#btnExportFav").addEventListener("click", () => {
    const payload = {
      exportiertAm: new Date().toISOString(),
      favoriten: App.favorites,
      presets: App.presets
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lichtfarben-favoriten-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Favoriten exportiert");
  });

  $("#importFavFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data.favoriten)) {
          data.favoriten.forEach((c) => {
            if (!App.favorites.some((f) => f.id === c.id && f.hex === c.hex)) {
              App.favorites.push(c);
            }
          });
        }
        if (Array.isArray(data.presets)) {
          data.presets.forEach((p) => App.presets.push(p));
        }
        persist("favorites");
        persist("presets");
        renderFavorites();
        renderPresets();
        renderColorGrid();
        showToast("Import erfolgreich");
      } catch (err) {
        showToast("Import fehlgeschlagen: ungültige Datei");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  });
}

/* ======================================================================
   12) EXTRAS-TAB
   ====================================================================== */

/* --- 12.1 Farbkreis (Canvas) --- */
function drawColorWheel() {
  const canvas = $("#colorWheel");
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const radius = size / 2;
  const center = radius;

  const imageData = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * size + x) * 4;
      if (dist <= radius) {
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = (angle + 360) % 360;
        const sat = Math.min(100, (dist / radius) * 100);
        const rgb = ColorMath.hslToRgb(angle, sat, 50);
        imageData.data[idx] = rgb.r;
        imageData.data[idx + 1] = rgb.g;
        imageData.data[idx + 2] = rgb.b;
        imageData.data[idx + 3] = 255;
      } else {
        imageData.data[idx + 3] = 0;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function pickFromWheel(clientX, clientY) {
  const canvas = $("#colorWheel");
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  const ctx = canvas.getContext("2d");
  const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
  if (pixel[3] === 0) return; // außerhalb des Kreises

  const hex = ColorMath.rgbToHex(pixel[0], pixel[1], pixel[2]);
  $("#wheelSwatch").style.background = hex;
  const hsl = ColorMath.rgbToHsl(pixel[0], pixel[1], pixel[2]);
  const cmyk = ColorMath.rgbToCmyk(pixel[0], pixel[1], pixel[2]);
  $("#wheelOutput").innerHTML = `
    <div>HEX: <b>${hex}</b></div>
    <div>RGB: <b>${pixel[0]}, ${pixel[1]}, ${pixel[2]}</b></div>
    <div>HSL: <b>${hsl.h}°, ${hsl.s}%, ${hsl.l}%</b></div>
    <div>CMYK: <b>${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}</b></div>
  `;
}

function initColorWheel() {
  drawColorWheel();
  const canvas = $("#colorWheel");
  let dragging = false;

  const start = (e) => { dragging = true; handleMove(e); };
  const move = (e) => { if (dragging) handleMove(e); };
  const end = () => { dragging = false; };

  function handleMove(e) {
    const point = e.touches ? e.touches[0] : e;
    pickFromWheel(point.clientX, point.clientY);
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: true });
  canvas.addEventListener("touchmove", move, { passive: true });
  window.addEventListener("touchend", end);

  // Startfarbe mittig anzeigen
  pickFromWheel(
    canvas.getBoundingClientRect().left + canvas.getBoundingClientRect().width * 0.75,
    canvas.getBoundingClientRect().top + canvas.getBoundingClientRect().height * 0.5
  );
}

/* --- 12.2 RGB- & HEX-Picker --- */
function updatePickerFromRgb() {
  const r = Number($("#pickR").value);
  const g = Number($("#pickG").value);
  const b = Number($("#pickB").value);
  const hex = ColorMath.rgbToHex(r, g, b);
  $("#pickHex").value = hex;
  $("#pickNative").value = hex;
  renderPickerOutput(r, g, b, hex);
}

function updatePickerFromHex(hexValue) {
  if (!/^#?[0-9A-Fa-f]{6}$/.test(hexValue)) return;
  const hex = hexValue.startsWith("#") ? hexValue : "#" + hexValue;
  const rgb = ColorMath.hexToRgb(hex);
  $("#pickR").value = rgb.r;
  $("#pickG").value = rgb.g;
  $("#pickB").value = rgb.b;
  $("#pickNative").value = hex.toUpperCase();
  renderPickerOutput(rgb.r, rgb.g, rgb.b, hex.toUpperCase());
}

function renderPickerOutput(r, g, b, hex) {
  $("#pickSwatch").style.background = hex;
  const hsl = ColorMath.rgbToHsl(r, g, b);
  const cmyk = ColorMath.rgbToCmyk(r, g, b);
  const rgbw = ColorMath.rgbToRgbw(r, g, b);
  $("#pickOutput").innerHTML = `
    <div>HEX: <b>${hex}</b></div>
    <div>RGB: <b>${r}, ${g}, ${b}</b></div>
    <div>HSL: <b>${hsl.h}°, ${hsl.s}%, ${hsl.l}%</b></div>
    <div>CMYK: <b>${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}</b></div>
    <div>RGBW: <b>${rgbw.r} / ${rgbw.g} / ${rgbw.b} / ${rgbw.w}</b></div>
  `;
}

function initPicker() {
  ["pickR", "pickG", "pickB"].forEach((id) => {
    $("#" + id).addEventListener("input", updatePickerFromRgb);
  });
  $("#pickHex").addEventListener("input", (e) => updatePickerFromHex(e.target.value));
  $("#pickNative").addEventListener("input", (e) => updatePickerFromHex(e.target.value));
  $("#btnCopyPick").addEventListener("click", () => copyToClipboard($("#pickHex").value));
  updatePickerFromRgb();
}

/* --- 12.3 Verlaufsgenerator --- */
function generateGradient() {
  const from = ColorMath.hexToRgb($("#gradFrom").value);
  const to = ColorMath.hexToRgb($("#gradTo").value);
  const steps = Math.max(2, Math.min(20, Number($("#gradSteps").value) || 8));
  const output = $("#gradientOutput");
  output.innerHTML = "";
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const rgb = ColorMath.lerpRgb(from, to, t);
    const hex = ColorMath.rgbToHex(rgb.r, rgb.g, rgb.b);
    const div = document.createElement("div");
    div.style.background = hex;
    div.title = hex;
    div.addEventListener("click", () => copyToClipboard(hex));
    output.appendChild(div);
  }
}

function initGradientGenerator() {
  $("#btnGenGradient").addEventListener("click", generateGradient);
  ["gradFrom", "gradTo", "gradSteps"].forEach((id) => {
    $("#" + id).addEventListener("input", generateGradient);
  });
  generateGradient();
}

/* --- 12.4 Zufällige Farbkombination --- */
function generateRandomCombo() {
  const baseHue = Math.floor(Math.random() * 360);
  const scheme = Math.floor(Math.random() * 4);
  let hues;
  let label;
  switch (scheme) {
    case 0:
      hues = [baseHue, (baseHue + 180) % 360];
      label = "Komplementär-Schema";
      break;
    case 1:
      hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
      label = "Triaden-Schema";
      break;
    case 2:
      hues = [(baseHue - 30 + 360) % 360, baseHue, (baseHue + 30) % 360];
      label = "Analog-Schema";
      break;
    default:
      hues = [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
      label = "Tetraden-Schema";
  }
  const sat = 55 + Math.floor(Math.random() * 40);
  const light = 40 + Math.floor(Math.random() * 25);

  const output = $("#randomOutput");
  output.innerHTML = `<p class="hint" style="width:100%">${label} — Basis-Farbton ${baseHue}°</p>`;
  hues.forEach((h) => {
    const rgb = ColorMath.hslToRgb(h, sat, light);
    const hex = ColorMath.rgbToHex(rgb.r, rgb.g, rgb.b);
    const div = document.createElement("div");
    div.style.background = hex;
    div.title = hex;
    div.addEventListener("click", () => copyToClipboard(hex));
    output.appendChild(div);
  });
}

function initRandomCombo() {
  $("#btnRandomCombo").addEventListener("click", generateRandomCombo);
  generateRandomCombo();
}

function initExtrasTab() {
  initColorWheel();
  initPicker();
  initGradientGenerator();
  initRandomCombo();
  renderHistory();
}

/* ======================================================================
   13) APP-INITIALISIERUNG
   ====================================================================== */
async function initApp() {
  loadLocalStorage();
  await loadColorDatabase();

  populateCategoryFilter();
  renderColorGrid();

  initTabs();
  initSearch();
  initCompareTab();
  initLightingTab();
  initStageTab();
  initFavoritesTab();
  initExtrasTab();

  // Anfangszustand: erste Farbe der Datenbank als Basis für Lichttechnik-Tab
  if (App.colors.length > 0) {
    App.selectedForLighting = App.colors[0];
  }
}

document.addEventListener("DOMContentLoaded", initApp);
