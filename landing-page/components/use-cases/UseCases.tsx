'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Code2, BookOpen, GraduationCap, Palette, Layers, Terminal } from 'lucide-react';

export function UseCases() {
  const cases = [
    {
      role: 'Developers',
      icon: Code2,
      tag: 'Engineering',
      color: '#6366f1',
      desc: 'Keep GitHub PRs, AWS consoles, local dev terminals, issue trackers, and API docs grouped by microservice project.',
      mockupTabs: ['GitHub PR #104', 'AWS CloudFormation', 'Postman API', 'FastAPI Docs']
    },
    {
      role: 'Researchers',
      icon: BookOpen,
      tag: 'Academia & Deep Work',
      color: '#a855f7',
      desc: 'Save 15+ arXiv pre-prints, PDF references, citation generators, and research markdown notes without losing your scroll position.',
      mockupTabs: ['Arxiv Paper v2', 'Nature Biotech', 'BibTeX Generator', 'Research Notes']
    },
    {
      role: 'Students',
      icon: GraduationCap,
      tag: 'Education',
      color: '#3b82f6',
      desc: 'Keep coursework, lecture slides, assignment portals, and study resources neatly segregated by course module.',
      mockupTabs: ['CS101 Canvas', 'Algorithm Slides', 'LeetCode Practice', 'Study Notes']
    },
    {
      role: 'Creators',
      icon: Palette,
      tag: 'Design & Content',
      color: '#10b981',
      desc: 'Separate inspiration moodboards, YouTube reference videos, asset libraries, and copy drafts into distinct project spaces.',
      mockupTabs: ['Figma Wireframes', 'Dribbble Moodboard', 'Unsplash Assets', 'Draft Copy']
    }
  ];

  return (
    <section id="use-cases" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge variant="indigo">Tailored Workflows</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built for heavy tab users.
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Whether you manage complex microservices, write academic papers, or design digital products.
          </p>
        </div>

        {/* 4 Use Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card interactive className="h-full flex flex-col justify-between space-y-5 bg-slate-900/40 border-slate-800">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: `${item.color}25`, border: `1px solid ${item.color}50` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: item.color }} />
                        </div>
                        <h3 className="text-xl font-bold text-white">{item.role}</h3>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Micro Browser Mockup */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-2 select-none">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800/60 text-[10px] text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                      <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      <span className="ml-auto text-slate-400 font-semibold">{item.role} Workspace</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {item.mockupTabs.map((tabTitle, tIdx) => (
                        <div
                          key={tIdx}
                          className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 truncate flex items-center gap-1.5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="truncate">{tabTitle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
