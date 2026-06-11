'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { RoleBadge } from '@/components/StatusBadge';
import { getAllUsers, updatePortalUser, createPortalUser } from '@/lib/firestore';
import type { PortalUser } from '@/types';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<PortalUser[]>([]);
  const [filtered, setFiltered] = useState<PortalUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(workers.filter(w =>
      w.displayName.toLowerCase().includes(q) ||
      w.email.toLowerCase().includes(q) ||
      w.phone?.includes(q)
    ));
  }, [search, workers]);

  async function load() {
    setLoading(true);
    const data = await getAllUsers('worker');
    setWorkers(data);
    setFiltered(data);
    setLoading(false);
  }

  async function toggleActive(uid: string, isActive: boolean) {
    await updatePortalUser(uid, { isActive: !isActive });
    toast.success(isActive ? 'Worker deactivated' : 'Worker activated');
    load();
  }

  return (
    <Layout title="Workers" subtitle="Manage installation workers" allowedRoles={['admin','manager']}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workers..." className="input pl-9" />
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
                  <tr><td colSpan={6} className="table-td text-center text-gray-400 py-12">No workers found</td></tr>
                ) : filtered.map(w => (
                  <tr key={w.uid} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td font-medium">{w.displayName}</td>
                    <td className="table-td text-gray-500">{w.email}</td>
                    <td className="table-td">{w.phone ?? '–'}</td>
                    <td className="table-td">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${w.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {w.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-td text-gray-400">{format(new Date(w.createdAt),'dd MMM yyyy')}</td>
                    <td className="table-td">
                      <button onClick={() => toggleActive(w.uid, w.isActive)} className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${w.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                        {w.isActive ? 'Deactivate' : 'Activate'}
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
