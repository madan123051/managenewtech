'use client';
import { Layout } from '@/components/Layout';
import { Users } from 'lucide-react';

export default function CustomersPage() {
  return (
    <Layout title="Customers" subtitle="Manage your customers" allowedRoles={['admin','manager'] as any}>
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Customers</h2>
        <p className="text-gray-400 text-sm">This page is coming soon. Customer management features will be available here.</p>
      </div>
    </Layout>
  );
}
