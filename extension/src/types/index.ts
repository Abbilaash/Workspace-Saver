export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  tabsCount?: number;
  groupsCount?: number;
  lastSnapshotTime?: string;
}

export interface TabGroupSnapshot {
  id: number;
  title: string;
  color: string;
  collapsed?: boolean;
}

export interface WorkspaceTab {
  url: string;
  title: string;
  index: number;
  active: boolean;
  pinned: boolean;
  muted: boolean;
  groupId?: number;
  scrollX?: number;
  scrollY?: number;
  selectedText?: string;
}

export interface WorkspaceWindow {
  originalWindowId?: number;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  tabs: WorkspaceTab[];
}

export interface WorkspaceSnapshot {
  id: string;
  projectId: string;
  createdAt: string;
  windows: WorkspaceWindow[];
  tabGroups?: TabGroupSnapshot[];
  tabsCount: number;
  groupsCount: number;
}

export interface ProjectNote {
  projectId: string;
  content: string;
  updatedAt: string;
}

export interface Settings {
  apiUrl: string;
  autoSync: boolean;
  theme: 'dark' | 'light';
  userId?: string;
  userName?: string;
  userEmail?: string;
  isSetupComplete?: boolean;
}

export interface CurrentWorkspaceSummary {
  tabsCount: number;
  groupsCount: number;
  windowsCount: number;
  matchingProjectId?: string;
  matchingProjectName?: string;
  lastSavedAt?: string;
}
