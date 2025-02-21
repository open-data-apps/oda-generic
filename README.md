# ODAS App Generic

Generic-App für den Open Data App-Store (ODAP)

Die App Generic bietet eine generische Vorschau einer ODAS App.

Die App ist eine "ODAP App V1".

## Funktionen

## Entwicklung

## Beispiel App Prompt

Prompt:

agiere als softwareentwickler für eine web-app.

die technischen rahmenbedingungen der app sind folgende;

- die web-app besteht aus einem header, einem footer und einem inhaltsbereich.
  header und footer stehen bereits fest. es muss nur der inhaltsbereich erstellt werden.
- in dem kommentar des codes-template stehen die übergabeparameter.
- Mit der app() Funktion soll der Content für die Seite generiert werden. Die übergebene
  Variable configdata enthählt die apiUrl. Diese enthält einen Link
  zu einem Datensatz oder einer Datei aus einem Open Data Portal. Falls benötigt
  soll die App von dort die Daten beziehen.
- die app() funktion muss in Javascript geschrieben werden.
- Der generierte Content soll ausschließlich in das enclosingHtmlDivElement geladen werden.
- Mit der Funktion addToHead können Skripte oder Stylesheets per Html Code in den Head
  der index.html geladen werden.
- Alles innerhalb der beiden Funktionen ist nur BeispielCode und soll ersetzt werden.

die app soll folendes tun:

- anzeige eines Ping Pong Spiels
- der Spieler (rechts) soll mit den Pfeiltasten auf und ab fahren
- der Spieler (links) ist der Computer
- das Spiel soll über die Ganze breite gehen

aufgabe:
Erstelle die app. fülle dazu die funktion app() {} und ggf. addToHead() {}

hier ist der code-template:

/\*

- Diese Funktion ist für die Inhalte der Startseite
- zuständig.
-
- Der umschließebde HTML code ist:
-      <body>
-      <div class="container mt-4" id="main-content">
-          ...
-      </div>
-      </body>
- Als CSS Framnework wird Bootstrap 5.3 verwendet.
-
- ConfigData ist ein JSON enthält die Referenz
- auf die Daten im CKAN Open Data Portal:
-     {
-         "apiUrl": "https://open-data-musterstadt.ckan.de/dataset/db92da8e40f9/download/formular_multitemplate.json"
-     }
-
- @param {Object} configdata - Alle Konfigurationsdaten der App
- @enclosingHtmlDivElement - HTML Knoten des umschließenden Tags
- @returns {string | NULL} - darzustellendes HTML oder NULL wenn HTML Knoten direkt manipuliert wurde
  \*/

function app(configdata = [], enclosingHtmlDivElement) {
// hier muss der app-code stehen
}

/\*

- Diese Funktion kann Bibliotheken und benötigte Skripte laden.
- Sie hängt den zurückgegebenen HTML Code in die Head Section an.

- @returns {string} - HTML mit script, link, etc. Tags
  \*/
  function addToHead() {
  return ``;
  }

### Aufbau der App

#### Desktop Version

![Alt-Text](/assets/Desktop_Screenshot.png)

#### Mobile Version

![Alt-Text](/assets/Mobile_Screenshot.png)

### Start der App

    $ make build up
    $ curl http://localhost:8089

## Autor

(C) 2025, Ondics GmbH
