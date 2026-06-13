'use client';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { portalUser } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#1a3a6b] flex items-center justify-center text-white text-sm font-bold">
          {portalUser?.displayName?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
