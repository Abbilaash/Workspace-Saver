import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { ShieldCheck, Lock, Database, UserCheck, EyeOff, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Workspace Saver',
  description: 'Understand how Workspace Saver handles browser tab data, user names, email addresses, and local privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      <Navbar />

      <article className="pt-32 pb-20 md:pt-40 md:pb-28 max-w-4xl mx-auto px-4 sm:px-6 flex-1 w-full space-y-12">
        {/* Header */}
        <div className="space-y-4 pb-8 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparency & Security</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-slate-400">
            Last Updated: September 30, 2026
          </p>
        </div>

        {/* Summary Banner */}
        <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3 backdrop-blur-xl">
          <h2 className="text-base font-bold text-indigo-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Core Privacy Commitment</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Workspace Saver is designed local-first. Your browser tab data, page titles, tab groups, scroll coordinates, and notes remain stored strictly inside your browser's local IndexedDB. We do not sell, rent, or monetize your personal data or browser history under any circumstances.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 text-slate-300 text-sm leading-relaxed font-sans">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <span>1. Information We Collect</span>
            </h2>
            <div className="space-y-4 text-slate-400">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-1">A. Browser Workspace & Tab Data</h3>
                <p>
                  When you save a workspace, the extension collects open tab URLs, page titles, favicons, native tab group names, tab colors, page scroll positions, text highlights, and project notes.
                  This data is stored <strong>locally in your browser's IndexedDB</strong>. If you choose to enable cloud synchronization, this data is encrypted in transit and stored securely in our cloud database to allow cross-device restoration.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-1">B. Account Data (Name & Email Address)</h3>
                <p>
                  If you choose to create an account or sign in to enable cross-device synchronization, we collect your <strong>full name</strong> and <strong>email address</strong>. This information is used exclusively to identify your user account, authenticate cloud backups, and prevent unauthorized access to your saved workspaces.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span>2. How We Use Your Information</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>To accurately snapshot, organize, and restore your browser workspace tabs and tab groups.</li>
              <li>To recall scroll positions and selected text highlights when reopening saved pages.</li>
              <li>To authenticate your user account via email or Google OAuth for cross-device cloud sync.</li>
              <li>We <strong>NEVER</strong> track your general browsing history, analyze your web traffic, or serve targeted advertisements.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-indigo-400" />
              <span>3. Data Sharing & Third-Party Services</span>
            </h2>
            <p className="text-slate-400">
              We do not share, sell, or disclose your tab data, name, or email address to third parties for advertising or marketing. Cloud backups are hosted using industry-standard encrypted infrastructure (MongoDB Atlas & Render). All network requests use TLS/HTTPS encryption.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-indigo-400" />
              <span>4. Data Retention & Control</span>
            </h2>
            <p className="text-slate-400">
              You maintain full control over your data. You can delete any saved project, snapshot, or note directly inside the extension popup at any time. Clearing your browser data or uninstalling the extension instantly removes all local IndexedDB data. Account holders can request complete cloud account deletion by contacting support.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
            <p className="text-slate-400">
              If you have any questions or concerns about this Privacy Policy or how your tab data is handled, please reach out via GitHub or email support at <span className="text-indigo-400 font-mono">abbilaashat@gmail.com</span>.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  );
}
