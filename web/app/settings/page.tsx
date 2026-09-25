'use client';

import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Key, RefreshCw, Check } from 'lucide-react';

export default function SettingsPage() {
  const [userId, setUserId] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ws_user_id') || 'default_user';
    setUserId(stored);
  }, []);

  const handleSaveUserId = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ws_user_id', userId.trim() || 'default_user');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Workspace Saver Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Cloud synchronization and device pairing configuration
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <Key className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">User Sync Identifier</h3>
            <p className="text-xs text-muted-foreground">Pair your extension unique ID to view synced workspaces</p>
          </div>
        </div>

        <form onSubmit={handleSaveUserId} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              User Sync ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. default_user or your extension User Sync ID"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved!' : 'Save User Sync ID'}</span>
          </button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground">Local-First Architecture</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Workspace Saver stores your workspaces primarily inside browser IndexedDB. Cloud synchronization works in the background automatically without locking your workflow.
        </p>
      </div>
    </div>
  );
}
