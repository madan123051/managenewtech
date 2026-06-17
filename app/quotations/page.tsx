'use client';

export const dynamic = 'force-dynamic';

import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { QuotationList } from '@/components/quotations/QuotationList';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useQuotations } from '@/hooks/useQuotations';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function QuotationsPage() {
  const { quotations, loading } = useQuotations();

  return (
    <MainLayout>
      <PageHeader
        title="Quotations"
        description="Manage customer quotations and estimates"
        actions={
          <Link href="/quotations/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Quotation
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <QuotationList quotations={quotations} />
      )}
    </MainLayout>
  );
}
