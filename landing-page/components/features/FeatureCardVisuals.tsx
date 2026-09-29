'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Micro Visual 1: Tab Groups
export function TabGroupsVisual() {
  return (
    <div className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col justify-center space-y-2 font-mono text-xs select-none">
      <div className="flex items-center gap-2">
        <div className="px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>Core Backend</span>
          <span className="text-[9px] text-slate-400">(5)</span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span>Documentation</span>
          <span className="text-[9px] text-slate-400">(4)</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="px-2.5 py-1 rounded-md bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[11px] font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span>AWS Console</span>
          <span className="text-[9px] text-slate-400">(3)</span>
        </div>
      </div>
    </div>
  );
}

// Micro Visual 2: Scroll Position (Animated Scroll Document)
export function ScrollPositionVisual() {
  return (
    <div className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col justify-between font-mono text-[10px] text-slate-400 overflow-hidden select-none relative">
      <div className="space-y-1">
        <div className="text-slate-200 font-bold">Introduction to Lambda Exec</div>
        <div className="w-full h-1 bg-slate-800 rounded" />
        <div className="w-4/5 h-1 bg-slate-800 rounded" />
      </div>

      {/* Animated YOU WERE HERE Marker */}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="px-2.5 py-1 rounded bg-indigo-600/30 border border-indigo-500/60 text-indigo-300 font-bold text-center shadow-lg shadow-indigo-600/20"
      >
        📍 SCROLL RECALLED: LINE 142
      </motion.div>

      <div className="space-y-1">
        <div className="w-full h-1 bg-slate-800 rounded" />
        <div className="w-2/3 h-1 bg-slate-800 rounded" />
      </div>
    </div>
  );
}

// Micro Visual 3: Selected Text Highlight
export function SelectedTextVisual() {
  return (
    <div className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col justify-center font-sans text-xs text-slate-300 select-none space-y-1.5">
      <div className="text-[10px] font-mono text-slate-500 uppercase">Saved Highlight</div>
      <p className="text-[11px] leading-relaxed">
        "Use <span className="bg-indigo-500/30 text-indigo-200 font-medium px-1.5 py-0.5 rounded border border-indigo-500/40">load_dotenv() explicitly in config.py</span> to ensure Atlas connection strings evaluate."
      </p>
    </div>
  );
}

// Micro Visual 4: Project Notes (Markdown)
export function ProjectNotesVisual() {
  return (
    <div className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col justify-center font-mono text-[11px] text-slate-300 select-none space-y-1">
      <div className="text-indigo-400 font-bold"># Sprint Tasks</div>
      <div className="flex items-center gap-1.5 text-slate-300">
        <span className="text-emerald-400 font-bold">✓</span>
        <span>Configure MongoDB Atlas URL</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-400">
        <span className="text-amber-400 font-bold">⏱</span>
        <span>Deploy container to Render</span>
      </div>
    </div>
  );
}

// Micro Visual 5: One-Click Restore
export function OneClickRestoreVisual() {
  return (
    <div className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col items-center justify-center font-mono text-xs select-none space-y-2">
      <div className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30">
        <span>Restore Workspace</span>
      </div>
      <div className="text-[10px] text-emerald-400">⚡ 0ms Instant Reopen</div>
    </div>
  );
}

// Micro Visual 6: Local First
export function LocalFirstVisual() {
  return (
    <div className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col items-center justify-center font-mono text-xs select-none space-y-1.5 text-center">
      <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
        🔒 100% Offline IndexedDB
      </div>
      <div className="text-[11px] text-slate-400">Zero Cloud Account Required</div>
    </div>
  );
}
