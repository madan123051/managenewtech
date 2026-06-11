import { STATUS_LABELS, STATUS_COLORS } from '@/types';
import type { ProjectStatus } from '@/types';

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
