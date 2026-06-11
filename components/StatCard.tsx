import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'navy' | 'orange' | 'green' | 'purple' | 'yellow' | 'red';
}

export function StatCard({ label, value, icon: Icon, color = 'navy' }: StatCardProps) {
  const colors = {
    navy: { bg: 'bg-[#1a3a6b]', icon: 'text-white', val: 'text-[#1a3a6b]' },
    orange: { bg: 'bg-orange-500', icon: 'text-white', val: 'text-orange-600' },
    green: { bg: 'bg-emerald-500', icon: 'text-white', val: 'text-emerald-600' },
    purple: { bg: 'bg-purple-500', icon: 'text-white', val: 'text-purple-600' },
    yellow: { bg: 'bg-yellow-400', icon: 'text-yellow-900', val: 'text-yellow-700' },
    red: { bg: 'bg-red-500', icon: 'text-white', val: 'text-red-600' },
  };
  const c = colors[color];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`${c.bg} rounded-xl p-3 flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
      </div>
    </div>
  );
}
