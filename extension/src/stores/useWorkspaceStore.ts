import { create } from 'zustand';
import { Project, WorkspaceSnapshot, ProjectNote, CurrentWorkspaceSummary, Settings } from '../types';
import { 
  getAllProjects, 
  saveProject, 
  deleteProjectFromDB, 
  saveSnapshot, 
  getLatestSnapshotForProject, 
  getNoteForProject, 
  saveNote,
  getSettings,
  saveSettings
} from '../lib/db';
import { captureWorkspace, restoreWorkspace, getCurrentWorkspaceSummary } from '../services/tabManager';
import { syncProjectToCloud, syncSnapshotToCloud, syncNoteToCloud, processSyncQueue } from '../lib/sync';

interface WorkspaceStore {
  projects: Project[];
  selectedProject: Project | null;
  selectedSnapshot: WorkspaceSnapshot | null;
  selectedNote: ProjectNote | null;
  currentWorkspace: CurrentWorkspaceSummary | null;
  searchQuery: string;
  isSaving: boolean;
  isRestoring: boolean;
  isCommandPaletteOpen: boolean;
  isCreateModalOpen: boolean;
  settings: Settings;
  toastMessage: { type: 'success' | 'error' | 'info'; text: string } | null;

  // Actions
  loadInitialData: () => Promise<void>;
  selectProject: (projectId: string | null) => Promise<void>;
  createNewProject: (name: string, color: string, description?: string) => Promise<Project>;
  saveCurrentWorkspace: (targetProjectId?: string) => Promise<void>;
  restoreProjectWorkspace: (projectId: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  renameProject: (projectId: string, newName: string) => Promise<void>;
  updateProjectNote: (projectId: string, content: string) => Promise<void>;
  addTabToSnapshot: (projectId: string, url: string, title?: string) => Promise<void>;
  removeTabFromSnapshot: (projectId: string, tabIndex: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  setCreateModalOpen: (isOpen: boolean) => void;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  setToast: (toast: { type: 'success' | 'error' | 'info'; text: string } | null) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  selectedSnapshot: null,
  selectedNote: null,
  currentWorkspace: null,
  searchQuery: '',
  isSaving: false,
  isRestoring: false,
  isCommandPaletteOpen: false,
  isCreateModalOpen: false,
  settings: {
    apiUrl: 'https://workspace-saver.onrender.com',
    autoSync: true,
    theme: 'dark'
  },
  toastMessage: null,

  loadInitialData: async () => {
    try {
      const [projectsList, currentSummary, currentSettings] = await Promise.all([
        getAllProjects(),
        getCurrentWorkspaceSummary(),
        getSettings()
      ]);

      set({ 
        projects: projectsList, 
        currentWorkspace: currentSummary,
        settings: currentSettings 
      });

      // Apply theme class
      if (currentSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Process any background offline sync queue items asynchronously
      processSyncQueue().catch(() => {});
    } catch (err) {
      console.error('Failed to load initial workspace store data:', err);
    }
  },

  selectProject: async (projectId: string | null) => {
    if (!projectId) {
      set({ selectedProject: null, selectedSnapshot: null, selectedNote: null });
      return;
    }

    const { projects } = get();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    const [snapshot, note] = await Promise.all([
      getLatestSnapshotForProject(projectId),
      getNoteForProject(projectId)
    ]);

    set({
      selectedProject: proj,
      selectedSnapshot: snapshot || null,
      selectedNote: note || { projectId, content: '', updatedAt: new Date().toISOString() }
    });
  },

  createNewProject: async (name: string, color: string, description?: string) => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save locally with 0ms latency
    await saveProject(newProj);
    // Fire-and-forget sync (or queue if offline)
    syncProjectToCloud(newProj);

    // Automatically capture current workspace for the new project
    const captured = await captureWorkspace();
    const snapshot: WorkspaceSnapshot = {
      id: crypto.randomUUID(),
      projectId: newProj.id,
      createdAt: new Date().toISOString(),
      windows: captured.windows,
      tabGroups: captured.tabGroups,
      tabsCount: captured.tabsCount,
      groupsCount: captured.groupsCount
    };

    await saveSnapshot(snapshot);
    syncSnapshotToCloud(snapshot);

    newProj.tabsCount = captured.tabsCount;
    newProj.groupsCount = captured.groupsCount;
    newProj.lastSnapshotTime = snapshot.createdAt;
    await saveProject(newProj);

    const updatedProjects = await getAllProjects();
    set({ projects: updatedProjects });

    await get().selectProject(newProj.id);
    get().setToast({ type: 'success', text: `Project "${name}" created and workspace saved.` });

    return newProj;
  },

  saveCurrentWorkspace: async (targetProjectId?: string) => {
    const { selectedProject, projects } = get();
    const projectId = targetProjectId || selectedProject?.id;
    if (!projectId) {
      get().setToast({ type: 'error', text: 'No project selected to save workspace.' });
      return;
    }

    set({ isSaving: true });
    try {
      const proj = projects.find(p => p.id === projectId);
      if (!proj) throw new Error('Project not found');

      const captured = await captureWorkspace();
      const snapshot: WorkspaceSnapshot = {
        id: crypto.randomUUID(),
        projectId: proj.id,
        createdAt: new Date().toISOString(),
        windows: captured.windows,
        tabGroups: captured.tabGroups,
        tabsCount: captured.tabsCount,
        groupsCount: captured.groupsCount
      };

      await saveSnapshot(snapshot);
      syncSnapshotToCloud(snapshot);

      proj.updatedAt = new Date().toISOString();
      proj.tabsCount = captured.tabsCount;
      proj.groupsCount = captured.groupsCount;
      proj.lastSnapshotTime = snapshot.createdAt;
      await saveProject(proj);
      syncProjectToCloud(proj);

      const updatedProjects = await getAllProjects();
      set({ 
        projects: updatedProjects, 
        selectedSnapshot: snapshot,
        isSaving: false 
      });

      get().setToast({ type: 'success', text: `Workspace saved for "${proj.name}".` });
    } catch (err: any) {
      set({ isSaving: false });
      get().setToast({ type: 'error', text: err.message || 'Failed to save workspace' });
    }
  },

  restoreProjectWorkspace: async (projectId: string) => {
    const snapshot = await getLatestSnapshotForProject(projectId);
    const { projects } = get();
    const proj = projects.find(p => p.id === projectId);

    if (!snapshot || !snapshot.windows || snapshot.windows.length === 0) {
      get().setToast({ type: 'error', text: 'No saved workspace snapshot found for this project.' });
      return;
    }

    set({ isRestoring: true });
    try {
      const result = await restoreWorkspace(snapshot.windows, snapshot.tabGroups || []);
      set({ isRestoring: false });
      get().setToast({ 
        type: result.success ? 'success' : 'error', 
        text: result.message 
      });
    } catch (err: any) {
      set({ isRestoring: false });
      get().setToast({ type: 'error', text: err.message || 'Failed to restore workspace' });
    }
  },

  deleteProject: async (projectId: string) => {
    const { projects, selectedProject } = get();
    const proj = projects.find(p => p.id === projectId);
    
    await deleteProjectFromDB(projectId);
    const updatedProjects = await getAllProjects();

    set({ 
      projects: updatedProjects,
      selectedProject: selectedProject?.id === projectId ? null : selectedProject,
      selectedSnapshot: selectedProject?.id === projectId ? null : get().selectedSnapshot,
      selectedNote: selectedProject?.id === projectId ? null : get().selectedNote
    });

    get().setToast({ type: 'info', text: `Project "${proj?.name || 'Project'}" deleted.` });
  },

  renameProject: async (projectId: string, newName: string) => {
    const { projects } = get();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    proj.name = newName;
    proj.updatedAt = new Date().toISOString();
    await saveProject(proj);
    syncProjectToCloud(proj);

    const updatedProjects = await getAllProjects();
    set({ projects: updatedProjects });

    if (get().selectedProject?.id === projectId) {
      set({ selectedProject: { ...proj } });
    }
    get().setToast({ type: 'success', text: `Project renamed to "${newName}".` });
  },

  updateProjectNote: async (projectId: string, content: string) => {
    const note: ProjectNote = {
      projectId,
      content,
      updatedAt: new Date().toISOString()
    };

    await saveNote(note);
    syncNoteToCloud(note);

    if (get().selectedProject?.id === projectId) {
      set({ selectedNote: note });
    }
  },

  addTabToSnapshot: async (projectId: string, url: string, title?: string) => {
    let snapshot = await getLatestSnapshotForProject(projectId);
    const { projects } = get();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    if (!snapshot) {
      snapshot = {
        id: crypto.randomUUID(),
        projectId,
        createdAt: new Date().toISOString(),
        windows: [{ tabs: [] }],
        tabGroups: [],
        tabsCount: 0,
        groupsCount: 0
      };
    }

    if (!snapshot.windows || snapshot.windows.length === 0) {
      snapshot.windows = [{ tabs: [] }];
    }

    const currentTabs = snapshot.windows[0].tabs || [];
    const newTab = {
      url: url.startsWith('http') ? url : `https://${url}`,
      title: title?.trim() || url,
      index: currentTabs.length,
      active: false,
      pinned: false,
      muted: false
    };

    snapshot.windows[0].tabs = [...currentTabs, newTab];
    snapshot.tabsCount = snapshot.windows[0].tabs.length;
    snapshot.createdAt = new Date().toISOString();

    await saveSnapshot(snapshot);
    syncSnapshotToCloud(snapshot);

    proj.tabsCount = snapshot.tabsCount;
    proj.updatedAt = new Date().toISOString();
    proj.lastSnapshotTime = snapshot.createdAt;
    await saveProject(proj);
    syncProjectToCloud(proj);

    const updatedProjects = await getAllProjects();
    set({
      projects: updatedProjects,
      selectedSnapshot: snapshot,
      selectedProject: { ...proj }
    });

    get().setToast({ type: 'success', text: 'Tab added to snapshot.' });
  },

  removeTabFromSnapshot: async (projectId: string, tabIndex: number) => {
    const snapshot = await getLatestSnapshotForProject(projectId);
    const { projects } = get();
    const proj = projects.find(p => p.id === projectId);
    if (!snapshot || !proj || !snapshot.windows || snapshot.windows.length === 0) return;

    const tabs = snapshot.windows[0].tabs || [];
    if (tabIndex < 0 || tabIndex >= tabs.length) return;

    tabs.splice(tabIndex, 1);
    // Re-index remaining tabs
    tabs.forEach((t, idx) => { t.index = idx; });

    snapshot.windows[0].tabs = tabs;
    snapshot.tabsCount = tabs.length;
    snapshot.createdAt = new Date().toISOString();

    await saveSnapshot(snapshot);
    syncSnapshotToCloud(snapshot);

    proj.tabsCount = snapshot.tabsCount;
    proj.updatedAt = new Date().toISOString();
    proj.lastSnapshotTime = snapshot.createdAt;
    await saveProject(proj);
    syncProjectToCloud(proj);

    const updatedProjects = await getAllProjects();
    set({
      projects: updatedProjects,
      selectedSnapshot: snapshot,
      selectedProject: { ...proj }
    });

    get().setToast({ type: 'info', text: 'Tab removed from snapshot.' });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setCommandPaletteOpen: (isOpen: boolean) => set({ isCommandPaletteOpen: isOpen }),
  setCreateModalOpen: (isOpen: boolean) => set({ isCreateModalOpen: isOpen }),

  updateSettings: async (newSettings: Partial<Settings>) => {
    const current = get().settings;
    const updated = { ...current, ...newSettings };
    await saveSettings(updated);
    
    if (updated.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    set({ settings: updated });
    get().setToast({ type: 'success', text: 'Settings updated.' });
  },

  setToast: (toast) => set({ toastMessage: toast })
}));
