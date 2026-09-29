'use client';

import React, { useState } from 'react';
import { Bookmark, Plus, Check, Layers, Sparkles, Folder } from 'lucide-react';

export function SaveWorkspaceMockup() {
  const [selected, setSelected] = useState('p1');

  const options = [
    { id: 'p1', name: 'Formicx Microservices', color: '#6366f1', tabs: 12 },
    { id: 'p2', name: 'Quantum Research Paper', color: '#a855f7', tabs: 8 },
    { id: 'p3', name: 'Cloud Computing Infrastructure', color: '#3b82f6', tabs: 15 }
  ];

  return (
    <div className="w-[360px] h-[520px] bg-[#0b0e17] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden font-sans select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-[#111625] border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-xs tracking-tight text-white">Save Current Workspace</span>
        </div>
        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
          Ready
        </span>
      </div>

      {/* Captured Summary Banner */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 space-y-2">
        <div className="text-xs text-slate-300 font-medium">Captured Browser State:</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <div className="text-base font-bold text-indigo-400">12</div>
            <div className="text-[10px] text-slate-500 font-mono">Open Tabs</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <div className="text-base font-bold text-purple-400">3</div>
            <div className="text-[10px] text-slate-500 font-mono">Tab Groups</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <div className="text-base font-bold text-emerald-400">100%</div>
            <div className="text-[10px] text-slate-500 font-mono">Context</div>
          </div>
        </div>
      </div>

      {/* Choose Project Options */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Target Project Destination
        </div>

        <div className="space-y-2">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selected === opt.id
                  ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/30'
                  : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.color }} />
                <span className="text-xs font-semibold">{opt.name}</span>
              </div>
              {selected === opt.id && (
                <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>
          ))}

          {/* New project trigger */}
          <div className="p-3 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/60 text-slate-400 hover:text-indigo-300 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-medium bg-slate-950/30">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Project</span>
          </div>
        </div>
      </div>

      {/* Save Action Footer */}
      <div className="p-4 bg-[#0d101a] border-t border-slate-800 space-y-2">
        <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Save Workspace Snapshot</span>
        </button>
      </div>
    </div>
  );
}
