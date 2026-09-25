export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  tabs_count?: number;
  groups_count?: number;
  last_snapshot_time?: string;
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
  tabs: WorkspaceTab[];
}

export interface TabGroupSnapshot {
  id: number;
  title: string;
  color: string;
  collapsed?: boolean;
}

export interface WorkspaceSnapshot {
  id: string;
  project_id: string;
  created_at: string;
  windows: WorkspaceWindow[];
  tab_groups?: TabGroupSnapshot[];
  tabs_count: number;
  groups_count: number;
}

export interface ProjectNote {
  project_id: string;
  content: string;
  updated_at: string;
}
