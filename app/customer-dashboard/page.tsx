'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getProjects } from '@/lib/firestore';
import { Briefcase, Clock, CheckCircle } from 'lucide-react';
import type { Project } from '@/types';
import { format } from 'date-fns';

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

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => !['completed', 'warranty_active'].includes(p.status)).length;
  const completedProjects = projects.filter(p => ['completed', 'warranty_active'].includes(p.status)).length;

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <Layout title="My Projects">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-5 text-white">
              <h2 className="text-lg font-bold">Welcome, {portalUser?.displayName}! 🏠</h2>
              <p className="text-green-100 text-sm mt-1">Track the progress of your home projects below.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Total Projects" value={totalProjects} icon={Briefcase} />
              <StatCard label="In Progress" value={activeProjects} icon={Clock} />
              <StatCard label="Completed" value={completedProjects} icon={CheckCircle} />
            </div>

            <div className="card">
              <h2 className="font-semibold mb-4">Your Projects</h2>
              {projects.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No projects found. Contact us to get started!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="table-th">Project #</th>
                        <th className="table-th">Status</th>
                        <th className="table-th">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="table-td font-medium">{p.projectNumber}</td>
                          <td className="table-td"><StatusBadge status={p.status} /></td>
                          <td className="table-td text-gray-500 text-sm">{format(new Date(p.createdAt), 'dd MMM yyyy')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
