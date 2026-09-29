'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import {
  TabGroupsVisual,
  ScrollPositionVisual,
  SelectedTextVisual,
  ProjectNotesVisual,
  OneClickRestoreVisual,
  LocalFirstVisual
} from './FeatureCardVisuals';
import { FolderGit2, MousePointerClick, Type, FileCode, Zap, Shield } from 'lucide-react';

export function FeatureShowcase() {
  const features = [
    {
      title: 'Native Tab Groups',
      desc: 'Preserve native browser tab group names, colors, and hierarchical organization.',
      icon: FolderGit2,
      visual: <TabGroupsVisual />
    },
    {
      title: 'Scroll Position Recall',
      desc: 'Return to the exact line or paragraph you were reading when you last saved.',
      icon: MousePointerClick,
      visual: <ScrollPositionVisual />
    },
    {
      title: 'Selected Text Memory',
      desc: 'Remember the important text passage or snippet you highlighted before switching tasks.',
      icon: Type,
      visual: <SelectedTextVisual />
    },
    {
      title: 'Embedded Project Notes',
      desc: 'Leave yourself markdown context breadcrumbs attached directly to each project.',
      icon: FileCode,
      visual: <ProjectNotesVisual />
    },
    {
      title: 'One-Click Restore',
      desc: 'Recreate your entire multi-tab workspace in a fresh window in 0 milliseconds.',
      icon: Zap,
      visual: <OneClickRestoreVisual />
    },
    {
      title: 'Local-First Privacy',
      desc: 'Your workspace is fully functional and saved locally even without an account.',
      icon: Shield,
      visual: <LocalFirstVisual />
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge variant="indigo">Deep Context Preservation</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            More than saved tabs.
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Workspace Saver preserves your entire mental state so you pick up right where you left off.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card interactive className="h-full flex flex-col justify-between space-y-5 bg-slate-900/50 border-slate-800/80">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>

                  {feat.visual}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
