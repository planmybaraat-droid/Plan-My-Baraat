'use client';

import { useState } from 'react';
import { Send, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { createNote, deleteNote } from '../lib/supabase-crm';
import type { Note } from '../lib/types';

interface NotesTimelineProps {
  notes: Note[];
  entityType: 'vendor' | 'lead';
  entityId: string;
  onNotesChange: (notes: Note[]) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function NotesTimeline({ notes, entityType, entityId, onNotesChange }: NotesTimelineProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      const newNote = await createNote(entityType, entityId, text.trim(), 'Tejabhai');
      onNotesChange([newNote, ...notes]);
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      onNotesChange(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add note/remark..."
            rows={2}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500/30 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="px-3.5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center self-end h-[44px]"
        >
          {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </form>

      {notes.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <MessageSquare size={24} className="mx-auto mb-1 opacity-30" />
          <p className="text-xs">No notes or remarks yet</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notes.map(note => (
            <div key={note.id} className="flex gap-2.5 group">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600 text-[10px] font-bold">
                  {(note.created_by ?? 'T')[0].toUpperCase()}
                </div>
                <div className="w-px flex-1 bg-gray-100 mt-1.5" />
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <div className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="text-[10px] font-bold text-gray-800 truncate">{note.created_by ?? 'Tejabhai'}</span>
                      <span className="text-[9px] text-gray-400 font-medium">{timeAgo(note.created_at)}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-300 hover:text-red-500 transition-all absolute right-2 top-2"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{note.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
