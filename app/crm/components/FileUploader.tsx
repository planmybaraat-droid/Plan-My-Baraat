'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadFile } from '../lib/supabase-crm';
import type { UploadedFile } from '../lib/types';

interface FileUploaderProps {
  entityType: 'vendor' | 'lead' | 'agreement' | 'vendor_agreement';
  entityId: string;
  onUploadComplete?: (file: UploadedFile) => void;
}

export default function FileUploader({ entityType, entityId, onUploadComplete }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setError(null);
    const file = files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB');
      return;
    }
    try {
      setUploading(true);
      const uploaded = await uploadFile(entityType, entityId, file);
      onUploadComplete?.(uploaded);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${dragOver ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-red-500 animate-spin" />
            <p className="text-xs text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload size={24} className="text-gray-400" />
            <p className="text-xs font-semibold text-gray-700">Click or drag to upload</p>
            <p className="text-[10px] text-gray-400">Images, PDF, Word, Excel — max 10MB</p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── File List Item ───────────────────────────────────────────────────────────

interface FileItemProps {
  file: UploadedFile;
  onDelete?: (file: UploadedFile) => void;
}

export function FileItem({ file, onDelete }: FileItemProps) {
  const isImage = file.file_type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.file_name);
  const sizeKb = file.file_size ? Math.round(file.file_size / 1024) : null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
        {isImage ? (
          <ImageIcon size={16} className="text-blue-500" />
        ) : (
          <FileText size={16} className="text-gray-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <a
          href={file.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-gray-800 hover:text-red-600 transition-colors truncate block"
        >
          {file.file_name}
        </a>
        <p className="text-[10px] text-gray-400">
          {sizeKb ? `${sizeKb} KB · ` : ''}{new Date(file.created_at).toLocaleDateString()}
        </p>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(file)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
