'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Globe, Shield, CheckCircle2, FileText, ArrowUpRight, Lock, RotateCw } from 'lucide-react';

export function BrowserMockupHero() {
  const tabs = [
    { title: 'AWS Lambda Handler', group: 'AWS Infra', color: '#3b82f6' },
    { title: 'Formicx Microservices Spec', group: 'Core Backend', color: '#6366f1' },
    { title: 'Async Python & Motor DB', group: 'Docs', color: '#a855f7' },
    { title: 'Render Deployment Log', group: 'AWS Infra', color: '#3b82f6' }
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl border border-indigo-500/20 bg-slate-950/80 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl overflow-hidden">
      {/* Background ambient technical grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Browser Chrome Bar */}
      <div className="px-4 py-3 bg-[#0c0f1a] border-b border-slate-800/80 flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-md bg-[#07090e] border border-slate-800/80 rounded-lg px-3 py-1 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span className="truncate text-slate-300">workspace://formicx-microservices</span>
          </div>
          <RotateCw className="w-3 h-3 text-slate-500 flex-shrink-0" />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Preserved</span>
        </div>
      </div>

      {/* Browser Content Viewport */}
      <div className="p-6 md:p-10 relative z-10 space-y-6">
        
        {/* Native Tab Groups Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Core Backend</span>
              <span className="text-[10px] text-slate-400 font-mono">(5 tabs)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Documentation</span>
              <span className="text-[10px] text-slate-400 font-mono">(4 tabs)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>AWS Infrastructure</span>
              <span className="text-[10px] text-slate-400 font-mono">(3 tabs)</span>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400">Total: 12 Tabs</span>
        </div>

        {/* Central Workspace Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Main Active Project Card */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Formicx Microservices Workspace</h3>
                  <p className="text-xs text-slate-400 font-mono">Last saved 4 minutes ago</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Context Saved
              </span>
            </div>

            {/* Captures Pill Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-indigo-400">12 Tabs</div>
                <div className="text-[10px] text-slate-500">Indexed</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-purple-400">3 Groups</div>
                <div className="text-[10px] text-slate-500">Color Coded</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-emerald-400">0ms</div>
                <div className="text-[10px] text-slate-500">Restore Speed</div>
              </div>
            </div>
          </div>

          {/* Attached Markdown Notes Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-indigo-300 font-bold border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Project Notes</span>
              </div>
              <span className="text-[10px] text-slate-500">Markdown</span>
            </div>
            
            <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
              <div className="text-indigo-400 font-bold"># Current Task</div>
              <div>Implement async Lambda execution for sync worker.</div>
              <div className="text-slate-400 pt-1 font-semibold">## Next Step</div>
              <div className="text-slate-400">Test container deployment.</div>
            </div>
          </div>
        </div>

        {/* Tab Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {tabs.map((tab, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <Globe className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate text-slate-200 font-medium">{tab.title}</span>
              </div>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tab.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
