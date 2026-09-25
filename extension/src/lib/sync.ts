import { Project, WorkspaceSnapshot, ProjectNote } from '../types';
import { 
  getSettings, 
  getAllProjects, 
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

export async function syncUserToCloud(name: string, email: string): Promise<{ success: boolean; userId: string }> {
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
      const returnedUserId = json.data?.id || userId;
      settings.userId = returnedUserId;
      settings.userName = name.trim();
      settings.userEmail = email.trim();
      settings.isSetupComplete = true;
      await saveSettings(settings);
      return { success: true, userId: returnedUserId };
    }
  } catch (err) {
    console.warn('Could not sync user to backend:', err);
  }

  settings.userId = userId;
  settings.userName = name.trim();
  settings.userEmail = email.trim();
  settings.isSetupComplete = true;
  await saveSettings(settings);
  return { success: true, userId };
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
      }

      if (success) {
        await removeFromSyncQueue(item.id);
      }
    } catch (err) {
      console.warn('Queue item sync paused:', err);
    }
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

export async function performFullSync(): Promise<{ success: boolean; message: string }> {
  const settings = await getSettings();
  if (!settings.apiUrl) {
    return { success: false, message: 'Sync service URL not configured' };
  }

  const isHealthy = await checkBackendHealth(settings.apiUrl);
  if (!isHealthy) {
    return { success: false, message: 'Backend service offline. Queued for auto-sync.' };
  }

  try {
    const localProjects = await getAllProjects();
    for (const proj of localProjects) {
      syncProjectToCloud(proj);
      const snapshot = await getLatestSnapshotForProject(proj.id);
      if (snapshot) syncSnapshotToCloud(snapshot);
      const note = await getNoteForProject(proj.id);
      if (note) syncNoteToCloud(note);
    }
    await processSyncQueue();
    return { success: true, message: 'Sync completed successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Sync failed' };
  }
}

// Auto register network listeners for processing offline queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processSyncQueue();
  });
}
