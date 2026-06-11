'use client';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { RoleBadge } from '@/components/StatusBadge';
import { getAllUsers, updatePortalUser } from '@/lib/firestore';
import type { PortalUser } from '@/types';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ManagersPage() {
  const [managers, setManagers] = useState<PortalUser[]>([]);
  const [filtered, setFiltered] = useState<PortalUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(managers.filter(m =>
      m.displayName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone?.includes(q)
    ));
  }, [search, managers]);

  async function load() {
    setLoading(true);
    const data = await getAllUsers('manager');
    setManagers(data);
    setFiltered(data);
    setLoading(false);
  }

  async function toggleActive(uid: string, isActive: boolean) {
    await updatePortalUser(uid, { isActive: !isActive });
    toast.success(isActive ? 'Manager deactivated' : 'Manager activated');
    load();
  }

  return (
    <Layout title="Managers" subtitle="Manage project managers" allowedRoles={['admin']}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search managers..." className="input pl-9" />
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
                  <th className="table-th">Name</th>
                  <th className="table-th">Email</th>
                  <th className="table-th">Phone</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Added</th>
                  <th className="table-th">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="table-td text-center text-gray-400 py-12">No managers found</td></tr>
                ) : filtered.map(m => (
                  <tr key={m.uid} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td font-medium">{m.displayName}</td>
                    <td className="table-td text-gray-500">{m.email}</td>
                    <td className="table-td">{m.phone ?? '–'}</td>
                    <td className="table-td">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {m.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-td text-gray-400">{format(new Date(m.createdAt),'dd MMM yyyy')}</td>
                    <td className="table-td">
                      <button onClick={() => toggleActive(m.uid, m.isActive)} className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${m.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                        {m.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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
