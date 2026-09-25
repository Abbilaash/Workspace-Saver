import React from 'react';
import Link from 'next/link';
import { fetchProjects } from '../../lib/api';
import { Layers, Globe, Clock, ArrowRight, FolderKanban, Settings, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  searchParams?: Promise<{ user_id?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const userId = resolvedSearchParams?.user_id;
  const projects = await fetchProjects(userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Saved Projects & Workspaces
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            {userId ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
                <UserCheck className="w-3.5 h-3.5" /> Paired with User ID: {userId.slice(0, 8)}...
              </span>
            ) : (
              'Cloud synced workspaces from your Workspace Saver extension'
            )}
          </p>
        </div>

        <Link
          href="/settings"
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center space-y-3 bg-card/40">
          <FolderKanban className="w-8 h-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">No Synced Projects Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Open the Workspace Saver browser extension, enter your Name & Email on first launch, and click <strong>Save Workspace</strong> to view your projects here.
          </p>
          <div className="pt-2">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:underline"
            >
              <Settings className="w-3.5 h-3.5" />
              Configure Settings
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="group bg-card hover:bg-muted/40 border border-border rounded-xl p-4 transition-all shadow-xs hover:border-border/80"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: getProjectColorHex(p.color) }}
                  />
                  <h3 className="text-sm font-bold text-foreground group-hover:text-purple-400 transition-colors">
                    {p.name}
                  </h3>
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
              </div>

              {p.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {p.description}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    {p.tabs_count || 0} tabs
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                    {p.groups_count || 0} groups
                  </span>
                </div>

                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(p.last_snapshot_time || p.updated_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
  try {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    if (isNaN(diffMs)) return 'Recently';
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} d ago`;
  } catch {
    return 'Recently';
  }
}
