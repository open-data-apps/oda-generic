/*
 * Diese Funktion ist für die Inhalte der Startseite
 * zuständig.
 *
 * Der umschließebde HTML code ist:
 *      <body>
 *      <div class="container mt-4" id="main-content">
 *          ...
 *      </div>
 *      </body>
 * Als CSS Framnework wird Bootstrap 5.3 verwendet.
 *
 * ConfigData ist ein JSON enthält die Referenz
 * auf die Daten im CKAN Open Data Portal:
 *     {
 *         "apiUrl": "https://open-data-musterstadt.ckan.de/dataset/db92da8e40f9/download/formular_multitemplate.json"
 *     }
 *
 * @param {Object} configdata - Alle Konfigurationsdaten der App
 * @enclosingHtmlDivElement - HTML Knoten des umschließenden Tags
 * @returns {string | NULL} - darzustellendes HTML oder NULL wenn HTML Knoten direkt manipuliert wurde
 *
 * Ein Beispiel Prompt zu KI Generierung ist unter assets/App-Prompt.txt
 */

function app(configdata = [], enclosingHtmlDivElement) {
  const prettyJson = JSON.stringify(configdata, null, 2);
  enclosingHtmlDivElement.innerHTML =
    "<h2>Konfiguration config.json:</h2><div>" +
    `<pre><code>${prettyJson}</code></pre>` +
    "</div>";
}

/* 
 * Diese Funktion kann Bibliotheken und benötigte Skripte laden. 
 * Sie hängt den zurückgegebenen HTML Code in die Head Section an. 

 * @returns {string} - HTML mit script, link, etc. Tags
 */
function addToHead() {
  return ``;
}
