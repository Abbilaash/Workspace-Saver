import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

export const Toast: React.FC = () => {
  const { toastMessage, setToast } = useWorkspaceStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToast]);

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 animate-in slide-in-from-bottom-2 duration-200">
      <div className="bg-card border border-border/80 shadow-2xl rounded-xl p-2.5 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          {icons[toastMessage.type]}
          <p className="text-xs font-medium text-foreground truncate">
            {toastMessage.text}
          </p>
        </div>

        <button
          onClick={() => setToast(null)}
          className="p-1 text-muted-foreground hover:text-foreground rounded-md"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
