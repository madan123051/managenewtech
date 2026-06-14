'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { WorkerDashboard } from '@/components/dashboard/WorkerDashboard';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats, getRecentProjects, getProjects } from '@/lib/firestore';
import { Spinner } from '@/components/ui/Spinner';
import type { Project } from '@/types';

export default function DashboardPage() {
  const { portalUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!portalUser) return;

        if (portalUser.role === 'admin') {
          const [s, p] = await Promise.all([getDashboardStats(), getRecentProjects(5)]);
          setStats(s);
          setProjects(p);
        } else if (portalUser.role === 'manager') {
          const p = await getProjects({ managerId: portalUser.uid });
          setProjects(p.slice(0, 5));
          setStats({ 
            totalProjects: p.length, 
            activeProjects: p.filter(x => !['completed','warranty_active'].includes(x.status)).length, 
            completedProjects: p.filter(x => x.status === 'completed' || x.status === 'warranty_active').length 
          });
        } else if (portalUser.role === 'worker') {
          const p = await getProjects({ workerId: portalUser.uid });
          setProjects(p.slice(0, 5));
          setStats({ totalProjects: p.length });
        } else if (portalUser.role === 'customer') {
          const p = await getProjects({ customerId: portalUser.uid });
          setProjects(p.slice(0, 5));
          setStats({ totalProjects: p.length });
        }
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [portalUser]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {portalUser?.role === 'admin' && stats && (
        <AdminDashboard stats={stats} projects={projects} />
      )}
      {portalUser?.role === 'manager' && stats && (
        <ManagerDashboard stats={stats} projects={projects} userName={portalUser?.displayName || 'Manager'} />
      )}
      {portalUser?.role === 'worker' && stats && (
        <WorkerDashboard stats={stats} projects={projects} userName={portalUser?.displayName || 'Worker'} />
      )}
      {portalUser?.role === 'customer' && stats && (
        <CustomerDashboard stats={stats} projects={projects} userName={portalUser?.displayName || 'Customer'} />
      )}
    </MainLayout>
  );
}
