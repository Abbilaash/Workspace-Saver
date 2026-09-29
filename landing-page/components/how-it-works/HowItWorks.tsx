'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { BookmarkCheck, MoveRight, RotateCcw, Check, Sparkles, Layers } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Save Workspace',
      subtitle: 'Capture active browser context',
      desc: 'One click snapshots open tabs, native tab group colors, scroll offsets, selected text, and markdown project notes into IndexedDB.',
      badge: 'Capture',
      color: '#6366f1',
      visual: (
        <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between font-mono text-xs select-none">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-indigo-400 font-bold flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Snapshotting...</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              100% Captured
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span>Open Tabs:</span>
              <span className="text-white font-bold">12 Tabs</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Native Tab Groups:</span>
              <span className="text-indigo-300 font-bold">3 Groups (Core, Cloud, Docs)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Scroll & Text Position:</span>
              <span className="text-emerald-300 font-bold">Saved</span>
            </div>
          </div>
          <div className="py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-center font-bold text-[11px]">
            Saved to "Formicx Microservices"
          </div>
        </div>
      )
    },
    {
      num: '02',
      title: 'Switch Context',
      subtitle: 'Clean browser state in 0 seconds',
      desc: 'Safely close your current project windows without fear of losing tabs. Focus on your new priority with a completely clean browser canvas.',
      badge: 'Isolate',
      color: '#a855f7',
      visual: (
        <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between font-mono text-xs select-none">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-purple-400 font-bold flex items-center gap-1.5">
              <MoveRight className="w-3.5 h-3.5" />
              <span>Clean Slate</span>
            </span>
            <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              0 RAM Leak
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-center space-y-1 my-auto">
            <div className="text-slate-200 font-bold">Workspace Safely Stored</div>
            <div className="text-[11px] text-slate-400">Tabs closed. Ready for next project.</div>
          </div>
          <div className="py-1.5 rounded-lg bg-slate-900 text-slate-400 text-center text-[11px] border border-slate-800">
            Current Active Tabs: 1
          </div>
        </div>
      )
    },
    {
      num: '03',
      title: 'Restore Workspace',
      subtitle: 'Pick up exactly where you left off',
      desc: 'Reopen your entire project inside a fresh browser window with tabs grouped, positioned, and scrolled to the exact paragraph you were inspecting.',
      badge: 'Reopen',
      color: '#10b981',
      visual: (
        <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between font-mono text-xs select-none">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restoring...</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>0ms Local</span>
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-200 truncate">AWS Lambda Execution Docs</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-slate-200 truncate">Formicx Spec Repository</span>
            </div>
          </div>
          <div className="py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-center font-bold text-[11px]">
            Workspace Restored in New Window!
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden bg-slate-950/60 border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge variant="indigo">Simple 3-Step Process</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            How Workspace Saver works.
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            No complicated workflows. Save your context in seconds, switch focus, and restore whenever you are ready.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-panel-interactive rounded-3xl p-6 flex flex-col justify-between space-y-6"
            >
              {/* Step Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold font-mono text-indigo-400/80">
                    {step.num}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {step.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-indigo-300 font-mono">{step.subtitle}</p>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Visual Card */}
              {step.visual}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
