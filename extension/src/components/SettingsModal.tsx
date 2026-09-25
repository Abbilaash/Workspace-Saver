import React from 'react';
import { X, Settings as SettingsIcon, Sun, Moon, Database } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen, settings, updateSettings, projects } = useWorkspaceStore();

  if (!isSettingsOpen) return null;

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-foreground">Extension Settings</h3>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Theme Setting */}
          <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-xl">
            <div className="flex items-center gap-2.5">
              {settings.theme === 'dark' ? (
                <Moon className="w-4 h-4 text-purple-400 shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div>
                <span className="block text-xs font-semibold text-foreground">Appearance</span>
                <span className="block text-[11px] text-muted-foreground capitalize">
                  {settings.theme} Mode
                </span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-2.5 py-1 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              Toggle
            </button>
          </div>

          {/* Local Storage Info */}
          <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local IndexedDB Storage</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              All {projects.length} project workspaces and notes are saved 100% offline & private on your device.
            </p>
          </div>

          <div className="pt-2 border-t border-border flex justify-end">
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
