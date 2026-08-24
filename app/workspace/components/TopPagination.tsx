'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TopPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  label: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function TopPagination({ page, pageSize, total, label, onPageChange, onPageSizeChange }: TopPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-[11px] font-semibold text-gray-500">
        Showing <b className="text-gray-900">{start}–{end}</b> of <b className="text-gray-900">{total}</b> {label}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-500">
        <label className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-9 rounded-xl border border-gray-200 bg-white px-3 font-bold text-gray-900 outline-none focus:border-red-400"
            aria-label="Items per page"
          >
            {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <span className="min-w-[64px] text-center">{page} / {totalPages}</span>
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Previous page"><ChevronLeft size={15} /></button>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Next page"><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}
