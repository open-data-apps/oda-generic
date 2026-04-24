# ODAS App Generic

Generic-App für den Open Data App-Store (ODAP)

Die App Generic bietet eine generische Vorschau einer ODAS App.

Die App ist eine "ODAP App V1".

##Systemvorraussetzungen

- Docker/Docker compose
- Make

Die Entwicklung wurde getestet unter Windows und Ubuntu

## Funktionen

Die APP ist eine Single Page Application Webapp. Mit:

- Logo Anzeige
- Menü
- Seiten für Impressum, Datenschutz, Beschreibung, Kontakt, Hauptinhalt
- Inhaltsbereich
- Fußzeile

Die Konfiguration wird vom ODAS geladen.

Die APP zeigt Ihre Konfiguration im JSON Format an.

## Entwicklung

    $ make build up

Die App wird dadurch gestartet und steht auf Port 8089 zur Verfügung:

http://localhost:8089

Weil die App mit localhost gestartet wird wird die Konfiguration lokal geladen.

Was bei der App Entwicklung beachtet werden sollte steht in der [ODA Spezifikation](https://open-data-apps.github.io/open-data-app-docs/)

Nicht vergessen: Bevor die App in den ODAS eingereicht wird muss die `app-package.json` noch angepasst werden.

### Aufbau der App

Inhaltsbereich wird in app.js erstellt. Ihr kann der eigene Code implementiert werden.

#### Desktop Version

![Alt-Text](/assets/Desktop_Screenshot.png)

#### Mobile Version

![Alt-Text](/assets/Mobile_Screenshot.png)

## Autor

(C) 2025, Ondics GmbH
