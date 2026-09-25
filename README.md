# Workspace Saver — Full-Stack Browser Extension

> **Save your browser workspace. Restore your context.**

Workspace Saver is a productivity browser extension and full-stack system that allows users to save their current browser workspace (open tabs, URLs, titles, tab order, windows, active tab, pinned tabs, native tab groups, group titles/colors, exact scroll positions, selected text, and markdown project notes) as a project and restore it later with one click into a fresh browser window.

---

## 1. Overview

Context switching is one of the biggest friction points in developer productivity. Workspace Saver eliminates this by capturing all context of an active workspace locally into IndexedDB (with optional FastAPI + MongoDB cloud sync) and allowing instant context restoration.

---

## 2. Features

- **Workspace Capture**: One-click capture of current window tabs, pinned state, active tab, native tab groups (names, colors, collapsed state), scroll positions, and selected text.
- **Local-First Architecture**: Source of truth is browser IndexedDB (`idb`). Works 100% offline without backend dependencies.
- **Restoration engine**: Opens a clean new browser window, recreates tab order, restores pinned tabs, recreates native tab groups with title/color, and scrolls back to previous position.
- **Project Notes Scratchpad**: Lightweight Markdown editor and preview scratchpad built directly into each project.
- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Rapid searching across projects, instant workspace save/restore, project creation, and settings.
- **Design Philosophy**: Minimal, modern developer design inspired by Linear × Arc × Raycast with sleek dark and light mode styling.
- **FastAPI + MongoDB Backend**: Simple REST API with PyMongo/Motor for optional cloud backup and web app synchronization.
- **Next.js Web Dashboard**: Minimal web interface to inspect saved projects, snapshot tab metadata, and read notes online.

---

## 3. Architecture

```text
Workspace Saver Extension (Local-First)
│
├── Popup UI (React + Tailwind + Zustand)
│   ├── Workspace Indicator
│   ├── Project List & Detail View
│   ├── Markdown Scratchpad
│   ├── Command Palette (⌘K)
│   └── Settings & Toast Notifications
│
├── Background Service Worker
│   ├── chrome.windows API
│   ├── chrome.tabs API
│   ├── chrome.tabGroups API
│   └── Restoration orchestrator
│
├── Content Scripts
│   ├── Scroll position listener (scrollX, scrollY)
│   └── Selected text capture (window.getSelection())
│
├── Local Storage (IndexedDB via idb)
│   ├── projects
│   ├── snapshots
│   ├── notes
│   └── settings
│
└── Cloud Sync (Optional)
    │
    ▼ HTTPS REST API
FastAPI (Python + Motor + PyMongo)
    │
    ▼
MongoDB (Atlas or Local)
```

---

## 4. Tech Stack

- **Browser Extension**: TypeScript, React 18, WXT, Tailwind CSS, Lucide icons, Zustand, IndexedDB (`idb`), Manifest V3.
- **Backend API**: Python 3.11, FastAPI, Motor (Async MongoDB), Pydantic v2, Uvicorn, Docker.
- **Web Application**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide icons.
- **Database**: MongoDB.

---

## 5. Project Structure

```text
Workspace-Saver/
│
├── extension/             # WXT Manifest V3 Browser Extension
│   ├── src/
│   │   ├── components/    # Header, ProjectList, ProjectDetail, Notes, CommandPalette, etc.
│   │   ├── entrypoints/   # popup (index.html, App.tsx), background.ts, content.ts
│   │   ├── lib/           # db.ts (IndexedDB), sync.ts (FastAPI client)
│   │   ├── services/      # tabManager.ts (Chrome tab, window, group capture & restore)
│   │   ├── stores/        # useWorkspaceStore.ts (Zustand state)
│   │   ├── styles/        # globals.css (Linear x Arc x Raycast design system)
│   │   └── types/         # TypeScript interfaces
│   ├── package.json
│   ├── wxt.config.ts
│   └── tailwind.config.js
│
├── backend/               # FastAPI REST Service
│   ├── app/
│   │   ├── api/           # projects.py, snapshots.py, notes.py
│   │   ├── db/            # mongodb.py (Motor async connection)
│   │   ├── models/        # database models
│   │   ├── schemas/       # pydantic request/response schemas
│   │   ├── services/      # business logic
│   │   ├── config.py      # environment variables configuration
│   │   └── main.py        # FastAPI app entrypoint & health checks
│   ├── requirements.txt
│   ├── Dockerfile         # Render deployment configuration
│   └── .env.example
│
├── web/                   # Next.js Web Dashboard
│   ├── app/
│   │   ├── dashboard/     # Project overview list
│   │   ├── projects/[id]/ # Project details & tabs breakdown
│   │   ├── settings/      # Cloud settings
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/        # Navbar, ProjectCard, etc.
│   ├── lib/               # api.ts
│   ├── package.json
│   └── tailwind.config.ts
│
├── README.md              # Project documentation
└── .gitignore
```

