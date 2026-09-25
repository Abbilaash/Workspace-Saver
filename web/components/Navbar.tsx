import React from 'react';
import Link from 'next/link';
import { LayoutGrid, Layers, Settings, ExternalLink } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-sm text-foreground">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span>Workspace Saver</span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            Settings
          </Link>
          <a
            href="chrome://extensions"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            <span>Browser Extension</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </nav>
  );
};
