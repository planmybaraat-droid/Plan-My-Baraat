'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  variant?: 'danger' | 'warning';
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 animate-in zoom-in-95 duration-100">
        <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center
          ${variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'}
        `}>
          <AlertTriangle size={20} className={variant === 'danger' ? 'text-red-600' : 'text-amber-600'} />
        </div>
        <h3 className="text-sm font-bold text-gray-900 text-center mb-1">{title}</h3>
        <p className="text-xs text-gray-500 text-center mb-4">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5
              ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'}
            `}
          >
            {loading && <Loader2 size={12} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
