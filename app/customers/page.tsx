'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { CustomerList } from '@/components/customers/CustomerList';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { getCustomers } from '@/lib/firestore';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Customer } from '@/types';

export default function CustomersPage() {
  const { portalUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const c = await getCustomers();
        setCustomers(c);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
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
  );
}
