'use client';
import { useEffect, useState } from 'react';
import { subscribeToProjects } from '@/lib/firestore-realtime';
import type { Project } from '@/types';

interface UseProjectsFilter {
  managerId?: string;
  workerId?: string;
  customerId?: string;
}

interface UseProjectsOptions {
  enabled?: boolean;
}

export function useProjects(filter?: UseProjectsFilter, options: UseProjectsOptions = {}) {
  const { enabled = true } = options;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setProjects([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const unsub = subscribeToProjects(
      (data) => { setProjects(data); setLoading(false); },
      filter,
      (err) => { setError(err.message); setProjects([]); setLoading(false); }
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, filter?.managerId, filter?.workerId, filter?.customerId]);

  return { projects, loading, error };
}
