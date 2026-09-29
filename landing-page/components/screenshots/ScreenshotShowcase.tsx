'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExtensionMockup } from './ExtensionMockup';
import { ProjectListMockup } from './ProjectListMockup';
import { ProjectDetailsMockup } from './ProjectDetailsMockup';
import { SaveWorkspaceMockup } from './SaveWorkspaceMockup';
import { Badge } from '../ui/Badge';
import { LayoutList, FileText, BookmarkPlus } from 'lucide-react';

export function ScreenshotShowcase() {
  const [activeTab, setActiveTab] = useState<'list' | 'details' | 'save'>('list');

  const tabs = [
    { id: 'list', label: 'Project List', icon: LayoutList, desc: 'Manage workspaces at a glance' },
    { id: 'details', label: 'Project Details', icon: FileText, desc: 'Inspect tabs, groups & notes' },
    { id: 'save', label: 'Save Flow', icon: BookmarkPlus, desc: 'Capture active browser context' }
  ];

  return (
    <section id="preview" className="py-20 md:py-28 relative overflow-hidden bg-slate-950/40 border-y border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <Badge variant="indigo">Interactive UI Showcase</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Your workspace, preserved.
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Everything you need to get back into the flow — tabs, native tab groups, scroll offsets, and project notes.
          </p>
        </div>

        {/* Tab Selector Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Mockup Container */}
        <ExtensionMockup>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'list' && <ProjectListMockup />}
              {activeTab === 'details' && <ProjectDetailsMockup />}
              {activeTab === 'save' && <SaveWorkspaceMockup />}
            </motion.div>
          </AnimatePresence>
        </ExtensionMockup>
      </div>
    </section>
  );
}
