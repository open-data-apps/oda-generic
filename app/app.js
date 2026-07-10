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
  if (!enclosingHtmlDivElement) {
    throw new Error("Der Inhaltsbereich der App wurde nicht gefunden.");
  }

  const prettyJson = JSON.stringify(configdata, null, 2);
  const proxyEnabled = isOdasProxyEnabled(configdata);
  const proxyStatus = proxyEnabled ? "aktiviert" : "deaktiviert";

  enclosingHtmlDivElement.innerHTML = `
    <section class="mb-4">
      <h2>Geladene Instanz-Konfiguration</h2>
      <p>Diese technische Vorschau zeigt den aktuell wirksamen Konfigurationsstand der App.</p>
      <p><strong>Proxy-Status:</strong> ${proxyStatus}</p>
      <pre class="generic-config-preview"><code>${escapeHtml(prettyJson)}</code></pre>
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
    return String(url || "");
  }
}

function getOdasAppBasePath(pathname = window.location.pathname) {
  let appPath = String(pathname || "/");

  if (!appPath.endsWith("/")) {
    const lastSlashIndex = appPath.lastIndexOf("/");
    const lastSegment = appPath.substring(lastSlashIndex + 1);
    if (lastSegment.includes(".")) {
      appPath = appPath.substring(0, lastSlashIndex + 1);
    }
  }

  return appPath.replace(/\/+$/, "");
}

function getOdasProxyEndpoint(targetUrl) {
  const appPath = getOdasAppBasePath();
  const apiPath = extractPathFromUrl(targetUrl);
  return `${appPath}/odp-data?path=${encodeURIComponent(apiPath)}`;
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
