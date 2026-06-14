'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-[#1a3a6b] border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
  };

  return (
    <div
      className={cn('rounded-full border-4 animate-spin', sizeClasses[size], colorClasses[color], className)}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4">
        <Spinner size="lg" />
      </div>
    </div>
  );
}

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn('bg-gray-200 rounded-lg animate-pulse', className)} />
  );
}