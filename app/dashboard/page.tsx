'use client';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats, getRecentProjects, getProjects } from '@/lib/firestore';
import { Users, UserCheck, Briefcase, CheckCircle, Clock, Building2, Hammer } from 'lucide-react';
import type { Project } from '@/types';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { portalUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (portalUser?.role === 'admin') {
          const [s, p] = await Promise.all([getDashboardStats(), getRecentProjects(5)]);
          setStats(s);
          setRecentProjects(p);
        } else if (portalUser?.role === 'manager') {
          const p = await getProjects({ managerId: portalUser.uid });
          setRecentProjects(p.slice(0, 5));
          setStats({ totalProjects: p.length, activeProjects: p.filter(x => !['completed','warranty_active'].includes(x.status)).length, completedProjects: p.filter(x => x.status === 'completed' || x.status === 'warranty_active').length });
        } else if (portalUser?.role === 'worker') {
          const p = await getProjects({ workerId: portalUser.uid });
          setRecentProjects(p.slice(0, 5));
          setStats({ totalProjects: p.length });
        } else if (portalUser?.role === 'customer') {
          const p = await getProjects({ customerId: portalUser.uid });
          setRecentProjects(p.slice(0, 5));
          setStats({ totalProjects: p.length });
        }
      } finally {
        setLoading(false);
      }
    }
    if (portalUser) load();
  }, [portalUser]);

  return (
    <Layout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-6">
          {portalUser?.role === 'admin' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Customers" value={stats.totalCustomers} icon={Users} />
              <StatCard label="Projects" value={stats.totalProjects} icon={Briefcase} />
              <StatCard label="Active" value={stats.activeProjects} icon={Clock} />
            </div>
          )}
          <div className="card">
            <h2 className="font-semibold mb-4">Recent Projects</h2>
            <table className="w-full">
              <thead><tr className="border-b"><th className="table-th">Project</th><th className="table-th">Customer</th><th className="table-th">Status</th></tr></thead>
              <tbody>{recentProjects.map(p => <tr key={p.id}><td className="table-td">{p.projectNumber}</td><td className="table-td">{p.customerName}</td><td className="table-td"><StatusBadge status={p.status} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
