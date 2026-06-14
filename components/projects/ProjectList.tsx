'use client';

import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { DataTable, Column } from '../ui/DataTable';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PageHeader } from '../shared/PageHeader';
import { Card, CardContent } from '../ui/Card';
import { getStatusColor } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectListProps {
  projects?: Project[];
  isLoading?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onCreate?: () => void;
}

export function ProjectList({ 
  projects = [], 
  isLoading = false, 
  onEdit, 
  onDelete, 
  onCreate 
}: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Project>[] = [
    {
      key: 'projectNumber',
      header: 'Project ID',
      width: 'w-20',
      render: (value) => <span className="font-mono text-sm text-gray-700">{value}</span>,
    },
    {
      key: 'title',
      header: 'Project Title',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-sm text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">Customer: {row.customerName}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const color = getStatusColor(value);
        return <Badge variant={color as any}>{value?.replace(/_/g, ' ')}</Badge>;
      },
    },
    {
      key: 'assignedManagerName',
      header: 'Manager',
      render: (value) => <span className="text-sm text-gray-700">{value || '-'}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (value) => <span className="font-semibold text-sm text-gray-900">₹{(value / 100000).toFixed(1)}L</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage all your projects"
        actions={
          <Button variant="primary" onClick={onCreate} icon={<Plus className="w-4 h-4" />}>
            New Project
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search projects..."
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
              <option value="lead">Lead</option>
              <option value="quotation">Quotation</option>
              <option value="approved">Approved</option>
              <option value="site_measurement">Site Measurement</option>
              <option value="production">Production</option>
              <option value="installation_scheduled">Installation Scheduled</option>
              <option value="installation_in_progress">Installation In Progress</option>
              <option value="completed">Completed</option>
              <option value="warranty_active">Warranty Active</option>
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
            <p className="text-gray-600 font-medium">No projects found</p>
            <Button variant="primary" size="sm" onClick={onCreate} className="mt-4">
              Create First Project
            </Button>
          </div>
        }
      />
    </div>
  );
}