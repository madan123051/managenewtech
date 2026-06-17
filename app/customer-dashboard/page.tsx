'use client';

export const dynamic = 'force-dynamic';

import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import { useProjects } from '@/hooks/useProjects';

export default function CustomerDashboardPage() {
  const { portalUser } = useAuth();

  const { projects, loading } = useProjects(
    portalUser ? { customerId: portalUser.uid } : undefined,
    { enabled: Boolean(portalUser) }
  );

  const stats = useMemo(
    () => ({
      activeProjects: projects.filter(
        (p) => !['completed', 'warranty_active'].includes(p.status)
      ).length,
      completedProjects: projects.filter((p) => p.status === 'completed').length,
      totalSpent: projects.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
      warranty: projects.filter((p) => p.status === 'warranty_active').length,
    }),
    [projects]
  );

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <MainLayout>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Spinner />
          </div>
        ) : (
          <CustomerDashboard
            stats={stats}
            projects={projects}
            userName={portalUser?.displayName || 'Customer'}
          />
        )}
      </MainLayout>
    </ProtectedRoute>
  );
}