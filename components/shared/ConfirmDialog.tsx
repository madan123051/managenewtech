'use client';

import { AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isDangerous?: boolean;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isDangerous = false,
  isLoading = false,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  const actions = (
    <>
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        {cancelLabel}
      </Button>
      <Button
        variant={isDangerous ? 'danger' : 'primary'}
        onClick={onConfirm}
        isLoading={isLoading}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm" actions={actions}>
      <div className="space-y-4">
        {isDangerous && (
          <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">This action cannot be undone.</p>
          </div>
        )}
        <p className="text-gray-700">{description}</p>
      </div>
    </Modal>
  );
}
"