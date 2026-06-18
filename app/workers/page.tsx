'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { WorkerList } from '@/components/workers/WorkerList';
import { Spinner } from '@/components/ui/Spinner';
import { getWorkers } from '@/lib/firestore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Worker } from '@/types';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const { portalUser } = useAuth();
  const canLoad = portalUser?.role === 'admin' || portalUser?.role === 'manager';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!canLoad) return;
      setLoading(true);
      try {
        const w = await getWorkers();
        setWorkers(w);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [canLoad]);

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <MainLayout>
      <PageHeader 
        title="Workers"
        description="Manage your skilled workers and technicians"
        actions={
          <Link href="/workers/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Worker
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <WorkerList workers={workers} onCreate={() => router.push('/workers/new')} />
      )}
      </MainLayout>
    </ProtectedRoute>
  );
}
