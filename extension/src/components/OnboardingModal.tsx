import React, { useState } from 'react';
import { Sparkles, ArrowRight, Copy, Check, Key, User, Mail, ShieldCheck, DownloadCloud } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { registerUserInCloud, connectExistingUserById } from '../lib/sync';

export const OnboardingModal: React.FC = () => {
  const { settings, setToast, triggerCloudSync, updateSettings } = useWorkspaceStore();
  const [mode, setMode] = useState<'create' | 'connect'>('create');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [existingSyncId, setExistingSyncId] = useState('');
  const [generatedSyncId, setGeneratedSyncId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If user setup is already complete, do not render modal
  if (settings.isSetupComplete && settings.userId) {
    return null;
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await registerUserInCloud(name.trim(), email.trim());
      if (res.success && res.user?.id) {
        setGeneratedSyncId(res.user.id);
        setToast({ type: 'success', text: 'Account registered & Unique Sync ID created!' });
      } else {
        setErrorMessage(res.error || 'Could not register user. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectExisting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingSyncId.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await connectExistingUserById(existingSyncId.trim());
      if (res.success && res.user) {
        setToast({ type: 'success', text: `Connected! Restored data for ${res.user.name || res.user.email}.` });
        await triggerCloudSync();
      } else {
        setErrorMessage(res.error || 'Sync ID not found in database.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect Sync ID');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (!generatedSyncId) return;
    navigator.clipboard.writeText(generatedSyncId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinishSetup = async () => {
    if (generatedSyncId) {
      await updateSettings({
        userId: generatedSyncId,
        userName: name.trim(),
        userEmail: email.trim(),
        isSetupComplete: true
      });
      await triggerCloudSync();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
        
        {/* Step 2: Show Generated Sync ID Screen */}
        {generatedSyncId ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
              <Key className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Your Unique Sync ID
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save this unique key to restore and sync your saved workspaces on any device or browser.
              </p>
            </div>

            {/* Sync ID Display Box */}
            <div className="p-3 bg-muted/80 border border-border rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground block">
                Unique Sync ID
              </span>
              <div className="flex items-center justify-between gap-2 bg-background p-2 rounded-lg border border-border">
                <code className="text-xs font-mono text-indigo-400 font-semibold truncate select-all">
                  {generatedSyncId}
                </code>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 rounded-md bg-muted hover:bg-accent text-foreground transition-colors shrink-0"
                  title="Copy Sync ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleFinishSetup}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Start Using Extension</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Step 1: Initial Form (Create vs Connect) */
          <div className="space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Welcome to Workspace Saver
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save tab workspaces locally & automatically sync across devices.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-lg bg-muted p-1 gap-1">
              <button
                type="button"
                onClick={() => { setMode('create'); setErrorMessage(''); }}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                  mode === 'create'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create New
              </button>
              <button
                type="button"
                onClick={() => { setMode('connect'); setErrorMessage(''); }}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                  mode === 'connect'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Use Existing ID
              </button>
            </div>

            {errorMessage && (
              <div className="p-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-[11px] leading-tight text-center">
                {errorMessage}
              </div>
            )}

            {mode === 'create' ? (
              <form onSubmit={handleCreateAccount} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-foreground mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-muted-foreground" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-foreground mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !email.trim()}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Generating Sync ID...' : 'Generate Sync ID & Start'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleConnectExisting} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-foreground mb-1 flex items-center gap-1">
                    <Key className="w-3 h-3 text-muted-foreground" />
                    Existing Sync ID
                  </label>
                  <input
                    type="text"
                    placeholder="Paste your unique Sync ID here..."
                    value={existingSyncId}
                    onChange={(e) => setExistingSyncId(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !existingSyncId.trim()}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Connecting & Syncing...' : 'Connect & Restore Data'}</span>
                </button>
              </form>
            )}

            <div className="pt-1 text-center flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Automatic Mongo Cloud Sync Enabled</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
