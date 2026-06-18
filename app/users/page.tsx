'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { RoleBadge } from '@/components/StatusBadge';
import { updatePortalUser } from '@/lib/firestore';
import { useUsers } from '@/hooks/useUsers';
import { auth } from '@/lib/firebase';
import type { UserRole } from '@/types';
import { Plus, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin',   label: '👑 Admin'   },
  { value: 'manager', label: '🏢 Manager' },
  { value: 'worker',  label: '🔨 Worker'  },
  { value: 'customer', label: '👤 Customer' },
];

const defaultForm = {
  displayName: '',
  email: '',
  phone: '',
  password: '',
  role: 'worker' as UserRole,
};

export default function UsersPage() {
  const { users, loading } = useUsers();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    const createRole = new URLSearchParams(window.location.search).get('create');
    if (createRole === 'admin' || createRole === 'manager' || createRole === 'worker' || createRole === 'customer') {
      setForm((current) => ({ ...current, role: createRole }));
      setShowForm(true);
    }
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.role.includes(q)
    );
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('You are not authenticated. Please log in again.');

      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { error?: string; uid?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      toast.success(`✅ ${form.displayName} (${form.role}) created!`);
      setForm(defaultForm);
      setShowForm(false);
      // Refresh the list
      window.location.reload();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  }

  async function updateRole(uid: string, role: UserRole) {
    await updatePortalUser(uid, { role });
    toast.success('Role updated');
  }

  async function toggleActive(uid: string, isActive: boolean) {
    await updatePortalUser(uid, { isActive: !isActive });
    toast.success(isActive ? 'User deactivated' : 'User activated');
  }

  return (
    <Layout title="User Management" subtitle="Create and manage staff accounts" allowedRoles={['admin']}>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="input pl-9"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create User
          </button>
        </div>

        {/* Create User Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Create New User</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    required
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    className="input"
                    placeholder="e.g. Madan Thapa"
                  />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                    placeholder="e.g. madan@mail.com"
                  />
                </div>
                <div>
                  <label className="label">Password *</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input pr-14"
                      placeholder="Min. 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="label">Role *</label>
                  <select
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                    className="input"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex-1">
                    {saving ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
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
                  <tr>
                    <td colSpan={7} className="table-td text-center text-gray-400 py-12">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                      <td className="table-td font-medium">{u.displayName}</td>
                      <td className="table-td text-gray-500">{u.email}</td>
                      <td className="table-td">{u.phone ?? '–'}</td>
                      <td className="table-td">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u.uid, e.target.value as UserRole)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="table-td">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            u.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-td text-gray-400">
                        {format(new Date(u.createdAt), 'dd MMM yyyy')}
                      </td>
                      <td className="table-td">
                        <button
                          onClick={() => toggleActive(u.uid, u.isActive)}
                          className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                            u.isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
