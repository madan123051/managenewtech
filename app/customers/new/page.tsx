'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createCustomer } from '@/lib/firestore';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  notes: '',
};

export default function NewCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createCustomer(form);
      toast.success('Customer created successfully');
      router.push('/customers');
    } catch (err) {
      console.error('[create-customer]', err);
      toast.error((err as Error)?.message || 'Failed to create customer');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <MainLayout>
        <PageHeader title="New Customer" description="Create a customer profile in Firebase" />
        <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4">
          <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <div>
            <label className="label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="input"
              placeholder="Optional notes"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={saving}>Create Customer</Button>
            <Button type="button" variant="outline" onClick={() => router.push('/customers')} disabled={saving}>Cancel</Button>
          </div>
        </form>
      </MainLayout>
    </ProtectedRoute>
  );
}
