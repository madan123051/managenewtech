'use client';
import { useEffect, useState } from 'react';
import { subscribeToCustomers } from '@/lib/firestore-realtime';
import type { Customer } from '@/types';

export function useCustomers(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const [customers, setCustomers] = useState<Customer[]>([]);
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
    const unsub = subscribeToCustomers(
      (data) => { setCustomers(data); setLoading(false); },
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, [enabled]);

  return { customers, loading, error };
}
