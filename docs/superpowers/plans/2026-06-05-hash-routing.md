# Hash-based Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement client-side, hash-based routing to support full browser navigation (back/forward buttons, deep linking, and active link states) in the ODA Generic template app.

**Architecture:** We will transition the app's routing to be driven by the native `hashchange` browser event. When the hash changes, we will parse the path, call `loadPage()`, and update the active menu items. Default / empty or invalid hashes will redirect to `#startseite`.

**Tech Stack:** Vanilla JavaScript, HTML5, Bootstrap 5.3 (CSS)

---

### Task 1: Add Router Functions & Update DOMContentLoaded in app-base.js

**Files:**
- Modify: `app/app-base.js`

- [ ] **Step 1: Define `getPageFromHash()`**
  Implement the function `getPageFromHash()` to extract a clean page name from the URL hash, fallback to `"startseite"` for empty/invalid hashes.
  Code snippet to add:
  ```javascript
  function getPageFromHash() {
    const hash = window.location.hash.replace("#", "").trim();
    const validPages = ["startseite", "beschreibung", "kontakt", "datenschutz", "impressum"];
    if (validPages.includes(hash)) {
      return hash;
    }
    return "startseite";
  }
  ```

- [ ] **Step 2: Define `updateActiveNavLink()`**
  Implement `updateActiveNavLink(page)` to set the `.active` class on navbar links matching the active route, and remove it from others.
  Code snippet to add:
  ```javascript
  function updateActiveNavLink(page) {
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      const pageName =
        link.getAttribute("data-page") ||
        link.getAttribute("href").replace("#", "").trim();
      if (pageName === page) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  ```

- [ ] **Step 3: Define `handleRouting()`**
  Implement `handleRouting()` to load the page and update the navigation active styling based on the current hash.
  Code snippet to add:
  ```javascript
  function handleRouting() {
    const page = getPageFromHash();
    loadPage(page);
    updateActiveNavLink(page);
  }
  ```

- [ ] **Step 4: Update the `DOMContentLoaded` event listener**
  In the `DOMContentLoaded` event listener, instead of unconditionally calling `loadPage("startseite")`, we initialize the hash-based router.
  Modify the end of the `DOMContentLoaded` callback:
  ```javascript
      // Router initialisieren
      window.addEventListener("hashchange", handleRouting);

      const initialPage = getPageFromHash();
      if (window.location.hash !== `#${initialPage}`) {
        window.location.hash = `#${initialPage}`;
      } else {
        handleRouting();
      }
  ```

- [ ] **Step 5: Commit changes**
  ```bash
  git add app/app-base.js
  git commit -m "feat: add hash-based router functions and DOMContentLoaded setup"
  ```

---

### Task 2: Simplify Menu Click Handlers in app-base.js

**Files:**
- Modify: `app/app-base.js`

- [ ] **Step 1: Simplify `setupBurgerMenu()`**
  Remove `event.preventDefault()` and `loadPage()` calls inside the navbar link click listener, letting the browser natively update the hash. Retain the logic that closes the responsive Offcanvas menu.
  Target code:
  ```javascript
  function setupBurgerMenu() {
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      const pageName =
        link.getAttribute("data-page") ||
        link.getAttribute("href").replace("#", "").trim();
      if (pageName) {
        // Stelle sicher, dass pageName gültig ist
        link.addEventListener("click", (event) => {
          // Kein preventDefault(), damit der Hash sich ändert
          const offcanvasNavbar = document.getElementById("offcanvasNavbar");
          const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasNavbar);

          if (offcanvas && offcanvasNavbar.classList.contains("show")) {
            offcanvas.hide();
          }
        });
      }
    });
  }
  ```

- [ ] **Step 2: Commit changes**
  ```bash
  git add app/app-base.js
  git commit -m "feat: simplify burger menu event handlers to let hash navigation work natively"
  ```

---

### Task 3: Manual Verification & Cleanup

**Files:**
- None (Verification)

- [ ] **Step 1: Verify URL auto-redirection**
  Open the app in browser. Go to `http://127.0.0.1:5500/app/index.html` (or your local server equivalent).
  Check if URL automatically changes to `http://127.0.0.1:5500/app/index.html#startseite` and displays the start page.

- [ ] **Step 2: Verify subpage navigation**
  Click on "Beschreibung", "Kontakt", etc. Verify that the page content updates, the URL changes accordingly (e.g. to `#beschreibung`), and the active link in the menu is highlighted.

- [ ] **Step 3: Verify browser navigation**
  Click "Back" in the browser. Verify the page transitions back and the menu highlight changes to match. Click "Forward" and verify it moves forward.

- [ ] **Step 4: Verify mobile menu auto-close**
  In responsive/mobile view, open the offcanvas menu and click "Datenschutz". Verify that the menu closes and the Datenschutz page is displayed.
