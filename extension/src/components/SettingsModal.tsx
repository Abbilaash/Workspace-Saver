import React from 'react';
import { X, Settings as SettingsIcon, Cloud, CloudOff } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen, settings, toggleCloudSync } = useWorkspaceStore();

  if (!isSettingsOpen) return null;

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await toggleCloudSync(e.target.checked);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-foreground">Settings</h3>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-xl">
            <div className="flex items-center gap-2.5">
              {settings.autoSync ? (
                <Cloud className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <CloudOff className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div>
                <span className="block text-xs font-semibold text-foreground">Cloud Sync</span>
                <span className="block text-[11px] text-muted-foreground">
                  {settings.autoSync ? 'Saved to database & website' : 'Local-only storage'}
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
            When toggled <strong>ON</strong>, all saved workspaces and notes are saved to the database and visible on the website. When toggled <strong>OFF</strong>, all database data is erased.
          </p>

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
