'use client';
import { useEffect, useState } from 'react';
import { subscribeToLeads } from '@/lib/firestore-realtime';
import type { Lead } from '@/types';

export function useLeads(managerId?: string, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLeads([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const unsub = subscribeToLeads(
      (data) => { setLeads(data); setLoading(false); },
      managerId,
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, [enabled, managerId]);

  return { leads, loading, error };
}
