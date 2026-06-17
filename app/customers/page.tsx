'use client';

export const dynamic = 'force-dynamic';

import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { CustomerList } from '@/components/customers/CustomerList';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useCustomers } from '@/hooks/useCustomers';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const { portalUser } = useAuth();
  const canLoad = portalUser?.role === 'admin' || portalUser?.role === 'manager';
  const { customers, loading } = useCustomers({ enabled: canLoad });

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <MainLayout>
      <PageHeader
        title="Customers"
        description="Manage all your customers and their information"
        actions={
          <Link href="/customers/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <CustomerList customers={customers} />
      )}
      </MainLayout>
    </ProtectedRoute>
  );
}
