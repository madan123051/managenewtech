'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { LeadList } from '@/components/leads/LeadList';
import { Spinner } from '@/components/ui/Spinner';
import { useLeads } from '@/hooks/useLeads';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function LeadsPage() {
  const { portalUser } = useAuth();
  const router = useRouter();
  const { leads, loading } = useLeads(
    portalUser?.role === 'manager' ? portalUser.uid : undefined,
    { enabled: portalUser?.role === 'admin' || portalUser?.role === 'manager' }
  );

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <MainLayout>

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
