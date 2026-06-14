'use client';

import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  icon?: React.ReactNode;
}

export function PageHeader({ title, description, actions, breadcrumbs, icon }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="mb-4 flex gap-1 text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx}>
              {crumb.href ? (
                <a href={crumb.href} className="text-blue-600 hover:text-blue-700">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-gray-600">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && <span className="mx-1 text-gray-400">/</span>}
            </span>
          ))}
        </nav>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {icon && <div className="text-3xl">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-gray-600 mt-1">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}
"