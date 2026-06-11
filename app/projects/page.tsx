'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { getProjects } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import type { Project } from '@/types';
import { Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ProjectsPage() {
  const { portalUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [portalUser]);
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(projects.filter(p =>
      p.projectNumber.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q)
    ));
  }, [search, projects]);

  async function load() {
    setLoading(true);
    let filter = {};
    if (portalUser?.role === 'manager') filter = { managerId: portalUser.uid };
    if (portalUser?.role === 'worker') filter = { workerId: portalUser.uid };
    if (portalUser?.role === 'customer') filter = { customerId: portalUser.uid };
    const data = await getProjects(filter);
    setProjects(data);
    setFiltered(data);
    setLoading(false);
  }

  const allowedRoles = ['admin', 'manager', 'worker', 'customer'];
  const sortedProjects = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Layout title="Projects" subtitle="Track installations and progress" allowedRoles={allowedRoles as any}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="input pl-9" />
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-th">Project #</th>
                  <th className="table-th">Title</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Created</th>
                  <th className="table-th">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedProjects.length === 0 ? (
                  <tr><td colSpan={7} className="table-td text-center text-gray-400 py-12">No projects found</td></tr>
                ) : sortedProjects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td font-medium text-[#1a3a6b]">{p.projectNumber}</td>
                    <td className="table-td">{p.title}</td>
                    <td className="table-td">{p.customerName}</td>
                    <td className="table-td"><StatusBadge status={p.status} /></td>
                    <td className="table-td font-medium">RM {p.totalAmount.toLocaleString()}</td>
                    <td className="table-td text-gray-400">{format(new Date(p.createdAt),'dd MMM yyyy')}</td>
                    <td className="table-td">
                      <Link href={`/projects/${p.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors inline-block">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
