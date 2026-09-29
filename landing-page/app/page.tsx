import React from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { Hero } from '@/components/hero/Hero';
import { ScreenshotShowcase } from '@/components/screenshots/ScreenshotShowcase';
import { ProblemSection } from '@/components/problem/ProblemSection';
import { HowItWorks } from '@/components/how-it-works/HowItWorks';
import { FeatureShowcase } from '@/components/features/FeatureShowcase';
import { WorkspaceAnatomy } from '@/components/workspace-anatomy/WorkspaceAnatomy';
import { UseCases } from '@/components/use-cases/UseCases';
import { TypographyBanner } from '@/components/typography-banner/TypographyBanner';
import { FinalCTA } from '@/components/final-cta/FinalCTA';
import { Footer } from '@/components/footer/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Floating Navbar */}
      <Navbar />

      {/* Hero Section with 3D Workspace Visualization */}
      <Hero />

      {/* Product Demo / Interactive Screenshots */}
      <ScreenshotShowcase />

      {/* Problem Section & Before/After Comparison */}
      <ProblemSection />

      {/* How It Works (01 Save, 02 Switch, 03 Restore) */}
      <HowItWorks />

      {/* Feature Showcase Grid */}
      <FeatureShowcase />

      {/* Interactive Workspace Anatomy Diagram */}
      <WorkspaceAnatomy />

      {/* Use Cases */}
      <UseCases />

      {/* Made For Context Switching Animated Banner */}
      <TypographyBanner />

      {/* Final Call To Action */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
