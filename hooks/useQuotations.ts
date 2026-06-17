'use client';
import { useEffect, useState } from 'react';
import { subscribeToQuotations } from '@/lib/firestore-realtime';
import type { Quotation } from '@/types';

export function useQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsub = subscribeToQuotations(
      (data) => {
        setQuotations(data);
        setLoading(false);
      },
      (err) => {
        console.error('useQuotations error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  return { quotations, loading, error };
}
