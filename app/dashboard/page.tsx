'use client';

export const dynamic = 'force-dynamic';

import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { WorkerDashboard } from '@/components/dashboard/WorkerDashboard';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProjects } from '@/hooks/useProjects';

export default function DashboardPage() {
  const { portalUser } = useAuth();

  const { stats: adminStats, loading: statsLoading } = useDashboardStats({
    enabled: portalUser?.role === 'admin',
  });

  const { projects: allProjects, loading: allProjectsLoading } = useProjects(
    {},
    { enabled: portalUser?.role === 'admin' }
  );

  const { projects: managerProjects, loading: managerLoading } = useProjects(
    portalUser?.role === 'manager' ? { managerId: portalUser.uid } : undefined,
    { enabled: portalUser?.role === 'manager' }
  );

  const { projects: workerProjects, loading: workerLoading } = useProjects(
    portalUser?.role === 'worker' ? { workerId: portalUser.uid } : undefined,
    { enabled: portalUser?.role === 'worker' }
  );

  const { projects: customerProjects, loading: customerLoading } = useProjects(
    portalUser?.role === 'customer' ? { customerId: portalUser.uid } : undefined,
    { enabled: portalUser?.role === 'customer' }
  );

  const managerStats = useMemo(() => ({
    assignedProjects: managerProjects.length,
    completedThisMonth: managerProjects.filter((p) =>
      ['completed', 'warranty_active'].includes(p.status)
    ).length,
    pendingTasks: managerProjects.filter(
      (p) => !['completed', 'warranty_active'].includes(p.status)
    ).length,
    assignedWorkers: 0,
  }), [managerProjects]);

  const workerStats = useMemo(() => ({
    todayJobs: workerProjects.filter(
      (p) => !['completed', 'warranty_active'].includes(p.status)
    ).length,
    completedJobs: workerProjects.filter((p) => p.status === 'completed').length,
    totalHours: 0,
    rating: 0,
  }), [workerProjects]);

  const customerStats = useMemo(() => ({
    activeProjects: customerProjects.filter(
      (p) => !['completed', 'warranty_active'].includes(p.status)
    ).length,
    completedProjects: customerProjects.filter((p) => p.status === 'completed').length,
    totalSpent: customerProjects.reduce((sum, p) => sum + ((p as any).totalAmount || 0), 0),
    warranty: customerProjects.filter((p) => p.status === 'warranty_active').length,
  }), [customerProjects]);

  const loading =
    statsLoading || allProjectsLoading || managerLoading || workerLoading || customerLoading;

  if (loading || !portalUser) {
    return (
      <ProtectedRoute>
        <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
      {portalUser.role === 'admin' && adminStats && (
        <AdminDashboard stats={adminStats} recentProjects={allProjects.slice(0, 5)} />
      )}
      {portalUser.role === 'manager' && (
        <ManagerDashboard
          stats={managerStats}
          assignedProjects={managerProjects}
          userName={portalUser.displayName || 'Manager'}
        />
      )}
      {portalUser.role === 'worker' && (
        <WorkerDashboard
          stats={workerStats}
          todayJobs={workerProjects}
          userName={portalUser.displayName || 'Worker'}
        />
      )}
      {portalUser.role === 'customer' && (
        <CustomerDashboard
          stats={customerStats}
          projects={customerProjects}
          userName={portalUser.displayName || 'Customer'}
        />
      )}
      </MainLayout>
    </ProtectedRoute>
  );
}