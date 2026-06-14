'use client';

import React, { useEffect } from 'react';
nimport { X } from 'lucide-react';
nimport { cn } from '@/lib/utils';
nimport { Button } from './Button';

interface ModalProps {\n  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
  closeButton?: boolean;
}\n\nconst sizeClasses = {
  sm: 'w-full max-w-md',
  md: 'w-full max-w-2xl',
  lg: 'w-full max-w-4xl',
  xl: 'w-full max-w-6xl',
};\n\nexport function Modal({\n  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  actions,
  closeButton = true,
}: ModalProps) {\n  useEffect(() => {\n    if (isOpen) {\n      document.body.style.overflow = 'hidden';\n    } else {\n      document.body.style.overflow = 'auto';\n    }\n    return () => {\n      document.body.style.overflow = 'auto';\n    };\n  }, [isOpen]);\n\n  if (!isOpen) return null;

  return (\n    <div className=\"fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4\">\n      <div\n        className={cn('bg-white rounded-xl shadow-2xl', sizeClasses[size])}\n        onClick={(e) => e.stopPropagation()}\n      >\n        <div className=\"flex items-center justify-between px-6 py-4 border-b border-gray-200\">\n          <h2 className=\"text-xl font-semibold text-gray-900\">{title}</h2>\n          {closeButton && (\n            <button\n              onClick={onClose}\n              className=\"p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors\"\n              aria-label=\"Close modal\"\n            >\n              <X className=\"w-5 h-5\" />\n            </button>\n          )}\n        </div>\n        <div className=\"px-6 py-4 max-h-[70vh] overflow-y-auto\">{children}</div>\n        {actions && (\n          <div className=\"px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex gap-3 justify-end\">\n            {actions}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}