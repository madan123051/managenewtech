'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { QuotationList } from '@/components/quotations/QuotationList';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { getQuotations } from '@/lib/firestore';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Quotation } from '@/types';

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = await getQuotations();
        setQuotations(q);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <MainLayout>
      <PageHeader 
        title="Quotations"
        description="Manage customer quotations and estimates"
        action={
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
