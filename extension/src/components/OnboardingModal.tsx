import React, { useState } from 'react';
import { Sparkles, User, Mail, ArrowRight } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { syncUserToCloud } from '../lib/sync';

export const OnboardingModal: React.FC = () => {
  const { settings, updateSettings, setToast } = useWorkspaceStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user setup is already complete, do not render
  if (settings.isSetupComplete && settings.userName && settings.userEmail) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await syncUserToCloud(name.trim(), email.trim());
      await updateSettings({
        userName: name.trim(),
        userEmail: email.trim(),
        userId: result.userId,
        isSetupComplete: true
      });
      setToast({ type: 'success', text: `Welcome to Workspace Saver, ${name.trim()}!` });
    } catch (err: any) {
      console.error('Setup failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Welcome to Workspace Saver
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enter your details once to create your unique Workspace ID.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
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
            <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
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
            className="w-full mt-2 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Setting up...' : 'Get Started'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
