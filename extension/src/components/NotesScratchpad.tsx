import React, { useState, useEffect } from 'react';
import { Edit3, Eye, FileText } from 'lucide-react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

interface NotesScratchpadProps {
  projectId: string;
}

export const NotesScratchpad: React.FC<NotesScratchpadProps> = ({ projectId }) => {
  const { selectedNote, updateProjectNote } = useWorkspaceStore();
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    if (selectedNote) {
      setContent(selectedNote.content || '');
    } else {
      setContent('');
    }
  }, [selectedNote, projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    updateProjectNote(projectId, val);
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/40">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Project Notes</span>
        </div>

        <div className="flex bg-muted p-0.5 rounded-lg border border-border/50 text-[11px]">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              activeTab === 'write'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            Write
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              activeTab === 'preview'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-3 h-3" />
            Preview
          </button>
        </div>
      </div>

      <div className="p-3">
        {activeTab === 'write' ? (
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="# Project Notes&#10;&#10;- Save tasks, URLs, or commands&#10;- Key endpoints or quick architecture notes..."
            className="w-full h-36 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-none font-mono"
          />
        ) : (
          <div className="w-full h-36 overflow-y-auto text-xs text-foreground prose prose-invert max-w-none font-sans whitespace-pre-wrap leading-relaxed">
            {content.trim() ? (
              renderMarkdownPreview(content)
            ) : (
              <span className="text-muted-foreground italic">No notes created yet.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function renderMarkdownPreview(text: string) {
  // Simple clean lightweight line-based renderer
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    if (line.startsWith('# ')) {
      return <h1 key={idx} className="text-sm font-bold text-foreground mb-1 mt-1">{line.slice(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={idx} className="text-xs font-semibold text-foreground mb-1 mt-1">{line.slice(3)}</h2>;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return <li key={idx} className="ml-4 list-disc text-muted-foreground text-[11px] mb-0.5">{line.slice(2)}</li>;
    }
    if (line.trim() === '') {
      return <div key={idx} className="h-1.5" />;
    }
    return <p key={idx} className="text-[11px] text-muted-foreground mb-1">{line}</p>;
  });
}
