'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Layers, FolderGit2, MousePointerClick, Type, FileCode, Globe, Sparkles } from 'lucide-react';

export function WorkspaceAnatomy() {
  const [activeNode, setActiveNode] = useState<string>('groups');

  const nodes = [
    {
      id: 'tabs',
      title: 'Captured Tabs',
      icon: Globe,
      color: '#3b82f6',
      x: 15,
      y: 25,
      desc: 'Stores exact URL parameters, favicons, titles, and active window indexing.'
    },
    {
      id: 'groups',
      title: 'Native Tab Groups',
      icon: FolderGit2,
      color: '#6366f1',
      x: 85,
      y: 25,
      desc: 'Preserves browser tab group names, colors, collapsed state, and structural hierarchy.'
    },
    {
      id: 'scroll',
      title: 'Scroll Offset',
      icon: MousePointerClick,
      color: '#a855f7',
      x: 10,
      y: 75,
      desc: 'Remembers exact Y-axis scroll pixel positions for long documentation and papers.'
    },
    {
      id: 'selection',
      title: 'Selected Text',
      icon: Type,
      color: '#ec4899',
      x: 90,
      y: 75,
      desc: 'Stores text highlights so you jump back to the exact passage you were examining.'
    },
    {
      id: 'notes',
      title: 'Project Notes',
      icon: FileCode,
      color: '#10b981',
      x: 50,
      y: 90,
      desc: 'Attached markdown notepad to leave task reminders and sprint context for next time.'
    }
  ];

  const currentDetails = nodes.find((n) => n.id === activeNode) || nodes[1];

  return (
    <section id="anatomy" className="py-20 md:py-28 relative overflow-hidden bg-slate-950/40 border-y border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge variant="indigo">Interactive Anatomy</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Anatomy of a Saved Workspace.
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Hover over any element node below to inspect how Workspace Saver captures full context.
          </p>
        </div>

        {/* Diagram Canvas */}
        <div className="relative w-full max-w-3xl mx-auto min-h-[420px] rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* Subtle connecting lines backdrop */}
          <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

          {/* Central Workspace Core Node */}
          <div className="relative z-10 my-auto flex flex-col items-center text-center py-8">
            
            <div className="relative mb-6">
              {/* Central Core Circle */}
              <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-600/30">
                <Layers className="w-10 h-10 animate-pulse" />
              </div>
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-xl pointer-events-none" />
            </div>

            <div className="text-xl font-bold text-white mb-1">Browser Workspace Project</div>
            <div className="text-xs text-indigo-300 font-mono">Combined Context Snapshot</div>

            {/* Interactive Node Selector Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {nodes.map((node) => {
                const Icon = node.icon;
                const isActive = activeNode === node.id;
                return (
                  <button
                    key={node.id}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onClick={() => setActiveNode(node.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400 scale-105'
                        : 'bg-slate-950/80 text-slate-400 hover:text-slate-100 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: isActive ? '#ffffff' : node.color }} />
                    <span>{node.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Floating Detail Card */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDetails.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 flex items-start gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: `${currentDetails.color}25`, border: `1px solid ${currentDetails.color}50` }}
                >
                  <currentDetails.icon className="w-5 h-5" style={{ color: currentDetails.color }} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{currentDetails.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      Captured
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentDetails.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
