'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
}\n\nexport function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {\n  const sizeClasses = {\n    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {\n    primary: 'border-[#1a3a6b] border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
  };

  return (\n    <div\n      className={cn('rounded-full border-4 animate-spin', sizeClasses[size], colorClasses[color], className)}\n      role=\"status\"\n      aria-label=\"Loading\"\n    />\n  );\n}\n\nexport function LoadingOverlay() {\n  return (\n    <div className=\"fixed inset-0 z-50 bg-black/50 flex items-center justify-center\">\n      <div className=\"bg-white rounded-lg p-4\">\n        <Spinner size=\"lg\" />\n      </div>\n    </div>\n  );\n}\n\nexport function SkeletonLoader({ className }: { className?: string }) {\n  return (\n    <div className={cn('bg-gray-200 rounded-lg animate-pulse', className)} />\n  );\n}