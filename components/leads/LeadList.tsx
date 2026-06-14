'use client';

import { useState } from 'react';
import { Plus, Phone, Mail } from 'lucide-react';
import { DataTable, Column } from '../ui/DataTable';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PageHeader } from '../shared/PageHeader';
import { Card, CardContent } from '../ui/Card';
import { getStatusColor } from '@/lib/utils';
import type { Lead } from '@/types';

interface LeadListProps {
  leads?: Lead[];
  isLoading?: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  onConvert?: (lead: Lead) => void;
  onCreate?: () => void;
}

export function LeadList({ 
  leads = [], 
  isLoading = false, 
  onEdit, 
  onDelete,
  onConvert,
  onCreate 
}: LeadListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = leads.filter(l => {
    const matchesSearch = l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         l.customerPhone.includes(searchTerm) ||
                         l.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Lead>[] = [
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-sm text-gray-900">{value}</p>
          <div className="flex gap-2 mt-1">
            <a href={`tel:${row.customerPhone}`} className="text-blue-600 hover:text-blue-700 text-xs inline-flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {row.customerPhone}
            </a>
          </div>
        </div>
      ),
    },
    {
      key: 'customerEmail',
      header: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
          <Mail className="w-3 h-3" />
          {value}
        </a>
      ),
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
      key: 'source',
      header: 'Source',
      render: (value) => (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize text-gray-700">
          {value?.replace(/_/g, ' ')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Track and manage your sales leads"
        actions={
          <Button variant="primary" onClick={onCreate} icon={<Plus className="w-4 h-4" />}>
            New Lead
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
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
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
        pageSize={15}
        emptyState={
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No leads found</p>
            <Button variant="primary" size="sm" onClick={onCreate} className="mt-4">
              Create First Lead
            </Button>
          </div>
        }
      />
    </div>
  );
}
"