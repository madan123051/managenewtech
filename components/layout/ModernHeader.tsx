'use client';

import { Menu, Search, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernHeaderProps {
  onMenuClick?: () => void;
  title?: string;
  isMobileSidebarOpen?: boolean;
}

export function ModernHeader({ onMenuClick, title, isMobileSidebarOpen }: ModernHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-500 outline-none w-40"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}