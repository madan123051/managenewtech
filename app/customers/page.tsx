'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomerList } from '@/components/customers/CustomerList';
import { Spinner } from '@/components/ui/Spinner';
import { useCustomers } from '@/hooks/useCustomers';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function CustomersPage() {
  const { portalUser } = useAuth();
  const router = useRouter();
  const canLoad = portalUser?.role === 'admin' || portalUser?.role === 'manager';
  const { customers, loading } = useCustomers({ enabled: canLoad });

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <MainLayout>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <CustomerList customers={customers} onCreate={() => router.push('/customers/new')} />
      )}
      </MainLayout>
    </ProtectedRoute>
  );
}
