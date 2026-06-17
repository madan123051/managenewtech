'use client';

export const dynamic = 'force-dynamic';

import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { LeadList } from '@/components/leads/LeadList';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useLeads } from '@/hooks/useLeads';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const { leads, loading } = useLeads();

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
