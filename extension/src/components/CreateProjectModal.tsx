import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

export const CreateProjectModal: React.FC = () => {
  const { isCreateModalOpen, setCreateModalOpen, createNewProject } = useWorkspaceStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState('purple');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createNewProject(name.trim(), color, description.trim());
      setName('');
      setDescription('');
      setColor('purple');
      setCreateModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorOptions = [
    { id: 'purple', hex: '#a855f7' },
    { id: 'indigo', hex: '#6366f1' },
    { id: 'emerald', hex: '#10b981' },
    { id: 'amber', hex: '#f59e0b' },
    { id: 'rose', hex: '#f43f5e' },
    { id: 'cyan', hex: '#06b6d4' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-foreground">Create New Project</h3>
          </div>
          <button
            onClick={() => setCreateModalOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g. Formicx, Quantum Research..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Project Badge Color
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center border transition-all"
                  style={{ 
                    backgroundColor: c.hex,
                    borderColor: color === c.id ? '#ffffff' : 'transparent'
                  }}
                >
                  {color === c.id && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief context or goals for this workspace..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring h-16 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Capturing...' : 'Create & Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
