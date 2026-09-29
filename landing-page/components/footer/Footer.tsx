'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm">Workspace Saver</div>
            <div className="text-slate-500">Save your workspace. Keep your context.</div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
          <a href="/#features" className="hover:text-slate-100 transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-slate-100 transition-colors">How it works</a>
          <a href="https://github.com/Abbilaash/Workspace-Saver" target="_blank" rel="noopener noreferrer" className="hover:text-slate-100 transition-colors flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <Link href="/privacy" className="hover:text-slate-100 transition-colors">Privacy</Link>
        </div>

        {/* Copyright */}
        <div className="font-mono text-slate-500">
          © {new Date().getFullYear()} Workspace Saver. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
