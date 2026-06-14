'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-cyan-100 text-cyan-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      teal: 'bg-teal-100 text-teal-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      emerald: 'bg-emerald-100 text-emerald-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));

Badge.displayName = 'Badge';
export { Badge, badgeVariants };