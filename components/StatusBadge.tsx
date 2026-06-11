import { STATUS_LABELS, STATUS_COLORS } from '@/types';
import type { ProjectStatus, UserRole } from '@/types';

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  worker: 'bg-green-100 text-green-800',
  customer: 'bg-purple-100 text-purple-800',
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  worker: 'Worker',
  customer: 'Customer',
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}
