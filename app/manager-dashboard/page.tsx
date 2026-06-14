'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getProjects } from '@/lib/firestore';
import { Spinner } from '@/components/ui/Spinner';
import type { Project } from '@/types';

export default function ManagerDashboardPage() {
  const { portalUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!portalUser) return;
      try {
        const p = await getProjects({ managerId: portalUser.uid });
        setProjects(p);
      } finally {
        setLoading(false);
      }
    }
    if (portalUser) load();
  }, [portalUser]);

  const stats = {
    assignedProjects: projects.length,
    completedThisMonth: projects.filter(p => ['completed', 'warranty_active'].includes(p.status)).length,
    pendingTasks: projects.filter(p => !['completed', 'warranty_active'].includes(p.status)).length,
    assignedWorkers: 0,
  };

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <MainLayout>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Spinner />
          </div>
        ) : (
          <ManagerDashboard 
            stats={stats} 
            assignedProjects={projects} 
            userName={portalUser?.displayName || 'Manager'}
          />
        )}
      </MainLayout>
    </ProtectedRoute>
  );
}
