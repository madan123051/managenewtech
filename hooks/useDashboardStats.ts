'use client';
import { useEffect, useState } from 'react';
import { subscribeToDashboardStats } from '@/lib/firestore-realtime';
import type { DashboardStats } from '@/lib/firestore-realtime';

interface UseDashboardStatsOptions {
  enabled?: boolean;
}

export function useDashboardStats(options: UseDashboardStatsOptions = {}) {
  const { enabled = true } = options;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStats(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const unsub = subscribeToDashboardStats(
      (data) => {
        setStats(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setStats(null);
        setLoading(false);
      }
    );
    return unsub;
  }, [enabled]);

  return { stats, loading, error };
}
