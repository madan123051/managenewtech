'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { WorkerList } from '@/components/workers/WorkerList';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { getWorkers } from '@/lib/firestore';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Worker } from '@/types';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const w = await getWorkers();
        setWorkers(w);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <MainLayout>
      <PageHeader 
        title="Workers"
        description="Manage your skilled workers and technicians"
        action={
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
        <WorkerList workers={workers} />
      )}
    </MainLayout>
  );
}
