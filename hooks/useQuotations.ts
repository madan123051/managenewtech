'use client';
import { useEffect, useState } from 'react';
import { subscribeToQuotations } from '@/lib/firestore-realtime';
import type { Quotation } from '@/types';

export function useQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToQuotations((data) => {
      setQuotations(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { quotations, loading };
}
