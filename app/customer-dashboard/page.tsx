'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getProjects } from '@/lib/firestore';
import { Spinner } from '@/components/ui/Spinner';
import type { Project } from '@/types';

export default function CustomerDashboardPage() {
  const { portalUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!portalUser) return;
      try {
        const p = await getProjects({ customerId: portalUser.uid });
        setProjects(p);
      } finally {
        setLoading(false);
      }
    }
    if (portalUser) load();
  }, [portalUser]);

  const stats = {
    activeProjects: projects.filter(p => !['completed', 'warranty_active'].includes(p.status)).length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalSpent: projects.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
    warranty: projects.filter(p => p.status === 'warranty_active').length,
  };

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
