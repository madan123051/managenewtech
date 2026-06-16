'use client';
import { useEffect, useState } from 'react';
import { subscribeToUsers } from '@/lib/firestore-realtime';
import type { PortalUser } from '@/types';

export function useUsers(role?: string) {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToUsers((data) => {
      setUsers(data);
      setLoading(false);
    }, role);
    return unsub;
  }, [role]);

  return { users, loading };
}
