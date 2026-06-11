'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { getProject, updateProject } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import type { Project, ProjectStatus } from '@/types';
import { STATUS_LABELS } from '@/types';
import { format } from 'date-fns';
import { FileText, User, Calendar, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { portalUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getProject(id).then(p => { setProject(p); setLoading(false); });
  }, [id]);

  async function updateStatus(newStatus: ProjectStatus) {
    if (!project) return;
    setUpdating(true);
    try {
      await updateProject(id, { status: newStatus });
      setProject(p => p ? { ...p, status: newStatus } : null);
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
    finally { setUpdating(false); }
  }

  const canEdit = portalUser?.role !== 'customer';
  const statusFlow: ProjectStatus[] = [
    'lead','quotation','approved','site_measurement','production',
    'installation_scheduled','installation_in_progress','completed','warranty_active'
  ];
  const currentIndex = project ? statusFlow.indexOf(project.status) : -1;

  return (
    <Layout title="Project Detail" allowedRoles={['admin','manager','worker','customer']}>
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !project ? (
        <div className="card text-center py-12 text-gray-400">Project not found.</div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{project.projectNumber}</h2>
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="text-lg text-gray-600">{project.title}</h3>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Created: {format(new Date(project.createdAt),'dd MMM yyyy')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium">{project.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">RM {project.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium text-sm">{project.siteAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Manager</p>
                  <p className="font-medium">{project.assignedManagerName ?? 'Unassigned'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Flow */}
          {canEdit && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Project Status</h3>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {statusFlow.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    disabled={updating}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      i === currentIndex
                        ? 'bg-[#1a3a6b] text-white'
                        : i < currentIndex
                        ? 'bg-emerald-100 text-emerald-700 cursor-default'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={STATUS_LABELS[s]}>
                    {STATUS_LABELS[s].split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Workers */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Assigned Workers</h3>
            {project.assignedWorkers.length === 0 ? (
              <p className="text-gray-400 text-sm">No workers assigned</p>
            ) : (
              <div className="space-y-2">
                {project.assignedWorkerNames.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs">
                      {name[0]}
                    </div>
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description & Notes */}
          {project.description && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          )}

          {project.notes.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Notes & Updates</h3>
              <div className="space-y-3">
                {project.notes.map((note, i) => (
                  <div key={i} className="border-l-4 border-orange-300 pl-3 py-1">
                    <p className="text-sm font-medium">{note.addedByName}</p>
                    <p className="text-sm text-gray-600">{note.text}</p>
                    <p className="text-xs text-gray-400">{format(new Date(note.addedAt),'dd MMM yyyy HH:mm')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.photos.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Photos ({project.photos.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.photos.map((p, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                      <div className="w-full p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="font-medium">{p.type}</p>
                        {p.caption && <p className="text-xs">{p.caption}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
