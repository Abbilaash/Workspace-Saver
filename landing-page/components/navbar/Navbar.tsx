'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Layers, Bookmark, ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pb-2 pointer-events-none"
    >
      <nav
        className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 py-2.5 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'glass-panel shadow-2xl shadow-indigo-950/20 border-slate-800/80 bg-slate-950/80'
            : 'bg-slate-950/40 border border-slate-800/40 backdrop-blur-md'
        }`}
      >
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-indigo-500/20">
            <Layers className="w-4 h-4 transition-transform group-hover:scale-110" />
          </div>
          <span className="font-bold tracking-tight text-slate-100 text-sm md:text-base group-hover:text-indigo-300 transition-colors">
            Workspace Saver
          </span>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-100 transition-colors">How it works</a>
          <a href="#anatomy" className="hover:text-slate-100 transition-colors">Anatomy</a>
          <a href="#use-cases" className="hover:text-slate-100 transition-colors">Use Cases</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com/Abbilaash/Workspace-Saver"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors rounded-lg hover:bg-slate-800/50"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <Button size="sm" variant="primary" className="text-xs gap-1.5 shadow-indigo-500/20">
            <span>Get Extension</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}
