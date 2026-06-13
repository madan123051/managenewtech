'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function getDashboardByRole(role: string) {
  if (role === 'manager') return '/manager-dashboard';
  if (role === 'worker') return '/worker-dashboard';
  if (role === 'customer') return '/customer-dashboard';
  return '/dashboard';
}

export default function Home() {
  const { portalUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (portalUser) {
        router.push(getDashboardByRole(portalUser.role));
      } else {
        router.push('/login');
      }
    }
  }, [portalUser, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
