import type { CrmStatus } from '../lib/types';

const STATUS_CONFIG: Record<CrmStatus, { label: string; className: string }> = {
  New:        { label: 'New',        className: 'bg-gray-100 text-gray-700 border-gray-200' },
  Contacted:  { label: 'Contacted',  className: 'bg-blue-50 text-blue-700 border-blue-100' },
  Interested: { label: 'Interested', className: 'bg-amber-50 text-amber-700 border-amber-100' },
  Converted:  { label: 'Converted',  className: 'bg-green-50 text-green-700 border-green-100' },
  Lost:       { label: 'Lost',       className: 'bg-red-50 text-red-700 border-red-100' },
};

interface StatusBadgeProps {
  status: CrmStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.New;
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full border
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'}
        ${config.className}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 opacity-70" />
      {config.label}
    </span>
  );
}
