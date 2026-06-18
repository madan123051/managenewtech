'use client';

import { useState } from 'react';
import { Plus, Users, CheckCircle } from 'lucide-react';
import { DataTable, Column } from '../ui/DataTable';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PageHeader } from '../shared/PageHeader';
import { Card, CardContent } from '../ui/Card';
import type { PortalUser } from '@/types';

interface WorkerListProps {
  workers?: PortalUser[];
  isLoading?: boolean;
  onEdit?: (worker: PortalUser) => void;
  onDelete?: (worker: PortalUser) => void;
  onCreate?: () => void;
}

// DataTable requires T extends { id: string }; PortalUser uses `uid`, so we extend it locally
type WorkerRow = PortalUser & { id: string };

export function WorkerList({ 
  workers = [], 
  isLoading = false, 
  onEdit, 
  onDelete, 
  onCreate 
}: WorkerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);

  const filtered = workers.filter(w => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = (w.displayName || '').toLowerCase().includes(q) ||
                         (w.email || '').toLowerCase().includes(q) ||
                         (w.phone?.includes(searchTerm) || false);
    const matchesStatus = statusFilter === null || w.isActive === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Map uid -> id so DataTable's `T extends { id: string }` constraint is satisfied
  const tableData: WorkerRow[] = filtered.map(w => ({ ...w, id: w.uid }));

  const columns: Column<WorkerRow>[] = [
    {
      key: 'displayName',
      header: 'Name',
      sortable: true,
      render: (value) => (
        <p className="font-medium text-sm text-gray-900">{value}</p>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-700 text-sm">
          {value}
        </a>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (value) => (
        <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-700 text-sm">
          {value || '-'}
        </a>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workers"
        description="Manage installation workers and team members"
        actions={
          <Button variant="primary" onClick={onCreate} icon={<Plus className="w-4 h-4" />}>
            Add Worker
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={statusFilter === null ? '' : statusFilter ? 'active' : 'inactive'}
              onChange={(e) => {
                if (!e.target.value) setStatusFilter(null);
                else setStatusFilter(e.target.value === 'active');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        onEdit={onEdit ? (row) => onEdit(row) : undefined}
        onDelete={onDelete ? (row) => onDelete(row) : undefined}
        pageSize={15}
        emptyState={
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No workers found</p>
          </div>
        }
      />
    </div>
  );
}
