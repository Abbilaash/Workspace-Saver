'use client';

import React from 'react';
import { Shield, Lock, RotateCw, Layers } from 'lucide-react';

export function ExtensionMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#07090e] shadow-2xl overflow-hidden">
      {/* Outer Browser Chrome Header Bar */}
      <div className="px-4 py-3 bg-[#0f131f] border-b border-slate-800 flex items-center justify-between gap-4">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        {/* URL Bar */}
        <div className="flex-1 max-w-lg bg-[#07090e] border border-slate-800/80 rounded-lg px-3 py-1 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span className="truncate text-slate-300">chrome-extension://workspace-saver</span>
          </div>
          <RotateCw className="w-3 h-3 text-slate-500 flex-shrink-0" />
        </div>

        {/* Extension Toolbar Icon */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-sm shadow-indigo-500/20">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Browser Viewport with Realistic Desktop Canvas & Extension Popup */}
      <div className="relative min-h-[580px] p-6 md:p-10 bg-tech-grid flex items-center justify-center overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/30 via-transparent to-purple-950/20 pointer-events-none" />

        {/* Realistic Extension Dropdown Container */}
        <div className="relative z-10 transition-all duration-300 transform hover:scale-[1.01]">
          {children}
        </div>
      </div>
    </div>
  );
}
