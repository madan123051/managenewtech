'use client';
import { useEffect, useState } from 'react';
import { subscribeToUsers } from '@/lib/firestore-realtime';
import type { PortalUser } from '@/types';

export function useUsers(role?: string) {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsub = subscribeToUsers(
      (data) => { setUsers(data); setLoading(false); },
      role,
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, [role]);

  return { users, loading, error };
}
