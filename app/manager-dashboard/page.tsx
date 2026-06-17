'use client';

export const dynamic = 'force-dynamic';

import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import { useProjects } from '@/hooks/useProjects';

export default function ManagerDashboardPage() {
  const { portalUser } = useAuth();

  const { projects, loading } = useProjects(
    portalUser ? { managerId: portalUser.uid } : undefined,
    { enabled: Boolean(portalUser) }
  );

  const stats = useMemo(
    () => ({
      assignedProjects: projects.length,
      completedThisMonth: projects.filter((p) =>
        ['completed', 'warranty_active'].includes(p.status)
      ).length,
      pendingTasks: projects.filter(
        (p) => !['completed', 'warranty_active'].includes(p.status)
      ).length,
      assignedWorkers: 0,
    }),
    [projects]
  );

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
