import { Project, WorkspaceSnapshot, ProjectNote, Settings } from '../types';
import { getSettings, getAllProjects, saveProject, getLatestSnapshotForProject, saveSnapshot, getNoteForProject, saveNote, saveSettings } from './db';

export async function checkBackendHealth(apiUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/health`, { method: 'GET', headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      return data.status === 'ok';
    }
  } catch (err) {
    console.warn('Backend health check failed:', err);
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

  // Save locally even if server is offline
  settings.userId = userId;
  settings.userName = name.trim();
  settings.userEmail = email.trim();
  settings.isSetupComplete = true;
  await saveSettings(settings);
  return { success: true, userId };
}

export async function syncProjectToCloud(project: Project): Promise<boolean> {
  const settings = await getSettings();
  if (!settings.autoSync || !settings.apiUrl) return false;

  try {
    const res = await fetch(`${settings.apiUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: project.id,
        name: project.name,
        description: project.description || '',
        color: project.color,
        user_id: settings.userId || 'default_user',
        created_at: project.createdAt,
        updated_at: project.updatedAt
      })
    });
    return res.ok;
  } catch (err) {
    console.warn(`Failed to sync project ${project.id} to cloud:`, err);
    return false;
  }
}

export async function syncSnapshotToCloud(snapshot: WorkspaceSnapshot): Promise<boolean> {
  const settings = await getSettings();
  if (!settings.autoSync || !settings.apiUrl) return false;

  try {
    const res = await fetch(`${settings.apiUrl}/projects/${snapshot.projectId}/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: snapshot.id,
        project_id: snapshot.projectId,
        user_id: settings.userId || 'default_user',
        created_at: snapshot.createdAt,
        windows: snapshot.windows,
        tab_groups: snapshot.tabGroups || [],
        tabs_count: snapshot.tabsCount,
        groups_count: snapshot.groupsCount
      })
    });
    return res.ok;
  } catch (err) {
    console.warn(`Failed to sync snapshot ${snapshot.id} to cloud:`, err);
    return false;
  }
}

export async function syncNoteToCloud(note: ProjectNote): Promise<boolean> {
  const settings = await getSettings();
  if (!settings.autoSync || !settings.apiUrl) return false;

  try {
    const res = await fetch(`${settings.apiUrl}/projects/${note.projectId}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: note.projectId,
        user_id: settings.userId || 'default_user',
        content: note.content,
        updated_at: note.updatedAt
      })
    });
    return res.ok;
  } catch (err) {
    console.warn(`Failed to sync note for project ${note.projectId} to cloud:`, err);
    return false;
  }
}

export async function performFullSync(): Promise<{ success: boolean; message: string }> {
  const settings = await getSettings();
  if (!settings.apiUrl) {
    return { success: false, message: 'Sync service URL not configured' };
  }

  const isHealthy = await checkBackendHealth(settings.apiUrl);
  if (!isHealthy) {
    return { success: false, message: 'Cannot connect to database sync service' };
  }

  try {
    const localProjects = await getAllProjects();
    for (const proj of localProjects) {
      await syncProjectToCloud(proj);
      const snapshot = await getLatestSnapshotForProject(proj.id);
      if (snapshot) await syncSnapshotToCloud(snapshot);
      const note = await getNoteForProject(proj.id);
      if (note) await syncNoteToCloud(note);
    }
    return { success: true, message: 'Sync completed successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Sync failed' };
  }
}

export async function enableCloudSync(): Promise<{ success: boolean; message: string }> {
  const settings = await getSettings();
  settings.autoSync = true;
  await saveSettings(settings);

  const syncRes = await performFullSync();
  if (syncRes.success) {
    return { success: true, message: 'Cloud sync enabled. All local projects saved to database.' };
  } else {
    return { success: false, message: `Cloud sync enabled, but database connection failed: ${syncRes.message}` };
  }
}

export async function disableCloudSync(): Promise<{ success: boolean; message: string }> {
  const settings = await getSettings();
  settings.autoSync = false;
  await saveSettings(settings);

  try {
    await fetch(`${settings.apiUrl}/projects/clear-cloud`, { method: 'DELETE' });
    return { success: true, message: 'Cloud sync disabled. All database records erased.' };
  } catch (err: any) {
    return { success: true, message: 'Cloud sync disabled locally.' };
  }
}
