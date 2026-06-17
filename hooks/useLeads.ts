'use client';
import { useEffect, useState } from 'react';
import { subscribeToLeads } from '@/lib/firestore-realtime';
import type { Lead } from '@/types';

export function useLeads(managerId?: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsub = subscribeToLeads(
      (data) => { setLeads(data); setLoading(false); },
      managerId,
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, [managerId]);

  return { leads, loading, error };
}
