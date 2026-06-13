'use client';
import { Layout } from '@/components/Layout';
import { FileText } from 'lucide-react';

export default function QuotationsPage() {
  return (
    <Layout title="Quotations" subtitle="Manage quotes and proposals" allowedRoles={['admin','manager','customer'] as any}>
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Quotations</h2>
        <p className="text-gray-400 text-sm">This page is coming soon. Quotation management features will be available here.</p>
      </div>
    </Layout>
  );
}
