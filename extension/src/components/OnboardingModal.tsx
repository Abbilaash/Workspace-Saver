import React, { useState } from 'react';
import { Sparkles, Copy, Check, Key, User, Mail, ArrowRight, History, Shield } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { syncUserToCloud, restoreAccountWithSyncKey } from '../lib/sync';

export const OnboardingModal: React.FC = () => {
  const { settings, updateSettings, setToast, triggerCloudSync } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'create' | 'restore'>('create');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [syncKeyInput, setSyncKeyInput] = useState('');

  // Execution states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // If user setup is already complete and no key generation screen active, do not render modal
  if (settings.isSetupComplete && settings.userId && generatedKey === null) {
    return null;
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await syncUserToCloud(name.trim(), email.trim());
      if (result.success && result.userId) {
        setGeneratedKey(result.userId);
      } else {
        setErrorMessage(result.error || 'Failed to generate unique Sync Key');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestoreAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = syncKeyInput.trim();
    if (!key) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await restoreAccountWithSyncKey(key);
      if (result.success) {
        // Update store settings so modal closes and takes user to extension main page
        await updateSettings({
          userId: key,
          userName: result.user?.name || 'Synced User',
          userEmail: result.user?.email || '',
          isSetupComplete: true
        });

        // Trigger cloud sync to load all workspaces from database into store
        await triggerCloudSync();

        setToast({ 
          type: 'success', 
          text: `Welcome back! Loaded all saved workspaces from database.` 
        });
      } else {
        setErrorMessage(result.error || 'Invalid Sync Key. No user history found in MongoDB.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error restoring account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFinishSetup = async () => {
    if (!generatedKey) return;
    const currentKey = generatedKey;
    setGeneratedKey(null); // Clear generated key screen to unmount modal

    await updateSettings({
      userName: name.trim() || 'Synced User',
      userEmail: email.trim(),
      userId: currentKey,
      isSetupComplete: true
    });

    await triggerCloudSync();
    setToast({ type: 'success', text: `Setup complete! Connected to database.` });
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Workspace Saver Sync Setup
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Generate a unique Sync Key or enter an existing key to sync your workspaces across devices.
          </p>
        </div>

        {/* Generated Key Screen */}
        {generatedKey ? (
          <div className="space-y-4 pt-1 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-400">
                <Key className="w-4 h-4" />
                <span>Your Unique Sync Key (UUID)</span>
              </div>
              <div className="font-mono text-xs font-bold text-foreground bg-background/80 p-2.5 rounded-lg border border-border break-all select-all">
                {generatedKey}
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Save this key! Enter it in Workspace Saver on any browser or PC to automatically restore and sync your saved workspaces.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyKey}
                className="flex-1 py-2 px-3 rounded-lg bg-muted hover:bg-accent text-foreground font-medium text-xs border border-border flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Key!' : 'Copy Key'}</span>
              </button>

              <button
                type="button"
                onClick={handleFinishSetup}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-1.5"
              >
                <span>Go to Extension</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => { setActiveTab('create'); setErrorMessage(''); }}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'create'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>New Account</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('restore'); setErrorMessage(''); }}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'restore'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Sync History</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-[11px] leading-tight text-center">
                {errorMessage}
              </div>
            )}

            {/* Tab 1: Create New Account */}
            {activeTab === 'create' ? (
              <form onSubmit={handleCreateAccount} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !email.trim()}
                  className="w-full mt-2 py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Generating Sync Key...' : 'Generate Sync Key & Connect'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              /* Tab 2: Restore History with Sync Key */
              <form onSubmit={handleRestoreAccount} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                    <Key className="w-3 h-3 text-muted-foreground" />
                    Paste Your Unique Sync Key (UUID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 8f4b23a1-4e92-4f33-871d-9e123abc4567"
                    value={syncKeyInput}
                    onChange={(e) => setSyncKeyInput(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Enter the Sync Key generated on your previous machine/browser to restore all saved workspaces.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !syncKeyInput.trim()}
                  className="w-full mt-2 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Fetching Database Workspaces...' : 'Restore Saved Workspaces'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </>
        )}

        <div className="pt-1 text-center flex items-center justify-center gap-1 text-[10px] text-muted-foreground border-t border-border/50">
          <Shield className="w-3 h-3 text-indigo-400" />
          <span>MongoDB Cloud Sync & Offline-First Storage</span>
        </div>

      </div>
    </div>
  );
};
