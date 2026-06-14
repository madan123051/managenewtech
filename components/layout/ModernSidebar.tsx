import React from 'react';
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  FileText,
  Hammer,
  LogOut,
  UserCog,
  Building2,
  X,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

function getDashboardHref(role: string) {
  if (role === 'manager') return '/manager-dashboard';
  if (role === 'worker') return '/worker-dashboard';
  if (role === 'customer') return '/customer-dashboard';
  return '/dashboard';
}

const navItems = (role: string) => {
  const dashHref = getDashboardHref(role);
  const all = [
    { href: dashHref, label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'worker', 'customer'] },
    { href: '/customers', label: 'Customers', icon: Users, roles: ['admin', 'manager'] },
    { href: '/leads', label: 'Leads', icon: UserCheck, roles: ['admin', 'manager'] },
    { href: '/quotations', label: 'Quotations', icon: FileText, roles: ['admin', 'manager', 'customer'] },
    { href: '/projects', label: 'Projects', icon: Briefcase, roles: ['admin', 'manager', 'worker', 'customer'] },
    { href: '/workers', label: 'Workers', icon: Hammer, roles: ['admin', 'manager'] },
    { href: '/managers', label: 'Managers', icon: Building2, roles: ['admin'] },
    { href: '/users', label: 'User Mgmt', icon: UserCog, roles: ['admin'] },
    { href: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'manager', 'worker', 'customer'] },
  ];
  return all.filter((i) => i.roles.includes(role));
};

interface ModernSidebarProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export function ModernSidebar({ onClose, isOpen = true }: ModernSidebarProps) {
  const pathname = usePathname();
  const { portalUser, signOut } = useAuth();

  if (!portalUser) return null;

  const items = navItems(portalUser.role);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const sidebarClasses = cn(
    'w-64 min-h-screen h-full bg-gradient-to-b from-[#1a3a6b] to-[#0f2847] flex flex-col text-white shadow-xl',
    'fixed left-0 top-0 z-40 transition-transform duration-300 lg:sticky lg:translate-x-0',
    !isOpen && '-translate-x-full'
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside className={sidebarClasses}>
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow">
              NT
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">NewTech</p>
              <p className="text-xs text-blue-200">Management</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 lg:hidden transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {items.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {active && <div className="ml-auto w-1 h-6 bg-orange-400 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="px-3 py-4 border-t border-white/10 space-y-3">
          <div className="px-4 py-3 bg-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-xs font-bold">
                {portalUser.displayName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{portalUser.displayName}</p>
                <p className="text-xs text-blue-200 capitalize">{portalUser.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              signOut();
              onClose?.();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/20 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}