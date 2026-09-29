'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, RefreshCw, Layers, Sparkles, X } from 'lucide-react';

export function BeforeAfterComparison() {
  const [view, setView] = useState<'before' | 'after'>('after');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Toggle Segmented Switch */}
      <div className="flex justify-center">
        <div className="p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setView('before')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              view === 'before'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Before (Tab Chaos)</span>
          </button>

          <button
            onClick={() => setView('after')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              view === 'after'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>After (Workspace Saver)</span>
          </button>
        </div>
      </div>

      {/* Main Display Container */}
      <div className="relative min-h-[360px] rounded-3xl border border-slate-800 bg-slate-950/80 p-6 md:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {view === 'before' ? (
            <motion.div
              key="before"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-rose-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                    27
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-rose-200">27 Unorganized Open Tabs</h3>
                    <p className="text-xs text-rose-400/80 font-mono">High Memory & Cognitive Overhead</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Context Lost
                </span>
              </div>

              {/* Chaos Tab Bar Preview */}
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-rose-950/60 space-y-2">
                <div className="flex flex-wrap gap-1.5 opacity-80">
                  {['AWS EC2', 'GitHub PR #42', 'StackOverflow', 'Python Docs', 'Medium Article', 'Jira Board', 'Figma Design', 'Slack Web', 'Gmail', 'ChatGPT', 'Reddit Thread', 'YouTube Tutorial'].map((t, idx) => (
                    <div key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-rose-500/20 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="truncate max-w-[90px]">{t}</span>
                      <X className="w-3 h-3 text-rose-400/60" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pain Point Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs text-rose-300">
                  ❌ Close tabs to switch tasks $\rightarrow$ lose scroll position & selected text.
                </div>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs text-rose-300">
                  ❌ Spend 15 minutes digging through browser history to reopen context.
                </div>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs text-rose-300">
                  ❌ Mixed project tabs cluttering a single browser window.
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-indigo-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">4 Organized Project Workspaces</h3>
                    <p className="text-xs text-indigo-300 font-mono">Instant 0ms One-Click Restoration</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Context Preserved</span>
                </span>
              </div>

              {/* Clean Projects Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Formicx Backend', tabs: '12 tabs · 3 groups', color: '#6366f1' },
                  { name: 'Quantum Research', tabs: '8 tabs · 2 groups', color: '#a855f7' },
                  { name: 'Cloud Infrastructure', tabs: '15 tabs · 4 groups', color: '#3b82f6' },
                  { name: 'AI Architecture', tabs: '6 tabs · 1 group', color: '#10b981' }
                ].map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                      <div>
                        <div className="text-xs font-bold text-slate-100">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.tabs}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                      Restorable
                    </span>
                  </div>
                ))}
              </div>

              {/* Success Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200">
                  ✨ Native tab groups, names & colors preserved exactly as created.
                </div>
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200">
                  ✨ Exact scroll positions & selected text recalled on page reload.
                </div>
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-950/40 text-xs text-indigo-200">
                  ✨ Embedded Markdown project notes attached to every workspace.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
