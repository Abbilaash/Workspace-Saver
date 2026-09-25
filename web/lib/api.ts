import { Project, WorkspaceSnapshot, ProjectNote } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchProjects(userId?: string): Promise<Project[]> {
  try {
    const url = userId && userId !== 'all'
      ? `${API_BASE_URL}/projects?user_id=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/projects`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const rawList = json.data || [];
    return rawList
      .map((p: any) => ({
        ...p,
        id: p.id || p._id || ''
      }))
      .filter((p: Project) => p.id && p.id !== 'undefined');
  } catch (err) {
    console.warn('Could not fetch projects from backend:', err);
    return [];
  }
}

export async function fetchProject(id: string): Promise<Project | null> {
  if (!id || id === 'undefined') return null;
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json.data;
    if (!data) return null;
    return { ...data, id: data.id || data._id };
  } catch (err) {
    console.warn(`Could not fetch project ${id}:`, err);
    return null;
  }
}

export async function fetchSnapshots(projectId: string): Promise<WorkspaceSnapshot[]> {
  if (!projectId || projectId === 'undefined') return [];
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/snapshots`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn(`Could not fetch snapshots for project ${projectId}:`, err);
    return [];
  }
}

export async function fetchNote(projectId: string): Promise<ProjectNote | null> {
  if (!projectId || projectId === 'undefined') return null;
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/notes`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn(`Could not fetch note for project ${projectId}:`, err);
    return null;
  }
}
