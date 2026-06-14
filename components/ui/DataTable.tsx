'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
  pageSize?: number;
  emptyState?: React.ReactNode;
  selectable?: boolean;
  onSelectRows?: (rows: T[]) => void;
}

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  onRowClick, 
  onEdit, 
  onDelete, 
  isLoading = false, 
  pageSize = 10,
  emptyState,
  selectable = false,
  onSelectRows,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(data.length / pageSize);
  const startIdx = currentPage * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedData = data.slice(startIdx, endIdx);

  const handleSort = (columnKey: string) => {
    setSortConfig((prev) => {
      if (prev?.key === columnKey) {
        return { key: columnKey, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedData.map((row) => row.id));
      setSelectedRows(newSelected);
      onSelectRows?.(paginatedData.filter((row) => newSelected.has(row.id)));
    } else {
      setSelectedRows(new Set());
      onSelectRows?.([]);
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    onSelectRows?.(paginatedData.filter((row) => newSelected.has(row.id)));
  };

  const allSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedRows.has(row.id));

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          {emptyState || 'No data available'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn('px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider', col.width)}
                >
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => col.sortable && handleSort(String(col.key))}>
                    {col.header}
                    {col.sortable && sortConfig?.key === String(col.key) && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors" onClick={() => onRowClick?.(row)}>
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-4 text-sm text-gray-900">
                    {col.render ? col.render((row as any)[String(col.key)], row) : (row as any)[String(col.key)]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-sm text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    {onEdit && <Button size="xs" variant="secondary" onClick={() => onEdit(row)}>Edit</Button>}
                    {onDelete && <Button size="xs" variant="danger" onClick={() => onDelete(row)}>Delete</Button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm text-gray-600">Page {currentPage + 1} of {totalPages}</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              icon={<ChevronLeft className="w-4 h-4" />}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              icon={<ChevronRight className="w-4 h-4" />}
            />
          </div>
        </div>
      )}
    </div>
  );
}