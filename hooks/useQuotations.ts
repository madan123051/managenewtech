'use client';
import { useEffect, useState } from 'react';
import { subscribeToQuotations } from '@/lib/firestore-realtime';
import type { Quotation } from '@/types';

export function useQuotations(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setError(null);
      return;
    }

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
  }, [enabled]);

  return { quotations, loading, error };
}
