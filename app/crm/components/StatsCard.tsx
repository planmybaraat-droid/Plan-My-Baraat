import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'red' | 'blue' | 'amber' | 'green' | 'gray' | 'purple';
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}

const COLOR_MAP = {
  red:    { bg: 'bg-red-50',    icon: 'bg-red-100 text-red-600',    border: 'border-red-100',    text: 'text-red-600' },
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   border: 'border-blue-100',   text: 'text-blue-600' },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-600',  border: 'border-amber-100',  text: 'text-amber-600' },
  green:  { bg: 'bg-green-50',  icon: 'bg-green-100 text-green-600',  border: 'border-green-100',  text: 'text-green-600' },
  gray:   { bg: 'bg-gray-50',   icon: 'bg-gray-100 text-gray-600',   border: 'border-gray-100',   text: 'text-gray-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', border: 'border-purple-100', text: 'text-purple-600' },
};

export default function StatsCard({ title, value, icon: Icon, color, change, changeType }: StatsCardProps) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.gray;
  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-black leading-tight tracking-tight text-gray-950 tabular-nums">{value}</p>
        <p className="text-[10.5px] font-semibold leading-tight text-gray-400 truncate mt-0.5">{title}</p>
        {change && (
          <p className={`text-[9.5px] mt-1 font-bold uppercase tracking-wide ${
            changeType === 'up' ? 'text-green-600' : changeType === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
          </p>
        )}
      </div>
    </div>
  );
}
