# Changelog

## 1.1.0 - 2026-07-10

- ENH: Hash-basiertes Routing mit teilbaren Unterseiten und Browser-Navigation ergänzt
- ENH: ODAS-Proxy-Muster mit explizitem `proxyAktiv`-Schalter und robustem App-Basispfad ergänzt
- ENH: asynchrone `app()`-Implementierungen werden vom Base-Router unterstützt
- ENH: Bootstrap CSS und Bundle einheitlich auf 5.3.8 aktualisiert
- ENH: barriereärmeres, valides HTML-Grundgerüst mit Startseiten-Link am Portal-Logo eingeführt
- ENH: gültiges Frictionless-Beispielschema und normgerechtes ODAS-Icon ergänzt
- FIX: Konfigurations-URL funktioniert mit Verzeichnis-URL, fehlendem Slash und `index.html`
- FIX: `_multiline_`-Werte werden ohne Marker und mit erhaltenen Zeilenumbrüchen dargestellt
- FIX: Laufzeitfehler werden sichtbar und HTML-maskiert im Inhaltsbereich ausgegeben
- FIX: Paketmetadaten, lokale Konfiguration und Rich-Text-Inhalte auf ODAS-v1-Konventionen vereinheitlicht
- DOC: README als aktuelle Anleitung für Architektur, Konfiguration, Proxy, lokale Tests und Auslieferung überarbeitet

## ToDo

- Config über Nginx laden

## 19.05.2026

- ENH: ODAS-Proxy-Hilfsfunktionen in `app/app.js` ergänzt
- ENH: v1-konformes Instanz-Config-Feld `proxyAktiv` zum Aktivieren des ODAS-Proxys ergänzt
- FIX: `fusszeile.format.typ` auf v1-kompatibles `string` korrigiert
- DOC: Hinweis ergänzt, dass echte Proxy-Aufrufe nur im ODAS-Live-System funktionieren

## 21.02.2025

- ENH: app-package mit Multiline Strings
- ENH: Feldtypen von HTML auf Markdown umgestellt

## 17.02.2025

- FIX: Loadpage Funktion optimiert

## 12.2.2025 (Version 1.0.0)

- ENH: Anzeige config.json
- ENH: Config-File mit Multiline-String (als Array)
- FIX: Code-Teilung in app-base und app
- FIX: Docker korrigiert, läuft wieder
