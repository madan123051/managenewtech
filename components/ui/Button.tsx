'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-[#1a3a6b] text-white hover:bg-[#0f2847] focus-visible:ring-[#1a3a6b]',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300',
        accent: 'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500',
      },
      size: {
        xs: 'px-2.5 py-1.5 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-3.5 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      isLoading: {
        true: 'pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      isLoading: false,
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, icon, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth, isLoading }), className)}
      disabled={props.disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export { Button, buttonVariants };