'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function TypographyBanner() {
  const words = ['Save it.', 'Close it.', 'Forget it.', 'Restore it.', 'Continue.'];

  return (
    <section className="py-24 md:py-36 relative overflow-hidden bg-slate-950/80 border-y border-indigo-500/20">
      {/* Ambience glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
        
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-indigo-400 uppercase">
            Context Switching Defined
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Stop rebuilding your workspace.
          </h2>
        </motion.div>

        {/* Staggered Animated Words Pipeline */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-4">
          {words.map((w, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight ${
                idx === words.length - 1
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 shadow-sm'
                  : 'text-slate-300'
              }`}
            >
              {w}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
