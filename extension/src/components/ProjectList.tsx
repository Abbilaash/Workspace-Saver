import React from 'react';
import { Plus, Search, Play, MoreVertical, Layers, Globe, Clock, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { Project } from '../types';

export const ProjectList: React.FC = () => {
  const { 
    projects, 
    searchQuery, 
    setSearchQuery, 
    selectProject, 
    restoreProjectWorkspace, 
    deleteProject,
    setCreateModalOpen,
    isRestoring
  } = useWorkspaceStore();

  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-3.5 space-y-3">
      {/* Search & New Project Header */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-card border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Project Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
            <p className="text-xs text-muted-foreground">
              {searchQuery ? 'No matching projects found.' : 'No projects saved yet.'}
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="text-xs font-semibold text-purple-400 hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Create your first project
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-card hover:bg-muted/40 border border-border rounded-xl p-3 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              onClick={() => selectProject(project.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: getProjectColorHex(project.color) }}
                  />
                  <h3 className="text-xs font-semibold text-foreground truncate group-hover:text-purple-400 transition-colors">
                    {project.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => restoreProjectWorkspace(project.id)}
                    disabled={isRestoring}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-medium text-[11px] transition-colors"
                    title="Restore workspace in new window"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Restore
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {activeMenuId === project.id && (
                      <div className="absolute right-0 top-6 w-32 bg-card border border-border rounded-lg shadow-xl py-1 z-20">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            deleteProject(project.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 text-left"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-info */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-muted-foreground/80" />
                    {project.tabsCount || 0} tabs
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-muted-foreground/80" />
                    {project.groupsCount || 0} groups
                  </span>
                </div>

                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <Clock className="w-2.5 h-2.5" />
                  {formatRelativeTime(project.lastSnapshotTime || project.updatedAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
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
