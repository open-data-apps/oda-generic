
let configData = {};
let loadedData = null;
let currentPage = 1;
let formDataStorage = {};

document.addEventListener("DOMContentLoaded", () => {
  const currentURL = new URL(window.location.href);
  const formParam = currentURL.searchParams.get("form");
  const url = window.location.href;
  let configUrl;

  if (
    url === "http://127.0.0.1:5500/app/" ||
    url === "http://localhost:8089/" ||
    url === "http://127.0.0.1:5500/app/?form=" + formParam ||
    url === "http://localhost:8089/?form=" + formParam ||
    url === "http://10.0.0.142:8089/"
  ) {
    configUrl = "../odas-config/config.json";
  } else {
    configUrl = window.location.href + "config";
  }
  fetch(configUrl)
    .then((response) => response.json())
    .then((data) => {
      configData = data;
      document.getElementById("title-text").textContent =
        configData.titel || "";
      document.getElementById("tab-title").textContent =
        configData.seitentitel || "";
      document.getElementById("logo-icon").src = configData.icon || "logo.png";
      document.getElementById("footer-text").textContent =
        configData.fusszeile ||
        "&copy; 2025 ODAS Karten App. Alle Rechte vorbehalten.";
      loadPage("startseite");
    })
    .catch((err) => console.error("Fehler beim Laden der Konfiguration:", err));
});

async function loadPage(page) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "";

  if (page === "startseite") {
    mainContent.innerHTML = app();
  } else if (page === "kontakt") {
    mainContent.innerHTML = `<div class="col" id="secondarySites"><h2>Kontakt</h2><p>${
      configData.kontakt || "Kontaktinformationen nicht verfügbar."
    }</p></div>`;
  } else if (page === "impressum") {
    mainContent.innerHTML = `<div class="col" id="secondarySites"><h2>Impressum</h2><p>${
      configData.impressum || "Impressumsinformationen nicht verfügbar."
    }</p></div>`;
  } else if (page === "datenschutz") {
    mainContent.innerHTML = `<div class="col" id="secondarySites"><h2>Datenschutz</h2><p>${
      configData.datenschutz || "Datenschutzhinweise nicht verfügbar."
    }</p></div>`;
  } else if (page === "beschreibung") {
    mainContent.innerHTML = `<div class="col" id="secondarySites"><h2>Über diese App</h2><p>${
      configData.beschreibung || "Beschreibung nicht verfügbar."
    }</p></div>`;
  }
}

// Burger Menu schließ Funktion
document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const offcanvasNavbar = document.getElementById("offcanvasNavbar");
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasNavbar);

    // Wenn das Offcanvas Menü geöffnet ist, schließe es
    if (offcanvas && offcanvasNavbar.classList.contains("show")) {
      offcanvas.hide();
    }
  });
});
