'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { LeadList } from '@/components/leads/LeadList';
import { Spinner } from '@/components/ui/Spinner';
import { useLeads } from '@/hooks/useLeads';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const { portalUser } = useAuth();
  const { leads, loading } = useLeads(
    portalUser?.role === 'manager' ? portalUser.uid : undefined,
    { enabled: portalUser?.role === 'admin' || portalUser?.role === 'manager' }
  );

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
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
        <LeadList leads={leads} onCreate={() => router.push('/leads/new')} />
      )}
      </MainLayout>
    </ProtectedRoute>
  );
}
