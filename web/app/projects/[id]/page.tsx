import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchProject, fetchSnapshots, fetchNote } from '../../../lib/api';
import { ArrowLeft, Globe, Layers, Clock, Pin, FileText } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const [project, snapshots, note] = await Promise.all([
    fetchProject(id),
    fetchSnapshots(id),
    fetchNote(id)
  ]);

  if (!project) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="border border-border rounded-xl p-8 text-center text-xs text-muted-foreground">
          Project not found or server unavailable.
        </div>
      </div>
    );
  }

  const latestSnapshot = snapshots[0];
  const tabs = latestSnapshot?.windows?.[0]?.tabs || [];
  const groups = latestSnapshot?.tab_groups || [];

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full shadow-sm"
            style={{ backgroundColor: getProjectColorHex(project.color) }}
          />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {project.name}
          </h1>
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-muted-foreground" />
              {project.tabs_count || tabs.length} tabs
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-muted-foreground" />
              {project.groups_count || groups.length} groups
            </span>
          </div>

          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            Last saved {formatRelativeTime(project.last_snapshot_time || project.updated_at)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Saved Tabs */}
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            Saved Tabs ({tabs.length})
          </h2>

          <div className="bg-card border border-border rounded-xl divide-y divide-border/60">
            {tabs.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No tabs snapshot recorded.
              </div>
            ) : (
              tabs.map((tab, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-muted/30">
                  <div className="flex items-center gap-2 min-w-0">
                    {tab.pinned && <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    <a
                      href={tab.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-foreground font-medium hover:text-purple-400 transition-colors truncate"
                    >
                      {tab.title}
                    </a>
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                    {getDomainFromUrl(tab.url)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Project Notes */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Project Notes
          </h2>

          <div className="bg-card border border-border rounded-xl p-4 min-h-[200px] text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">
            {note?.content ? note.content : <span className="text-muted-foreground italic font-sans">No project notes written.</span>}
          </div>
        </div>
      </div>
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
