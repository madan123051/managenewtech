'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

function getDashboardByRole(role: string) {
  if (role === 'manager') return '/manager-dashboard';
  if (role === 'worker') return '/worker-dashboard';
  if (role === 'customer') return '/customer-dashboard';
  return '/dashboard';
}

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { portalUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!portalUser) {
        router.push('/login');
        return;
      }
      if (allowedRoles && !allowedRoles.includes(portalUser.role)) {
        router.push(getDashboardByRole(portalUser.role));
      }
    }
  }, [portalUser, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!portalUser) return null;
  if (allowedRoles && !allowedRoles.includes(portalUser.role)) return null;

  return <>{children}</>;
}
