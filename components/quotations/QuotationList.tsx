'use client';

import { useState } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import { DataTable, Column } from '../ui/DataTable';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PageHeader } from '../shared/PageHeader';
import { Card, CardContent } from '../ui/Card';
import { formatDate, getStatusColor } from '@/lib/utils';
import type { Quotation } from '@/types';

interface QuotationListProps {
  quotations?: Quotation[];
  isLoading?: boolean;
  onEdit?: (quotation: Quotation) => void;
  onDelete?: (quotation: Quotation) => void;
  onPreview?: (quotation: Quotation) => void;
  onExport?: (quotation: Quotation) => void;
  onCreate?: () => void;
}

export function QuotationList({ 
  quotations = [], 
  isLoading = false, 
  onEdit, 
  onDelete,
  onPreview,
  onExport,
  onCreate 
}: QuotationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = quotations.filter(q => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (q.quotationNumber || '').toLowerCase().includes(term) ||
                         (q.customerName || '').toLowerCase().includes(term);
    const matchesStatus = !statusFilter || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Quotation>[] = [
    {
      key: 'quotationNumber',
      header: 'Quote #',
      width: 'w-24',
      render: (value) => <span className="font-mono font-semibold text-gray-900">{value}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-sm text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{row.leadId ? 'From Lead' : 'Direct'}</p>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Amount',
      render: (value) => <span className="font-semibold text-gray-900">₹{((Number(value) || 0) / 100000).toFixed(1)}L</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const color = getStatusColor(value);
        return <Badge variant={color as any}>{value}</Badge>;
      },
    },
    {
      key: 'validUntil',
      header: 'Valid Until',
      render: (value) => <span className="text-sm text-gray-700">{value ? formatDate(value) : '-'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Create and manage quotations"
        actions={
          <Button variant="primary" onClick={onCreate} icon={<Plus className="w-4 h-4" />}>
            New Quotation
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by quote number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Custom render for data table with extra actions */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {columns.map((col) => (
                    <th key={String(col.key)} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      {col.header}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="p-8 text-center text-gray-500">
                      <div className="py-8">
                        <p className="text-sm text-gray-600 font-medium">No quotations found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                      {columns.map((col) => (
                        <td key={String(col.key)} className="px-6 py-4 text-sm text-gray-900">
                          {col.render ? col.render((quote as any)[String(col.key)], quote) : (quote as any)[String(col.key)]}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-sm text-right space-x-2 flex items-center justify-end gap-2">
                        {onPreview && <Button size="xs" variant="ghost" onClick={() => onPreview(quote)} icon={<Eye className="w-3 h-3" />} />}
                        {onExport && <Button size="xs" variant="outline" onClick={() => onExport(quote)} icon={<Download className="w-3 h-3" />} />}
                        {onEdit && <Button size="xs" variant="secondary" onClick={() => onEdit(quote)}>Edit</Button>}
                        {onDelete && <Button size="xs" variant="danger" onClick={() => onDelete(quote)}>Delete</Button>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}