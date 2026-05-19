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
 *         "apiurl": "https://open-data-musterstadt.ckan.de/dataset/db92da8e40f9/download/formular_multitemplate.json"
 *     }
 *
 * @param {Object} configdata - Alle Konfigurationsdaten der App
 * @enclosingHtmlDivElement - HTML Knoten des umschließenden Tags
 * @returns {string | NULL} - darzustellendes HTML oder NULL wenn HTML Knoten direkt manipuliert wurde
 *
 * Ein Beispiel Prompt zu KI Generierung ist unter assets/App-Prompt.txt
 */

function app(configdata = {}, enclosingHtmlDivElement) {
  const prettyJson = JSON.stringify(configdata, null, 2);
  const proxyEnabled = isOdasProxyEnabled(configdata);
  const proxyStatus = proxyEnabled ? "aktiviert" : "deaktiviert";

  enclosingHtmlDivElement.innerHTML = `
    <section class="mb-4">
      <h2>Konfiguration config.json:</h2>
      <p><strong>Proxy-Status:</strong> ${proxyStatus}</p>
      <pre><code>${escapeHtml(prettyJson)}</code></pre>
    </section>
  `;
}

function isOdasProxyEnabled(configdata = {}) {
  return String(configdata.proxyAktiv || "").trim().toLowerCase() === "ja";
}

function extractPathFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search;
  } catch (e) {
    return url;
  }
}

function getOdasProxyEndpoint(targetUrl) {
  const fullPath = window.location.pathname.replace(/\/+$/, "");
  const apiPath = extractPathFromUrl(targetUrl);
  return `${fullPath}/odp-data?path=${encodeURIComponent(apiPath)}`;
}

async function fetchViaOdasProxy(targetUrl) {
  const response = await fetch(getOdasProxyEndpoint(targetUrl), {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Proxy-Fehler: HTTP ${response.status}`);
  }

  const proxyData = await response.json();
  if (!proxyData || typeof proxyData.content !== "string") {
    throw new Error("Proxy-Antwort enthaelt keinen content-String");
  }

  return proxyData.content;
}

async function fetchOdasResource(targetUrl, configdata = {}) {
  if (isOdasProxyEnabled(configdata)) {
    return fetchViaOdasProxy(targetUrl);
  }

  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`HTTP-Fehler: ${response.status}`);
  }

  return response.text();
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/*
 * Diese Funktion kann Bibliotheken und benötigte Skripte laden.
 */
function addToHead() {}
