'use client';

import React from 'react';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { Badge } from '../ui/Badge';

export function ProblemSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge variant="amber">The Universal Developer Pain Point</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Your tabs aren't the problem. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300">
              Losing your context is.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Switching tasks normally requires closing browser windows, losing tab groups, forgetting scroll offsets, and rebuilding your mental model from scratch.
          </p>
        </div>

        {/* Interactive Comparison Component */}
        <BeforeAfterComparison />
      </div>
    </section>
  );
}
