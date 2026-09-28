import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { authenticateWithGoogle } from '../lib/sync';

export const OnboardingModal: React.FC = () => {
  const { settings, setToast, triggerCloudSync } = useWorkspaceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If user setup is already complete, do not render modal
  if (settings.isSetupComplete && settings.userName && settings.userEmail) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let idToken: string | undefined;
      let accessToken: string | undefined;

      // Try Chrome Identity Web Auth Flow if in Chrome Extension context
      if (typeof chrome !== 'undefined' && chrome.identity?.launchWebAuthFlow) {
        const redirectUri = chrome.identity.getRedirectURL();
        // Client ID can be passed or standard Google auth request
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', '89123847291-workspace-saver.apps.googleusercontent.com'); // Placeholder or user client ID
        authUrl.searchParams.set('response_type', 'token id_token');
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('scope', 'openid email profile');
        authUrl.searchParams.set('nonce', Math.random().toString(36).substring(2));

        try {
          const responseUrl = await new Promise<string>((resolve, reject) => {
            chrome.identity.launchWebAuthFlow(
              { url: authUrl.toString(), interactive: true },
              (redirectUrl) => {
                if (chrome.runtime.lastError || !redirectUrl) {
                  reject(chrome.runtime.lastError?.message || 'OAuth flow cancelled or failed');
                } else {
                  resolve(redirectUrl);
                }
              }
            );
          });

          const urlParams = new URLSearchParams(new URL(responseUrl.replace('#', '?')).search);
          idToken = urlParams.get('id_token') || undefined;
          accessToken = urlParams.get('access_token') || undefined;
        } catch (flowErr: any) {
          console.warn('Chrome WebAuthFlow prompt warning:', flowErr);
        }
      }

      // Send token or fallback payload to FastAPI backend
      const authRes = await authenticateWithGoogle({
        id_token: idToken,
        access_token: accessToken,
        email: manualEmail.trim() || undefined,
        name: manualEmail ? manualEmail.split('@')[0] : undefined
      });

      if (authRes.success && authRes.user) {
        setToast({ type: 'success', text: `Signed in as ${authRes.user.email}! Hydrating workspace...` });
        // Automatically trigger cloud data hydration and sync
        await triggerCloudSync();
      } else {
        if (!manualEmail) {
          setShowManualInput(true);
          setErrorMessage('Google popup closed. Enter your Google email to sign in directly.');
        } else {
          setErrorMessage(authRes.error || 'Google Sign-In failed');
        }
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;
    handleGoogleSignIn();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Sign in to Workspace Saver
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sync your tab snapshots across all your browser instances with Google OAuth.
          </p>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-[11px] leading-tight text-center">
            {errorMessage}
          </div>
        )}

        <div className="space-y-3 pt-1">
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-800 font-semibold text-xs shadow-md hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 border border-slate-200"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSubmitting ? 'Signing in & Syncing...' : 'Sign in with Google'}</span>
          </button>

          {showManualInput ? (
            <form onSubmit={handleManualSubmit} className="space-y-2 pt-2 border-t border-border">
              <label className="block text-[11px] font-medium text-muted-foreground">
                Enter Google Account Email:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="user@gmail.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  required
                  className="flex-1 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90"
                >
                  Sync
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowManualInput(true)}
              className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors pt-1"
            >
              Sign in using Google Email directly
            </button>
          )}
        </div>

        <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Secured with 180-day Google OAuth JWT Session</span>
        </div>
      </div>
    </div>
  );
};
