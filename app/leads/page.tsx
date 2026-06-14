'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { LeadList } from '@/components/leads/LeadList';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { getLeads } from '@/lib/firestore';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Lead } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const l = await getLeads();
        setLeads(l);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <MainLayout>
      <PageHeader 
        title="Leads"
        description="Manage sales leads and prospective customers"
        actions={
          <Link href="/leads/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <LeadList leads={leads} />
      )}
    </MainLayout>
  );
}
