import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import type { PortalUser, Customer, Lead, Quotation, Project } from '@/types';

function toDate(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === 'string') return val;
  return new Date().toISOString();
}

// ─── Projects ───────────────────────────────────────────────────────────────

export function subscribeToProjects(
  callback: (projects: Project[]) => void,
  filter?: { managerId?: string; workerId?: string; customerId?: string }
) {
  const ref = collection(db, 'projects');
  let q;
  if (filter?.managerId) {
    q = query(ref, where('assignedManager', '==', filter.managerId), orderBy('createdAt', 'desc'));
  } else if (filter?.workerId) {
    q = query(ref, where('assignedWorkers', 'array-contains', filter.workerId), orderBy('createdAt', 'desc'));
  } else if (filter?.customerId) {
    q = query(ref, where('customerId', '==', filter.customerId), orderBy('createdAt', 'desc'));
  } else {
    q = query(ref, orderBy('createdAt', 'desc'));
  }
  return onSnapshot(q, (snap) => {
    const projects = snap.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
          createdAt: toDate(d.data().createdAt),
          updatedAt: toDate(d.data().updatedAt),
        } as Project)
    );
    callback(projects);
  });
}

export function subscribeToRecentProjects(
  callback: (projects: Project[]) => void,
  n = 5
) {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(n));
  return onSnapshot(q, (snap) => {
    const projects = snap.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
          createdAt: toDate(d.data().createdAt),
          updatedAt: toDate(d.data().updatedAt),
        } as Project)
    );
    callback(projects);
  });
}

// ─── Quotations ──────────────────────────────────────────────────────────────

export function subscribeToQuotations(callback: (quotations: Quotation[]) => void) {
  const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const quotations = snap.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
          createdAt: toDate(d.data().createdAt),
        } as Quotation)
    );
    callback(quotations);
  });
}

// ─── Customers ───────────────────────────────────────────────────────────────

export function subscribeToCustomers(callback: (customers: Customer[]) => void) {
  const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const customers = snap.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
          createdAt: toDate(d.data().createdAt),
        } as Customer)
    );
    callback(customers);
  });
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export function subscribeToLeads(
  callback: (leads: Lead[]) => void,
  managerId?: string
) {
  const ref = collection(db, 'leads');
  const q = managerId
    ? query(ref, where('assignedTo', '==', managerId), orderBy('createdAt', 'desc'))
    : query(ref, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const leads = snap.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
          createdAt: toDate(d.data().createdAt),
          updatedAt: toDate(d.data().updatedAt),
        } as Lead)
    );
    callback(leads);
  });
}

// ─── Portal Users ─────────────────────────────────────────────────────────────

export function subscribeToUsers(
  callback: (users: PortalUser[]) => void,
  role?: string
) {
  const ref = collection(db, 'portalUsers');
  const q = role
    ? query(ref, where('role', '==', role))
    : query(ref, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const users = snap.docs.map(
      (d) =>
        ({
          uid: d.id,
          ...d.data(),
          createdAt: toDate(d.data().createdAt),
        } as PortalUser)
    );
    callback(users);
  });
}

// ─── Dashboard Stats (aggregated real-time) ───────────────────────────────────

export interface DashboardStats {
  totalCustomers: number;
  totalLeads: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  managers: number;
  workers: number;
}

export function subscribeToDashboardStats(callback: (stats: DashboardStats) => void) {
  let customerCount = 0;
  let leadCount = 0;
  let projectDocs: any[] = [];
  let userDocs: any[] = [];

  function emit() {
    const activeProjects = projectDocs.filter(
      (p) => !['completed', 'warranty_active', 'lead'].includes(p.status)
    ).length;
    const completedProjects = projectDocs.filter(
      (p) => p.status === 'completed' || p.status === 'warranty_active'
    ).length;
    callback({
      totalCustomers: customerCount,
      totalLeads: leadCount,
      totalProjects: projectDocs.length,
      activeProjects,
      completedProjects,
      managers: userDocs.filter((u) => u.role === 'manager').length,
      workers: userDocs.filter((u) => u.role === 'worker').length,
    });
  }

  const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
    customerCount = snap.size;
    emit();
  });
  const unsubLeads = onSnapshot(collection(db, 'leads'), (snap) => {
    leadCount = snap.size;
    emit();
  });
  const unsubProjects = onSnapshot(
    query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
    (snap) => {
      projectDocs = snap.docs.map((d) => d.data());
      emit();
    }
  );
  const unsubUsers = onSnapshot(collection(db, 'portalUsers'), (snap) => {
    userDocs = snap.docs.map((d) => d.data());
    emit();
  });

  return () => {
    unsubCustomers();
    unsubLeads();
    unsubProjects();
    unsubUsers();
  };
}
