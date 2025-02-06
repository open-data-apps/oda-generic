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
    url === "http://127.0.0.1:5500/app/?form=" + formParam
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
      loadPage("startseite", formParam);
    })
    .catch((err) => console.error("Fehler beim Laden der Konfiguration:", err));
});

async function loadPage(page, formParam = null) {
  await LoadJSONData();
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "";

  if (page === "startseite") {
    document.body.classList.remove("register-page");

    if (!loadedData || !loadedData.forms) {
      console.error("Keine Daten verfügbar");
      mainContent.innerHTML = `<p>Fehler beim Laden der Formulare.</p>`;
      return;
    }
    mainContent.innerHTML = `
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12" id="secondarySites">
        <h1 id="title-text-2" class="text-center">Formularauswahl</h1>
        <div id="formListContainer" class="mt-4">
          <!-- Dynamische Liste oder Formularauswahl -->
        </div>
        <div id="dynamicFormContainer" class="mt-4">
          <!-- Dynamische Inhalte des Formulars -->
        </div>
      </div>
    </div>
  </div>
`;

    const formListContainer = document.getElementById("formListContainer");
    // Prüfen, ob ein Formular über die URL geladen werden soll
    if (formParam) {
      const selectedForm = loadedData.forms.find(
        (form) => form.id === formParam
      );
      if (selectedForm) {
        loadDynamicForm(selectedForm);
        return; // Verhindert, dass die Liste der Formulare noch gerendert wird
      }
    }
    // Wenn nur ein Formular vorhanden ist, wird es direkt geladen
    if (loadedData.forms.length === 1) {
      loadDynamicForm(loadedData.forms[0]);
    } else {
      const formList = document.createElement("ul");
      formList.className = "list-group";

      loadedData.forms.forEach((form) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item list-group-item-action";
        listItem.innerHTML = `
    <div class="form-item">
      <h5 class="form-label text-center">${form.label}</h5>
      <p class="form-description text-center">${form.description}</p>
    </div>`;

        listItem.addEventListener("click", () => loadDynamicForm(form));
        formList.appendChild(listItem);
      });

      formListContainer.appendChild(formList);
    }

    // Dynamisches Formular laden
    function loadDynamicForm(form) {
      document.getElementById("title-text-2").textContent = form.label;
      const formContainer = document.getElementById("dynamicFormContainer");
      const formListContainer = document.getElementById("formListContainer");
      formListContainer.style.display = "none";

      let currentPage = 1;

      // Funktion zum Rendern der aktuellen Seite
      function renderPage(page) {
        formContainer.innerHTML = "";
        const pageData = form.pages.find((p) => p.page === page);

        if (!pageData) return;

        // Beschreibung oberhalb des Formulars
        let descriptionHTML = `
    <div class="row">
      <div class="col-sm-12 text-center">
        <p class="form-label-style">${pageData.description}</p>
      </div>
    </div>
  `;

        let formHTML = `<form id="${form.id}" class="form-horizontal">`;

        switch (pageData.type) {
          case "textformular":
            pageData.fields.forEach((field) => {
              formHTML += generateFieldHTML(field);
            });
            break;

          case "bestaetigungsformular":
            if (pageData.summary === "ja") {
              const formData = collectFormData(form);
              formHTML += `
          <div class="summary-container mt-4">
            <ul class="list-group">
              ${Object.entries(formData)
                .map(
                  ([label, value]) => `
                  <li class="list-group-item">
                    <strong>${label}:</strong> ${value}
                  </li>`
                )
                .join("")}
            </ul>
          </div>
        `;
            }

            // Einverständniserklärung
            formHTML += `
            <div class="form-group">
            <div class="form-check">
            <input type="checkbox" class="form-check-input" id="consentCheckbox" required>
            <label class="form-check-label" for="consentCheckbox">${pageData.consentForm}</label>
            </div>
            </div>
          `;

            // E-Mail-Kopie Checkbox, falls "ja"
            if (pageData.emailcopy === "ja") {
              formHTML += `
          <div class="form-group">
          <div class="form-check">
          <input type="checkbox" class="form-check-input" id="emailCopyCheckbox">
          <label class="form-check-label" for="emailCopyCheckbox">Ich möchte eine Kopie per E-Mail erhalten</label>
          </div>
           <!-- Eingabefeld für die E-Mail-Adresse -->
          <div id="emailInputContainer" style="margin-top: 10px;">
          <label for="emailAddress" class="form-label">E-Mail-Adresse</label>
          <input type="email" class="form-control" id="emailAddress" name="emailAddress" placeholder="Ihre E-Mail-Adresse" required>
          </div>
          </div>
        `;
            }
            break;

          default:
            console.warn(`Unbekannter Seitentyp: ${pageData.type}`);
            break;
        }

        // Fußzeile des Formulars, Navigation
        formHTML += `
    <div class="form-group row">
      <div class="col-sm-4 text-left">
        <button type="button" id="backToFormsButton" class="btn btn-secondary btn-sm">abbrechen</button>
      </div>
      <div class="col-sm-4 text-center">
        ${
          page > 1
            ? `<button type="button" id="prevButton" class="btn btn-primary">zurück</button>`
            : ""
        }
      </div>
      <div class="col-sm-4 text-right">
        ${
          page < getMaxPage(form.pages)
            ? `<button type="button" id="nextButton" class="btn btn-primary btn-lg">weiter</button>`
            : `<button type="submit" id="submitButton" class="btn btn-primary btn-lg">Absenden</button>`
        }
      </div>
    </div>
  </form>`;

        formContainer.innerHTML = descriptionHTML + formHTML;

        // Event Listener für Buttons
        if (page > 1) {
          document
            .getElementById("prevButton")
            .addEventListener("click", () => {
              saveCurrentPageData(currentPage, form);
              currentPage--;
              renderPage(currentPage);
            });
        }

        if (page < getMaxPage(form.pages)) {
          document
            .getElementById("nextButton")
            .addEventListener("click", () => {
              if (validatePage(currentPage, form)) {
                saveCurrentPageData(currentPage, form);
                currentPage++;
                renderPage(currentPage);
              }
            });
        } else {
          document
            .getElementById("submitButton")
            .addEventListener("click", (e) => {
              e.preventDefault();
              if (validatePage(currentPage, form)) {
                loadPage("confirmation");
              }
            });
        }

        // Zurück zur Formularauswahl
        document
          .getElementById("backToFormsButton")
          .addEventListener("click", () => {
            formContainer.innerHTML = "";
            formListContainer.style.display = "block";
            document.getElementById("title-text-2").textContent =
              "Formularauswahl";
          });
      }

      renderPage(currentPage);
      loadPageDataIntoFields(currentPage, form);
    }

    // Funktion zur Ermittlung der maximalen Seitenanzahl
    function getMaxPage(pages) {
      return Math.max(...pages.map((p) => p.page));
    }

    function validatePage(page, form) {
      const pageData = form.pages.find((p) => p.page === page);
      const fieldsForPage = pageData ? pageData.fields : [];
      let valid = true;

      // Validierung für Formularfelder
      fieldsForPage.forEach((field) => {
        const fieldElement = document.getElementById(field.id);
        const errorElement = document.getElementById(`${field.id}-error`);

        if (field.required && fieldElement && !fieldElement.value.trim()) {
          fieldElement.classList.add("is-invalid");
          if (!errorElement) {
            const errorMsg = document.createElement("div");
            errorMsg.id = `${field.id}-error`;
            errorMsg.className = "invalid-feedback";
            errorMsg.textContent = "Dieses Feld ist erforderlich.";
            fieldElement.parentNode.appendChild(errorMsg);
          }
          valid = false;
        } else {
          fieldElement.classList.remove("is-invalid");
          if (errorElement) {
            errorElement.remove();
          }
        }
      });

      // Speziell für die "bestaetigungsformular"-Seite: Überprüfung der Checkboxen
      if (pageData.type === "bestaetigungsformular") {
        const consentCheckbox = document.getElementById("consentCheckbox");
        const emailCopyCheckbox = document.getElementById("emailCopyCheckbox");
        const emailAddressField = document.getElementById("emailAddress");

        // Überprüfung der Einverständniserklärung
        if (!consentCheckbox.checked) {
          let errorElement = document.getElementById("consentCheckbox-error");
          if (!errorElement) {
            errorElement = document.createElement("div");
            errorElement.id = "consentCheckbox-error";
            errorElement.className = "invalid-feedback";
            errorElement.textContent =
              "Sie müssen einwilligen, um fortzufahren.";
            consentCheckbox.parentNode.appendChild(errorElement);
          }
          consentCheckbox.classList.add("is-invalid");
          consentCheckbox.focus();
          valid = false;
        } else {
          const errorElement = document.getElementById("consentCheckbox-error");
          if (errorElement) {
            errorElement.remove();
          }
          consentCheckbox.classList.remove("is-invalid");
        }

        // Überprüfung, ob die E-Mail-Adresse angegeben wurde, wenn die Checkbox aktiviert ist
        if (
          emailCopyCheckbox.checked &&
          (!emailAddressField.value || !emailAddressField.value.trim())
        ) {
          let errorElement = document.getElementById("emailAddress-error");
          if (!errorElement) {
            errorElement = document.createElement("div");
            errorElement.id = "emailAddress-error";
            errorElement.className = "invalid-feedback";
            errorElement.textContent =
              "Bitte geben Sie Ihre E-Mail-Adresse ein.";
            emailAddressField.parentNode.appendChild(errorElement);
          }
          emailAddressField.classList.add("is-invalid");
          emailAddressField.focus();
          valid = false;
        } else {
          const errorElement = document.getElementById("emailAddress-error");
          if (errorElement) {
            errorElement.remove();
          }
          emailAddressField.classList.remove("is-invalid");
        }
      }

      return valid;
    }

    function collectFormData(form) {
      const data = {};

      if (!formDataStorage[form.id]) return data;

      Object.entries(formDataStorage[form.id]).forEach(([page, fields]) => {
        Object.entries(fields).forEach(([fieldId, value]) => {
          const field = form.pages
            .flatMap((p) => p.fields)
            .find((f) => f.id === fieldId);

          if (field) {
            data[field.label] = value !== "" ? value : "Keine Eingabe";
          }
        });
      });

      return data;
    }

    // HTML für Felder generieren
    function generateFieldHTML(field) {
      return `
    <div class="form-group row">
      <label for="${field.id}" class="col-sm-2 col-form-label">${
        field.label
      }:</label>
      <div class="col-sm-10">
        <input type="${field.type}" id="${field.id}" name="${
        field.name
      }" class="form-control" 
          ${field.required ? "required" : ""} ${
        field.maxLength ? `maxlength="${field.maxLength}"` : ""
      }>
      </div>
    </div>`;
    }
  } else if (page === "confirmation") {
    const now = new Date();
    const dateString = now.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeString = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    mainContent.innerHTML = `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <h1 class="text-center">Vielen Dank!</h1>
          <p class="text-center">Das Formular wurde erfolgreich übermittelt am ${dateString} um ${timeString} Uhr. Sie können dieses Fenster jetzt schließen.</p>
          <div class="text-center mt-4">
            <h5>Weitere Formulare ausfüllen?</h5>
            <button type="button" id="backToFormSelectionButton" class="btn btn-primary">Zurück zur Formularauswahl</button>
          </div>
        </div>
      </div>
    </div>
  `;

    document
      .getElementById("backToFormSelectionButton")
      .addEventListener("click", () => {
        loadPage("startseite");
      });
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

async function LoadJSONData() {
  const apiUrl = configData.apiUrl;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Speicherung in der globalen Variable
    loadedData = {
      forms: data.forms.map((form) => ({
        id: form.id,
        label: form.label,
        title: form.titel || "",
        description: form.beschreibung || "",
        pages: Object.entries(form.pages).map(([pageNumber, pageData]) => ({
          page: parseInt(pageNumber, 10),
          type: pageData.typ,
          title: pageData.titel || "",
          description: pageData.beschreibung || "",
          summary: pageData.zusammenfassung || "",
          consentForm: pageData.einverständniserklärung || "",
          emailcopy: pageData.emailkopie || "",
          fields:
            pageData.fields?.map((field) => ({
              id: field.name, // Soll noch entfernt werden
              name: field.name,
              label: field.label,
              required: field.pflichtfeld === "ja",
              type: field.typ,
              maxLength: field.länge || null,
            })) || [],
        })),
      })),
    };
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
    loadedData = null;
  }
}

function saveCurrentPageData(page, form) {
  if (!formDataStorage[form.id]) {
    formDataStorage[form.id] = {};
  }
  if (!formDataStorage[form.id][page]) {
    formDataStorage[form.id][page] = {};
  }

  const pageData = form.pages.find((p) => p.page === page);
  if (!pageData) return;

  pageData.fields.forEach((field) => {
    const fieldElement = document.getElementById(field.id);
    if (fieldElement) {
      formDataStorage[form.id][page][field.id] =
        fieldElement.type === "checkbox"
          ? fieldElement.checked
          : fieldElement.value;
    }
  });
}

function loadPageDataIntoFields(page, form) {
  if (!formDataStorage[form.id] || !formDataStorage[form.id][page]) return;

  const pageData = form.pages.find((p) => p.page === page);
  if (!pageData) return;

  pageData.fields.forEach((field) => {
    const fieldElement = document.getElementById(field.id);
    if (
      fieldElement &&
      formDataStorage[form.id][page][field.id] !== undefined
    ) {
      fieldElement.value = formDataStorage[form.id][page][field.id];
      if (fieldElement.type === "checkbox") {
        fieldElement.checked =
          formDataStorage[form.id][page][field.id] === "Ja";
      }
    }
  });
}
