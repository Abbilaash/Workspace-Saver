'use client';

import React from 'react';
import { Layers, Search, RefreshCw, FolderPlus, Play, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export function ProjectListMockup() {
  const projects = [
    {
      id: 'p1',
      name: 'Formicx Microservices',
      tabsCount: 12,
      groupsCount: 3,
      color: '#6366f1',
      updated: '4 mins ago',
      active: true,
      hasNotes: true
    },
    {
      id: 'p2',
      name: 'Quantum Research Paper',
      tabsCount: 8,
      groupsCount: 2,
      color: '#a855f7',
      updated: '2 hours ago',
      active: false,
      hasNotes: true
    },
    {
      id: 'p3',
      name: 'Cloud Computing Infrastructure',
      tabsCount: 15,
      groupsCount: 4,
      color: '#3b82f6',
      updated: 'Yesterday',
      active: false,
      hasNotes: false
    },
    {
      id: 'p4',
      name: 'AI Agent Architecture',
      tabsCount: 6,
      groupsCount: 1,
      color: '#10b981',
      updated: '3 days ago',
      active: false,
      hasNotes: true
    }
  ];

  return (
    <div className="w-[360px] h-[520px] bg-[#0b0e17] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden font-sans select-none">
      {/* Extension Header */}
      <div className="px-4 py-3 bg-[#111625] border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs tracking-tight text-white">Workspace Saver</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">v1.0</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Current Active Workspace Bar */}
      <div className="px-4 py-2.5 bg-indigo-950/40 border-b border-indigo-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-300">Active Workspace:</span>
          <span className="text-[11px] font-bold text-indigo-300">Formicx</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">12 tabs</span>
      </div>

      {/* Search & Actions */}
      <div className="p-3 border-b border-slate-800/60 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            readOnly
            value=""
            placeholder="Search projects..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <button className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1">
          <FolderPlus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-1 font-semibold">
          Saved Projects ({projects.length})
        </div>

        {projects.map((p) => (
          <div
            key={p.id}
            className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              p.active
                ? 'bg-slate-900/90 border-indigo-500/50 shadow-lg shadow-indigo-950/40'
                : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: p.color }}
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {p.name}
                  </span>
                  {p.hasNotes && <FileText className="w-3 h-3 text-slate-400" />}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{p.tabsCount} tabs</span>
                  <span>•</span>
                  <span>{p.groupsCount} groups</span>
                  <span>•</span>
                  <span>{p.updated}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all">
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer bar */}
      <div className="p-3 bg-[#0d101a] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Offline Local First</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Synced</span>
        </span>
      </div>
    </div>
  );
}
