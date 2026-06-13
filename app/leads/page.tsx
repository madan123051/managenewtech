'use client';
import { Layout } from '@/components/Layout';
import { UserCheck } from 'lucide-react';

export default function LeadsPage() {
  return (
    <Layout title="Leads" subtitle="Track potential customers" allowedRoles={['admin','manager'] as any}>
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
          <UserCheck className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Leads</h2>
        <p className="text-gray-400 text-sm">This page is coming soon. Lead tracking features will be available here.</p>
      </div>
    </Layout>
  );
}
