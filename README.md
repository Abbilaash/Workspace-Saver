# Workspace Saver — Browser Extension

> **Save your browser workspace. Restore your context.**

Workspace Saver is a fast, offline-first productivity browser extension (Manifest V3) that allows users to save their current browser workspace (open tabs, URLs, titles, tab order, windows, active tab, pinned tabs, native tab groups, group titles/colors, exact scroll positions, selected text, and markdown project notes) as a project and restore it later with one click into a fresh browser window.

---

## 1. Overview

Context switching is one of the biggest friction points in developer productivity. Workspace Saver eliminates this by capturing all context of an active workspace locally into browser IndexedDB (`idb`) and allowing instant context restoration without external servers or cloud dependencies.

---

## 2. Features

- **Workspace Capture**: One-click capture of current window tabs, pinned state, active tab, native tab groups (names, colors, collapsed state), scroll positions, and selected text.
- **Local-First Architecture**: 100% offline storage in browser IndexedDB (`idb`). Private, instant, and secure.
- **Restoration Engine**: Opens a clean new browser window, recreates tab order, restores pinned tabs, recreates native tab groups with title/color, and scrolls back to previous position.
- **Project Notes Scratchpad**: Lightweight Markdown editor and scratchpad built directly into each workspace project.
- **Tab Management**: Add or remove individual tabs directly from your workspace snapshot view.
- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Rapid searching across projects, instant workspace save/restore, project creation, and theme settings.
- **Modern UI**: Sleek developer design inspired by Linear × Arc × Raycast with dark and light theme options.

---

## 3. Tech Stack

- **Framework**: WXT (Web Extension Tools)
- **UI Framework**: React 18, Tailwind CSS, Lucide icons
- **State Management**: Zustand
- **Storage Engine**: Browser IndexedDB (`idb`)
- **Manifest Version**: Manifest V3

---

## 4. Extension Installation & Loading into Chrome

### 1. Build the Extension
```bash
cd extension

# Install dependencies
npm install

# Build extension for Chrome
npm run build
```

### 2. Load Unpacked Extension into Chrome
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select directory: `<path-to-repo>/extension/.output/chrome-mv3`.
5. Click the extension icon in Chrome toolbar to launch Workspace Saver!

---

## 5. Extension Permissions

- `tabs`: Query open tab URLs, titles, active/pinned status, and indices.
- `tabGroups`: Read and recreate native browser tab groups, group names, colors, and collapsed states.
- `storage`: Access extension storage.
- `scripting`: Send content messages to capture scroll positions and text selection.
- `activeTab`: Interact with currently focused browser tab.
- `<all_urls>` host permissions: Send content script messages across arbitrary HTTP/HTTPS sites for page state capture.

---

## 6. Known Browser Security Limitations & Restoration Caveats

1. **Restricted Browser Pages**: `chrome://`, `chrome-extension://`, `edge://`, `about:blank`, and Web Store pages block content script injection. Scroll positions and text selections on these tabs cannot be read.
2. **Restoration of Restricted URLs**: Browser extensions are forbidden from opening `chrome://` URLs directly for security reasons. Unrestorable internal pages are gracefully skipped.
3. **Session Cookies & Form Data**: Extension deliberately does NOT capture cookies, login sessions, passwords, or form inputs to preserve security and privacy.