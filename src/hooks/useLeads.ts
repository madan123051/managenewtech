'use client';
import { useEffect, useState } from 'react';
import { subscribeToLeads } from '@/lib/firestore-realtime';
import type { Lead } from '@/types';

export function useLeads(managerId?: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToLeads((data) => {
      setLeads(data);
      setLoading(false);
    }, managerId);
    return unsub;
  }, [managerId]);

  return { leads, loading };
}