---

## 6. Local Development

### 1. Prerequisites
- Node.js v18+ and `npm`
- Python 3.11+
- MongoDB installed locally or MongoDB Atlas connection string

---

## 7. MongoDB Setup

Run `mongosh` locally or in MongoDB Atlas:

```bash
mongosh
```

Select database and create indexes:

```javascript
use workspace_saver

// Create indexes
db.projects.createIndex({ user_id: 1 })
db.projects.createIndex({ updated_at: -1 })

db.snapshots.createIndex({ project_id: 1 })
db.snapshots.createIndex({ created_at: -1 })

db.notes.createIndex({ project_id: 1 })
```

### MongoDB Atlas Steps (Cloud):
1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User (e.g. `ws_user` with password).
3. Under Network Access, whitelist `0.0.0.0/0` (or Render IP ranges).
4. Get standard connection string `mongodb+srv://ws_user:<password>@cluster.mongodb.net/workspace_saver`.
5. Set `MONGODB_URI` in `backend/.env`.

---

## 8. Environment Variables

### Backend (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=workspace_saver
JWT_SECRET=super-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:8000,chrome-extension://*
PORT=8000
```

### Web App (`web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 9. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server with Uvicorn
uvicorn app.main:app --reload --port 8000
```

Verify backend health at: `http://localhost:8000/health`.

---

## 10. Web Application Setup

```bash
cd web

# Install dependencies
npm install

# Run Next.js dev server
npm run dev
```

Open dashboard in browser: `http://localhost:3000`.

---

## 11. Extension Installation & Loading into Chrome

```bash
cd extension

# Install dependencies
npm install

# Build extension for Chrome
npm run build
```

### Load Unpacked Extension into Chrome:
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select directory: `<path-to-repo>/extension/.output/chrome-mv3` (or `.output/chrome-mv3-dev` if running `npm run dev`).
5. Click the extension icon in Chrome toolbar to open Workspace Saver!

---

## 12. Render Deployment Instructions

1. Push your code to GitHub.
2. Log into [Render.com](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your repository and select root directory `backend`.
5. Choose **Docker** runtime (Render automatically detects `Dockerfile`).
6. Set Environment Variables on Render dashboard:
   - `MONGODB_URI`: `<your-mongodb-atlas-uri>`
   - `MONGODB_DATABASE`: `workspace_saver`
   - `CORS_ORIGINS`: `*` (or specific extension IDs and web app URL)
7. Render will build the Docker container and expose your API on HTTPS!

---

## 13. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check endpoint |
| `GET` | `/projects` | List all saved projects |
| `POST` | `/projects` | Create or update project metadata |
| `GET` | `/projects/{id}` | Get single project details |
| `PATCH` | `/projects/{id}` | Update project name/color/desc |
| `DELETE` | `/projects/{id}` | Delete project & snapshots |
| `GET` | `/projects/{id}/snapshots` | Get snapshots list for project |
| `POST` | `/projects/{id}/snapshots` | Save new workspace snapshot |
| `GET` | `/projects/{id}/notes` | Get project markdown notes |
| `PUT` | `/projects/{id}/notes` | Save project markdown notes |

---

## 14. Extension Permissions

- `tabs`: Query open tab URLs, titles, active/pinned status, and indices.
- `tabGroups`: Read and recreate native browser tab groups, group names, colors, and collapsed states.
- `storage`: Access extension storage if required.
- `scripting`: Send content messages to capture scroll positions and text selection.
- `activeTab`: Interact with currently focused browser tab.
- `<all_urls>` host permissions: Send content script messages across arbitrary HTTP/HTTPS sites for page state capture.

---

## 15. Known Browser Security Limitations & Restoration Caveats

Due to strict browser security policies:
1. **Restricted Browser Pages**: `chrome://`, `chrome-extension://`, `edge://`, `about:blank`, and Web Store pages block content script injection. Scroll positions and text selections on these tabs cannot be read.
2. **Restoration of Restricted URLs**: Browser extensions are forbidden from opening `chrome://` URLs directly for security reasons. Unrestorable internal pages are gracefully skipped or substituted with placeholder URLs without failing the rest of the workspace restoration.
3. **Session Cookies & Form Data**: Extension deliberately does NOT capture cookies, login sessions, passwords, or form inputs to preserve security and privacy.
4. **Scroll Position Timing**: Scroll position restoration is performed on a best-effort basis after a tab finishes loading (`chrome.tabs.onUpdated` complete status). Dynamic single-page app (SPA) hydration may shift layout after scroll restoration.