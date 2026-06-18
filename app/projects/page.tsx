'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectList } from '@/components/projects/ProjectList';
import { Spinner } from '@/components/ui/Spinner';
import { useProjects } from '@/hooks/useProjects';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function ProjectsPage() {
  const { portalUser } = useAuth();
  const router = useRouter();
  const filter = portalUser?.role === 'manager'
    ? { managerId: portalUser.uid }
    : portalUser?.role === 'worker'
      ? { workerId: portalUser.uid }
      : portalUser?.role === 'customer'
        ? { customerId: portalUser.uid }
        : {};
  const { projects, loading } = useProjects(filter, { enabled: Boolean(portalUser) });

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager', 'worker', 'customer']}>
      <MainLayout>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      ) : (
        <ProjectList projects={projects} onCreate={() => router.push('/projects/new')} />
      )}
      </MainLayout>
    </ProtectedRoute>
  );
}
