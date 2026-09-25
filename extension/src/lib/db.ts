import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Project, WorkspaceSnapshot, ProjectNote, Settings } from '../types';

interface WorkspaceSaverDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
    indexes: { 'by-updatedAt': string };
  };
  snapshots: {
    key: string;
    value: WorkspaceSnapshot;
    indexes: { 'by-projectId': string; 'by-createdAt': string };
  };
  notes: {
    key: string;
    value: ProjectNote;
  };
  settings: {
    key: string;
    value: Settings;
  };
}

const DB_NAME = 'workspace-saver-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WorkspaceSaverDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<WorkspaceSaverDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-updatedAt', 'updatedAt');
        }

        // Snapshots store
        if (!db.objectStoreNames.contains('snapshots')) {
          const snapshotStore = db.createObjectStore('snapshots', { keyPath: 'id' });
          snapshotStore.createIndex('by-projectId', 'projectId');
          snapshotStore.createIndex('by-createdAt', 'createdAt');
        }

        // Notes store
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'projectId' });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// Projects operations
export async function getAllProjects(): Promise<Project[]> {
  const db = await getDB();
  const projects = await db.getAllFromIndex('projects', 'by-updatedAt');
  return projects.reverse(); // Most recent first
}

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await getDB();
  return db.get('projects', id);
}

export async function saveProject(project: Project): Promise<void> {
  const db = await getDB();
  await db.put('projects', project);
}

export async function deleteProjectFromDB(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['projects', 'snapshots', 'notes'], 'readwrite');
  
  // Delete project
  await tx.objectStore('projects').delete(id);
  
  // Delete project snapshots
  const snapshotIndex = tx.objectStore('snapshots').index('by-projectId');
  let cursor = await snapshotIndex.openCursor(id);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }

  // Delete project notes
  await tx.objectStore('notes').delete(id);
  await tx.done;
}

// Snapshots operations
export async function getLatestSnapshotForProject(projectId: string): Promise<WorkspaceSnapshot | undefined> {
  const db = await getDB();
  const snapshots = await db.getAllFromIndex('snapshots', 'by-projectId', projectId);
  if (snapshots.length === 0) return undefined;
  snapshots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return snapshots[0];
}

export async function saveSnapshot(snapshot: WorkspaceSnapshot): Promise<void> {
  const db = await getDB();
  await db.put('snapshots', snapshot);
}

// Notes operations
export async function getNoteForProject(projectId: string): Promise<ProjectNote | undefined> {
  const db = await getDB();
  return db.get('notes', projectId);
}

export async function saveNote(note: ProjectNote): Promise<void> {
  const db = await getDB();
  await db.put('notes', note);
}

// Settings operations
export async function getSettings(): Promise<Settings> {
  const db = await getDB();
  const settings = await db.get('settings', 'config');
  if (!settings) {
    const initial: Settings = {
      apiUrl: 'http://localhost:8000',
      autoSync: true,
      theme: 'dark',
      userId: crypto.randomUUID()
    };
    await db.put('settings', initial, 'config');
    return initial;
  }
  if (!settings.userId) {
    settings.userId = crypto.randomUUID();
    await db.put('settings', settings, 'config');
  }
  return settings;
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, 'config');
}
