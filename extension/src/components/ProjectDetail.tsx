import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Layers, Globe, Pin, Trash2, Edit2, Plus, X } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { NotesScratchpad } from './NotesScratchpad';

export const ProjectDetail: React.FC = () => {
  const { 
    selectedProject, 
    selectedSnapshot, 
    selectProject, 
    restoreProjectWorkspace, 
    deleteProject,
    renameProject,
    addTabToSnapshot,
    removeTabFromSnapshot,
    isRestoring 
  } = useWorkspaceStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // New tab state
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  if (!selectedProject) return null;

  const handleStartRename = () => {
    setNameInput(selectedProject.name);
    setIsEditingName(true);
  };

  const handleSaveRename = () => {
    if (nameInput.trim()) {
      renameProject(selectedProject.id, nameInput.trim());
    }
    setIsEditingName(false);
  };

  const handleAddTabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    await addTabToSnapshot(selectedProject.id, newUrl.trim(), newTitle.trim() || undefined);
    setNewUrl('');
    setNewTitle('');
    setIsAddingTab(false);
  };

  const tabs = selectedSnapshot?.windows?.[0]?.tabs || [];
  const groups = selectedSnapshot?.tabGroups || [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 space-y-4">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => selectProject(null)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>All Projects</span>
        </button>

        <button
          onClick={() => deleteProject(selectedProject.id)}
          className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          title="Delete Project"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Project Header Info */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span 
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: getProjectColorHex(selectedProject.color) }}
            />

            {isEditingName ? (
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleSaveRename}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                autoFocus
                className="text-base font-bold bg-muted px-2 py-0.5 rounded border border-border text-foreground focus:outline-none"
              />
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">
                  {selectedProject.name}
                </h2>
                <button
                  onClick={handleStartRename}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedProject.description && (
          <p className="text-xs text-muted-foreground">
            {selectedProject.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-muted-foreground" />
              {selectedProject.tabsCount || tabs.length} tabs
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-muted-foreground" />
              {selectedProject.groupsCount || groups.length} groups
            </span>
          </div>

          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(selectedProject.lastSnapshotTime || selectedProject.updatedAt)}
          </span>
        </div>

        {/* Restore Action */}
        <button
          onClick={() => restoreProjectWorkspace(selectedProject.id)}
          disabled={isRestoring || tabs.length === 0}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isRestoring ? 'Restoring in New Window...' : 'Restore Workspace'}
        </button>
      </div>

      {/* Tabs List Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Saved Tabs ({tabs.length})
          </h3>

          <button
            onClick={() => setIsAddingTab(!isAddingTab)}
            className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Tab</span>
          </button>
        </div>

        {/* Inline Add Tab Form */}
        {isAddingTab && (
          <form onSubmit={handleAddTabSubmit} className="bg-card border border-border p-3 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Add Tab to Workspace</span>
              <button 
                type="button" 
                onClick={() => setIsAddingTab(false)} 
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="https://github.com/..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
              autoFocus
              className="w-full px-2.5 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
            />

            <input
              type="text"
              placeholder="Tab Title (Optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingTab(false)}
                className="px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newUrl.trim()}
                className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
              >
                Add Tab
              </button>
            </div>
          </form>
        )}

        {tabs.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
            No snapshot tabs available. Click "Add Tab" or "Update Workspace" to add tabs.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border/60 max-h-48 overflow-y-auto">
            {tabs.map((tab, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between gap-2 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {tab.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                  <span className="text-xs text-foreground font-medium truncate" title={tab.title}>
                    {tab.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[100px]">
                    {getDomainFromUrl(tab.url)}
                  </span>
                  
                  <button
                    onClick={() => removeTabFromSnapshot(selectedProject.id, idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                    title="Remove tab from snapshot"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes Scratchpad */}
      <NotesScratchpad projectId={selectedProject.id} />
    </div>
  );
};

function getProjectColorHex(color: string): string {
  const colors: Record<string, string> = {
    purple: '#a855f7',
    indigo: '#6366f1',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    cyan: '#06b6d4'
  };
  return colors[color] || '#a855f7';
}

function getDomainFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url;
  }
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} d ago`;
}
