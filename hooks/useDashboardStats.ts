'use client';
import { useEffect, useState } from 'react';
import { subscribeToDashboardStats } from '@/lib/firestore-realtime';
import type { DashboardStats } from '@/lib/firestore-realtime';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToDashboardStats((data) => {
      setStats(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { stats, loading };
}
