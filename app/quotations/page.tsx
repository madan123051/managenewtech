'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuotationList } from '@/components/quotations/QuotationList';
import { Spinner } from '@/components/ui/Spinner';
import { useQuotations } from '@/hooks/useQuotations';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function QuotationsPage() {
  const { portalUser } = useAuth();
  const router = useRouter();
  const { quotations, loading } = useQuotations({ enabled: Boolean(portalUser) });

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager', 'customer']}>
      <MainLayout>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <QuotationList quotations={quotations} onCreate={() => router.push('/quotations/new')} />
      )}
      </MainLayout>
    </ProtectedRoute>
  );
}
