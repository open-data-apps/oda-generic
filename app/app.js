/*
 * Diese Funktion ist für die Inhalte der Startseite
 * zuständig.
 *
 * @param {Object} configdata - Alle Konfigurationsdaten der App
 * @returns {string} - darzustellendes HTML
 */

function app(configdata= []) {
    const prettyJson = JSON.stringify(configdata, null, 2);
    return '<h2>Konfiguration config.json:</h2><div>'+
        `<pre><code>${prettyJson}</code></pre>`+
        "</div>";
}