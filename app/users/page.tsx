'use client';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { RoleBadge } from '@/components/StatusBadge';
import { getAllUsers, updatePortalUser, createPortalUser } from '@/lib/firestore';
import type { PortalUser, UserRole } from '@/types';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [filtered, setFiltered] = useState<PortalUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ displayName: '', email: '', phone: '', role: 'worker' as UserRole });

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.role.includes(q)
    ));
  }, [search, users]);

  async function load() {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setFiltered(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Note: In production, send this to a server function that creates Firebase auth user
      toast.error('User creation requires server-side Firebase Admin SDK. Set up an API route.');
    } catch { toast.error('Failed to create user'); }
    finally { setSaving(false); }
  }

  async function updateRole(uid: string, role: UserRole) {
    await updatePortalUser(uid, { role });
    toast.success('Role updated');
    load();
  }

  async function toggleActive(uid: string, isActive: boolean) {
    await updatePortalUser(uid, { isActive: !isActive });
    toast.success(isActive ? 'User deactivated' : 'User activated');
    load();
  }

  return (
    <Layout title="User Management" subtitle="Manage all portal users" allowedRoles={['admin']}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input pl-9" />
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Invite User
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Invite User</h2>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="label">Full Name *</label>
                  <input required value={form.displayName} onChange={e => setForm({...form,displayName:e.target.value})} className="input" />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} className="input" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} className="input" />
                </div>
                <div>
                  <label className="label">Role *</label>
                  <select required value={form.role} onChange={e => setForm({...form,role:e.target.value as UserRole})} className="input">
                    <option value="worker">Worker</option>
                    <option value="manager">Manager</option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Sending...' : 'Invite User'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  <th className="table-th">Role</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Added</th>
                  <th className="table-th">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="table-td text-center text-gray-400 py-12">No users found</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td font-medium">{u.displayName}</td>
                    <td className="table-td text-gray-500">{u.email}</td>
                    <td className="table-td">{u.phone ?? '–'}</td>
                    <td className="table-td">
                      <select value={u.role} onChange={e => updateRole(u.uid, e.target.value as UserRole)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="worker">Worker</option>
                        <option value="customer">Customer</option>
                      </select>
                    </td>
                    <td className="table-td">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-td text-gray-400">{format(new Date(u.createdAt),'dd MMM yyyy')}</td>
                    <td className="table-td">
                      <button onClick={() => toggleActive(u.uid, u.isActive)} className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
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
