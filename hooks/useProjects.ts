'use client';
import { useEffect, useState } from 'react';
import { subscribeToProjects } from '@/lib/firestore-realtime';
import type { Project } from '@/types';

export function useProjects(filter?: {
  managerId?: string;
  workerId?: string;
  customerId?: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const filterKey = JSON.stringify(filter ?? {});

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToProjects((data) => {
      setProjects(data);
      setLoading(false);
    }, filter);
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  return { projects, loading };
}
