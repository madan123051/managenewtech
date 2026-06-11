'use client';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProtectedRoute } from './ProtectedRoute';
import type { UserRole } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  allowedRoles?: UserRole[];
}

export function Layout({ children, title, subtitle, allowedRoles }: LayoutProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title={title} subtitle={subtitle} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
