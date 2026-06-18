'use client';

import { useState } from 'react';
import { Plus, Mail, Phone } from 'lucide-react';
import { DataTable, Column } from '../ui/DataTable';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PageHeader } from '../shared/PageHeader';
import { Card, CardContent } from '../ui/Card';
import type { Customer } from '@/types';

interface CustomerListProps {
  customers?: Customer[];
  isLoading?: boolean;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onCreate?: () => void;
}

export function CustomerList({ 
  customers = [], 
  isLoading = false, 
  onEdit, 
  onDelete, 
  onCreate 
}: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    return (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(searchTerm);
  });

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-sm text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{row.city}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
          <Mail className="w-3 h-3" />
          {value}
        </a>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (value) => (
        <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {value}
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer database"
        actions={
          <Button variant="primary" onClick={onCreate} icon={<Plus className="w-4 h-4" />}>
            Add Customer
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          />
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyState={
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No customers found</p>
          </div>
        }
      />
    </div>
  );
}
