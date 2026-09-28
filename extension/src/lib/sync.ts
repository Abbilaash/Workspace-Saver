import { Project, WorkspaceSnapshot, ProjectNote } from '../types';
import { 
  getSettings, 
  saveSettings,
  getAllProjects, 
  saveProject,
  saveSnapshot,
  saveNote,
  getLatestSnapshotForProject, 
  getNoteForProject, 
  addToSyncQueue, 
  getSyncQueue, 
  removeFromSyncQueue 
} from './db';

export async function checkBackendHealth(apiUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${apiUrl}/health`, { 
      method: 'GET', 
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return data.status === 'ok';
    }
  } catch (err) {
    // Silent catch for offline status
  }
  return false;
}

export async function syncUserToCloud(name: string, email: string): Promise<{ success: boolean; userId: string; user?: any; error?: string }> {
  const settings = await getSettings();
  const userId = settings.userId || crypto.randomUUID();

  try {
    const res = await fetch(`${settings.apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userId,
        name: name.trim(),
        email: email.trim()
      })
    });

    if (res.ok) {
      const json = await res.json();
      const user = json.data || {};
      const returnedUserId = user.id || userId;
      settings.userId = returnedUserId;
      settings.userName = name.trim();
      settings.userEmail = email.trim();
      settings.isSetupComplete = true;
      await saveSettings(settings);
      return { success: true, userId: returnedUserId, user };
    } else {
      const json = await res.json().catch(() => ({}));
      return { success: false, userId, error: json.detail?.error?.message || 'Failed to create user' };
    }
  } catch (err: any) {
    console.warn('Could not sync user to backend:', err);
  }

  settings.userId = userId;
  settings.userName = name.trim();
  settings.userEmail = email.trim();
  settings.isSetupComplete = true;
  await saveSettings(settings);
  return { success: true, userId };
}

