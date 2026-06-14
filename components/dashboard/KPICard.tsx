'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  onClick?: () => void;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
};

export function KPICard({ title, value, icon, change, color = 'blue', onClick }: KPICardProps) {
  return (
    <Card interactive={!!onClick} onClick={onClick} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                {change.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={cn('text-sm font-medium', change.isPositive ? 'text-green-600' : 'text-red-600')}>
                  {change.isPositive ? '+' : '-'}{Math.abs(change.value)}%
                </span>
              </div>
            )}
          </div>
          {icon && <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center text-xl', colorClasses[color])}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
"