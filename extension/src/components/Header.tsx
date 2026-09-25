import React from 'react';
import { LayoutGrid, Command, Settings, ExternalLink, Sun, Moon } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

export const Header: React.FC = () => {
  const { 
    setCommandPaletteOpen, 
    setSettingsOpen, 
    settings, 
    updateSettings,
    selectProject
  } = useWorkspaceStore();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const openWebDashboard = () => {
    const webUrl = `http://localhost:3000/dashboard?user_id=${settings.userId || 'default_user'}`;
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: webUrl });
    } else {
      window.open(webUrl, '_blank');
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/60 backdrop-blur-md select-none">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => selectProject(null)}
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
            Workspace Saver
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/50"
          title="Open Command Palette (Ctrl+K / Cmd+K)"
        >
          <Command className="w-3 h-3" />
          <span className="font-mono font-medium">K</span>
        </button>

        <button
          onClick={openWebDashboard}
          className="p-1.5 rounded-md text-purple-400 hover:text-purple-300 hover:bg-muted transition-colors"
          title="Open Web Dashboard"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Toggle Theme"
        >
          {settings.theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