export async function restoreAccountWithSyncKey(syncKey: string): Promise<{ success: boolean; user?: any; projectsCount?: number; error?: string }> {
  const settings = await getSettings();
  const cleanKey = syncKey.trim();

  if (!cleanKey) {
    return { success: false, error: 'Sync Key is required' };
  }

  try {
    // 1. Check if user exists on backend
    const res = await fetch(`${settings.apiUrl}/users/${encodeURIComponent(cleanKey)}`);
    if (!res.ok) {
      return { success: false, error: 'Invalid Sync Key. No user history found.' };
    }

    const json = await res.json();
    const user = json.data;

    // 2. Save account settings
    settings.userId = cleanKey;
    settings.userName = user.name || 'Synced User';
    settings.userEmail = user.email || '';
    settings.isSetupComplete = true;
    await saveSettings(settings);

    // 3. Hydrate all past user projects/snapshots from database into IndexedDB
    const syncRes = await syncAllFromCloud();

    return { 
      success: true, 
      user, 
      projectsCount: syncRes.projectsCount || 0 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error connecting to backend database' };
  }
}

export async function syncAllFromCloud(): Promise<{ success: boolean; projectsCount?: number }> {
  const settings = await getSettings();
  if (!settings.apiUrl || !settings.userId) {
    return { success: false };
  }

  try {
    const res = await fetch(`${settings.apiUrl}/projects/sync-all?user_id=${encodeURIComponent(settings.userId)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const { projects, snapshots, notes } = json.data;

        // Hydrate projects into local IndexedDB with full field mappings
        if (Array.isArray(projects)) {
          for (const proj of projects) {
            await saveProject({
              id: proj.id,
              name: proj.name,
              description: proj.description || '',
              color: proj.color || '#6366f1',
              createdAt: proj.created_at || new Date().toISOString(),
              updatedAt: proj.updated_at || new Date().toISOString(),
              tabsCount: proj.tabs_count ?? 0,
              groupsCount: proj.groups_count ?? 0,
              lastSnapshotTime: proj.last_snapshot_time || proj.updated_at
            });
          }
        }

        // Hydrate snapshots into local IndexedDB
        if (Array.isArray(snapshots)) {
          for (const snap of snapshots) {
            await saveSnapshot({
              id: snap.id,
              projectId: snap.project_id,
              createdAt: snap.created_at || new Date().toISOString(),
              windows: snap.windows || [],
              tabGroups: snap.tab_groups || [],
              tabsCount: snap.tabs_count ?? 0,
              groupsCount: snap.groups_count ?? 0
            });
          }
        }

        // Hydrate notes into local IndexedDB
        if (Array.isArray(notes)) {
          for (const n of notes) {
            await saveNote({
              projectId: n.project_id,
              content: n.content || '',
              updatedAt: n.updated_at || new Date().toISOString()
            });
          }
        }

        return { success: true, projectsCount: projects?.length || 0 };
      }
    }
  } catch (err) {
    console.warn('Sync all from cloud failed:', err);
  }

  return { success: false };
}

export async function fetchProjectSnapshotsFromCloud(projectId: string): Promise<WorkspaceSnapshot[]> {
  const settings = await getSettings();
  if (!settings.apiUrl) return [];

  try {
    const res = await fetch(`${settings.apiUrl}/projects/${projectId}/snapshots`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((snap: any) => ({
          id: snap.id,
          projectId: snap.project_id,
          createdAt: snap.created_at,
          windows: snap.windows || [],
          tabGroups: snap.tab_groups || [],
          tabsCount: snap.tabs_count || 0,
          groupsCount: snap.groups_count || 0
        }));
      }
    }
  } catch (err) {
    console.warn('Fetch snapshots from cloud failed:', err);
  }
  return [];
}

export async function fetchProjectNoteFromCloud(projectId: string): Promise<ProjectNote | null> {
  const settings = await getSettings();
  if (!settings.apiUrl) return null;

  try {
    const res = await fetch(`${settings.apiUrl}/projects/${projectId}/notes`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          projectId: json.data.project_id || projectId,
          content: json.data.content || '',
          updatedAt: json.data.updated_at || new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.warn('Fetch note from cloud failed:', err);
  }
  return null;
}

export async function processSyncQueue(): Promise<void> {
  const settings = await getSettings();
  if (!settings.apiUrl) return;

  const queue = await getSyncQueue();
  if (queue.length === 0) return;

  const isHealthy = await checkBackendHealth(settings.apiUrl);
  if (!isHealthy) return;

  for (const item of queue) {
    try {
      let success = false;
      if (item.type === 'project') {
        success = await sendProjectToBackend(item.payload, settings.apiUrl, settings.userId || 'default_user');
      } else if (item.type === 'snapshot') {
        success = await sendSnapshotToBackend(item.payload, settings.apiUrl, settings.userId || 'default_user');
      } else if (item.type === 'note') {
        success = await sendNoteToBackend(item.payload, settings.apiUrl, settings.userId || 'default_user');
      } else if (item.type === 'delete_project') {
        success = await sendProjectDeletionToBackend(item.payload.projectId, settings.apiUrl);
      }

      if (success) {
        await removeFromSyncQueue(item.id);
      }
    } catch (err) {
      console.warn('Queue item sync paused:', err);
    }
  }
}

async function sendProjectDeletionToBackend(projectId: string, apiUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/projects/${projectId}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendProjectToBackend(project: Project, apiUrl: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: project.id,
        name: project.name,
        description: project.description || '',
        color: project.color,
        user_id: userId,
        created_at: project.createdAt,
        updated_at: project.updatedAt
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendSnapshotToBackend(snapshot: WorkspaceSnapshot, apiUrl: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/projects/${snapshot.projectId}/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: snapshot.id,
        project_id: snapshot.projectId,
        user_id: userId,
        created_at: snapshot.createdAt,
        windows: snapshot.windows,
        tab_groups: snapshot.tabGroups || [],
        tabs_count: snapshot.tabsCount,
        groups_count: snapshot.groupsCount
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendNoteToBackend(note: ProjectNote, apiUrl: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/projects/${note.projectId}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: note.projectId,
        user_id: userId,
        content: note.content,
        updated_at: note.updatedAt
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function syncProjectToCloud(project: Project): void {
  getSettings().then(async (settings) => {
    const userId = settings.userId || 'default_user';
    const ok = await sendProjectToBackend(project, settings.apiUrl, userId);
    if (!ok) {
      await addToSyncQueue({ type: 'project', payload: project });
    }
  }).catch(() => {});
}

export function syncSnapshotToCloud(snapshot: WorkspaceSnapshot): void {
  getSettings().then(async (settings) => {
    const userId = settings.userId || 'default_user';
    const ok = await sendSnapshotToBackend(snapshot, settings.apiUrl, userId);
    if (!ok) {
      await addToSyncQueue({ type: 'snapshot', payload: snapshot });
    }
  }).catch(() => {});
}

export function syncNoteToCloud(note: ProjectNote): void {
  getSettings().then(async (settings) => {
    const userId = settings.userId || 'default_user';
    const ok = await sendNoteToBackend(note, settings.apiUrl, userId);
    if (!ok) {
      await addToSyncQueue({ type: 'note', payload: note });
    }
  }).catch(() => {});
}

export function syncProjectDeletionToCloud(projectId: string): void {
  getSettings().then(async (settings) => {
    const ok = await sendProjectDeletionToBackend(projectId, settings.apiUrl);
    if (!ok) {
      await addToSyncQueue({ type: 'delete_project', payload: { projectId } });
    }
  }).catch(() => {});
}

export async function performFullBiDirectionalSync(): Promise<{ success: boolean; message: string }> {
  const settings = await getSettings();
  if (!settings.apiUrl || !settings.userId) {
    return { success: false, message: 'Sync service URL or User ID not configured' };
  }

  const isHealthy = await checkBackendHealth(settings.apiUrl);
  if (!isHealthy) {
    return { success: false, message: 'Backend service offline. Queued for auto-sync.' };
  }

  try {
    // 1. Add all new/local workspaces in extension to database (if syncing didn't happen yet)
    const localProjects = await getAllProjects();
    for (const proj of localProjects) {
      await sendProjectToBackend(proj, settings.apiUrl, settings.userId);
      const snapshot = await getLatestSnapshotForProject(proj.id);
      if (snapshot) {
        await sendSnapshotToBackend(snapshot, settings.apiUrl, settings.userId);
      }
      const note = await getNoteForProject(proj.id);
      if (note) {
        await sendNoteToBackend(note, settings.apiUrl, settings.userId);
      }
    }
    await processSyncQueue();

    // 2. Load all workspaces in database to extension
    await syncAllFromCloud();

    return { success: true, message: 'Extension and Database synchronized successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Sync failed' };
  }
}

export async function performFullSync(): Promise<{ success: boolean; message: string }> {
  return performFullBiDirectionalSync();
}

// Auto register network listeners for processing offline queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processSyncQueue();
  });
}
