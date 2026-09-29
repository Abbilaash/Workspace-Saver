'use client';

import React from 'react';
import { ArrowLeft, Play, Globe, Folder, FileText, Clock, ExternalLink, Bookmark } from 'lucide-react';

export function ProjectDetailsMockup() {
  const tabGroups = [
    { name: 'Core Backend', color: '#6366f1', count: 5 },
    { name: 'Documentation', color: '#a855f7', count: 4 },
    { name: 'AWS Cloud', color: '#3b82f6', count: 3 }
  ];

  const sampleTabs = [
    { title: 'AWS Lambda Execution Handler', domain: 'console.aws.amazon.com', group: 'AWS Cloud' },
    { title: 'Formicx Microservice Spec', domain: 'github.com/formicx', group: 'Core Backend' },
    { title: 'Python Asyncio & Motor MongoDB', domain: 'docs.python.org', group: 'Documentation' }
  ];

  return (
    <div className="w-[360px] h-[520px] bg-[#0b0e17] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden font-sans select-none">
      {/* Detail Header */}
      <div className="px-4 py-3 bg-[#111625] border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-xs tracking-tight text-white">Formicx Microservices</span>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
      </div>

      {/* Hero Project Action Box */}
      <div className="p-4 bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Saved 4 mins ago</span>
          </div>
          <span>12 tabs · 3 groups</span>
        </div>

        <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Restore Entire Workspace</span>
        </button>
      </div>

      {/* Tabs & Groups Section */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Tab Groups Chips */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
            Preserved Tab Groups
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tabGroups.map((g, idx) => (
              <div
                key={idx}
                className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-medium flex items-center gap-1.5 text-slate-300"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                <span>{g.name}</span>
                <span className="text-slate-500 font-mono text-[10px]">({g.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab List */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
            Captured Tabs & Positions
          </div>
          <div className="space-y-1.5">
            {sampleTabs.map((t, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Globe className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-medium text-slate-200 truncate">{t.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{t.domain}</div>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Markdown Project Notes */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-semibold flex items-center gap-1">
            <FileText className="w-3 h-3 text-indigo-400" />
            <span>Project Notes (Markdown)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed space-y-1">
            <div className="text-indigo-300 font-bold"># Current Sprint Task</div>
            <div>Implement async Lambda execution for sync worker.</div>
            <div className="text-slate-400 font-bold pt-1">## Next Step</div>
            <div className="text-slate-400">Test container deployment on Render.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
