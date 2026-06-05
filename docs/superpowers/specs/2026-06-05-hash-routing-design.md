# Design Specification: Hash-based Routing for ODA Generic App

**Date:** 2026-06-05  
**Topic:** Hash-based Routing and Browser Navigation  
**Status:** Approved  

---

## 1. Overview & Goals

The ODA Generic App currently manages navigation by directly catching click events in the navbar menu and calling `loadPage(pageName)` programmatically. While this updates the rendered content in `#main-content`, it does not change the browser's URL, address history, or support standard browser navigation (such as the back and forward buttons, reloading the page, or sharing links to specific subpages).

This design introduces a standard, robust, client-side, hash-based routing system.

---

## 2. Requirements

- **Browser History Support:** Users must be able to use the browser's back and forward buttons to navigate between loaded pages.
- **Deep Linking:** Reloading the page or visiting a URL with a specific hash (e.g. `index.html#kontakt`) must load that specific page.
- **Default Fallback:** Visiting the app without a hash or with an invalid/unknown hash must automatically default to `#startseite` and display the start page.
- **Active Navigation Highlighting:** The navbar menu links must visually highlight (Bootstrap class `active`) whichever page is currently active, matching the hash.
- **Responsiveness/Offcanvas Support:** Selecting a link in the mobile/tablet offcanvas sidebar must still close the sidebar.

---

## 3. Design Details

### 3.1 Routing Flow & Event Architecture

The routing flow will be entirely driven by the browser's `hashchange` event.

1. **Initialization on Page Load (`DOMContentLoaded`):**
   - After the configurations are loaded and the general DOM elements (footer, header titles) are updated, the router will initialize.
   - It will check the current `window.location.hash`.
   - If empty or invalid, it will set `window.location.hash = "#startseite"`. This programmatically triggers the `hashchange` event.
   - If a valid hash exists, it will trigger the routing logic directly or let the `hashchange` listener handle it.

2. **Event Listening:**
   - Listen to `hashchange` on `window`.
   - On change, extract the routing name (e.g. `startseite` from `#startseite`).
   - Invoke `loadPage(route)`.
   - Invoke `updateActiveNavLink(route)`.

3. **Navbar Menu click events:**
   - Let the navigation links change the hash natively.
   - In `setupBurgerMenu()`, remove `event.preventDefault()`. The click handler will only close the Offcanvas sidebar if it is currently open.

### 3.2 Modifying `app-base.js`

We will update [app-base.js](file:///Users/dennis/Documents/Ondics/Projekte/odas-apps/oda-generic/app/app-base.js) with the following changes:

1. **Add routing helper functions:**
   - `handleRouting()`: Reads `window.location.hash`, matches it against a list of valid routes, loads the page, and updates navigation styles.
   - `isValidRoute(route)`: Helper to check if a route is in `['startseite', 'beschreibung', 'kontakt', 'datenschutz', 'impressum']`.
   - `updateActiveNavLink(route)`: Highlights the current active link in the menu and de-highlights the others.

2. **Update `DOMContentLoaded` event listener:**
   - Instead of immediately calling `loadPage("startseite")`, it will call the router initialization.

3. **Update `setupBurgerMenu()`:**
   - Remove `event.preventDefault()` so the hash gets updated natively.
   - Keep the Offcanvas closing logic.

---

## 4. Test & Verification Plan

1. **Initial Load:**
   - Navigate to `/app/index.html`. Verify it automatically redirects to `/app/index.html#startseite` and renders the start page.
2. **Subpage Navigation:**
   - Click "Beschreibung" in the navbar. Verify the URL changes to `/app/index.html#beschreibung` and the description content is loaded.
   - Verify that "Beschreibung" is highlighted in the menu.
3. **Browser Back/Forward:**
   - Click "Kontakt" (URL becomes `/app/index.html#kontakt`).
   - Click the browser's "Back" button. Verify the URL changes to `/app/index.html#beschreibung`, the description content displays, and "Beschreibung" is highlighted.
   - Click the browser's "Forward" button. Verify the URL changes to `/app/index.html#kontakt`, the contact page displays, and "Kontakt" is highlighted.
4. **Invalid Hash Handling:**
   - Manually type `/app/index.html#invalidroute` in the browser address bar. Verify it falls back to `/app/index.html#startseite`.
5. **Mobile Navigation:**
   - Open in a responsive view (burger menu visible). Open the burger menu, click "Datenschutz". Verify the menu closes automatically and the Datenschutz page displays.
