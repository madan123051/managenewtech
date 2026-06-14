'use client';

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import type { Customer } from '@/types';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Customer>) => Promise<void> | void;
  customer?: Customer;
  isLoading?: boolean;
}

export function CustomerForm({ isOpen, onClose, onSubmit, customer, isLoading = false }: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>(customer || {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customer ? 'Edit Customer' : 'New Customer'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />
        <Input
          label="Phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          required
        />
        <Input
          label="Address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          error={errors.address}
          required
        />
        <Input
          label="City"
          value={formData.city || ''}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          error={errors.city}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#1a3a6b] focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </form>
      <div className="flex gap-3 justify-end mt-6">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
          {customer ? 'Update' : 'Create'} Customer
        </Button>
      </div>
    </Modal>
  );
}
"