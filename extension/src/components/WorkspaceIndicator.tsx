import React from 'react';
import { Save, Plus, Layers, FolderKanban } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

export const WorkspaceIndicator: React.FC = () => {
  const { 
    currentWorkspace, 
    selectedProject, 
    saveCurrentWorkspace, 
    setCreateModalOpen,
    isSaving
  } = useWorkspaceStore();

  if (!currentWorkspace) return null;

  return (
    <div className="p-3.5 bg-card/80 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Current Workspace
        </span>

        <span className="text-xs text-muted-foreground font-mono">
          {currentWorkspace.tabsCount} tabs · {currentWorkspace.groupsCount} groups
        </span>
      </div>

      <div className="flex items-center gap-2">
        {selectedProject ? (
          <button
            onClick={() => saveCurrentWorkspace(selectedProject.id)}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-primary text-primary-foreground font-medium text-xs shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : `Update "${selectedProject.name}"`}
          </button>
        ) : (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-primary text-primary-foreground font-medium text-xs shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Save Workspace to Project
          </button>
        )}
      </div>
    </div>
  );
};
