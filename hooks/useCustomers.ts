'use client';
import { useEffect, useState } from 'react';
import { subscribeToCustomers } from '@/lib/firestore-realtime';
import type { Customer } from '@/types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsub = subscribeToCustomers(
      (data) => { setCustomers(data); setLoading(false); },
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, []);

  return { customers, loading, error };
}
