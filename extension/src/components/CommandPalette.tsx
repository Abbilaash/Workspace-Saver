import React, { useState, useEffect } from 'react';
import { Search, Folder, Play, Plus, Save, X } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setCommandPaletteOpen, 
    projects, 
    selectProject,
    restoreProjectWorkspace,
    saveCurrentWorkspace,
    setCreateModalOpen,
    deleteProject
  } = useWorkspaceStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-10 px-4 z-50 animate-in fade-in duration-100">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Command Search Bar */}
        <div className="flex items-center px-3 py-2.5 border-b border-border bg-muted/40">
          <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-border/40">
          {/* Quick Actions */}
          <div className="py-1">
            <span className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Quick Actions
            </span>

            <button
              onClick={() => {
                setCommandPaletteOpen(false);
                setCreateModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-foreground hover:bg-accent transition-colors text-left"
            >
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              <span>Create New Project</span>
            </button>

            <button
              onClick={() => {
                setCommandPaletteOpen(false);
                saveCurrentWorkspace();
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-foreground hover:bg-accent transition-colors text-left"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Current Workspace</span>
            </button>
          </div>

          {/* Projects */}
          <div className="py-1">
            <span className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Projects ({filteredProjects.length})
            </span>

            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-accent transition-colors group cursor-pointer"
                onClick={() => {
                  setCommandPaletteOpen(false);
                  selectProject(p.id);
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="text-xs font-medium text-foreground truncate">{p.name}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommandPaletteOpen(false);
                    restoreProjectWorkspace(p.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
