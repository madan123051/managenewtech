'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, type = 'text', ...props }, ref) => (
    <div className=\"w-full\">\n      {label && (\n        <label className=\"block text-sm font-medium text-gray-700 mb-2\">\n          {label}\n          {props.required && <span className=\"text-red-500 ml-1\">*</span>}\n        </label>\n      )}\n      <div className=\"relative\">\n        {icon && <div className=\"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400\">{icon}</div>}\n        <input\n          type={type}\n          className={cn(\n            'w-full px-4 py-2.5 text-base border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed',\n            icon ? 'pl-10' : '',\n            error\n              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'\n              : 'border-gray-300 focus:border-[#1a3a6b] focus:ring-blue-100',\n            className\n          )}\n          ref={ref}\n          {...props}\n        />\n      </div>\n      {error && <p className=\"mt-1.5 text-sm text-red-600\">{error}</p>}\n      {helperText && !error && <p className=\"mt-1.5 text-sm text-gray-500\">{helperText}</p>}\n    </div>\n  )\n);\n\nInput.displayName = 'Input';\nexport { Input };