'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, Layers, Sparkles, Chrome } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-24 md:py-36 relative overflow-hidden">
      {/* Background radial spotlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-indigo-500/30 bg-slate-900/80 p-8 sm:p-14 text-center space-y-8 backdrop-blur-2xl shadow-2xl shadow-indigo-950/50 relative overflow-hidden"
        >
          {/* Subtle backdrop grid */}
          <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

          {/* Badge */}
          <Badge variant="indigo" className="gap-2 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready For Browser Productivity</span>
          </Badge>

          {/* Heading */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your next project <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300">
                is already waiting.
              </span>
            </h2>
            <p className="text-base sm:text-xl text-slate-300 font-medium">
              Save the context. Keep the momentum.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" variant="primary" className="shadow-indigo-600/40 text-base gap-2.5 px-8 py-4 group">
              <Chrome className="w-5 h-5" />
              <span>Get Workspace Saver</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Guarantee Note */}
          <div className="text-xs font-mono text-slate-500 pt-2">
            Free & open source extension · Local-First IndexDB · Zero telemetry
          </div>
        </motion.div>
      </div>
    </section>
  );
}
