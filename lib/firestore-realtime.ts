import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  limit,
  CollectionReference,
  Query,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { PortalUser, Customer, Lead, Quotation, Project } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDate(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === 'string') return val;
  return new Date().toISOString();
}

/**
 * Wraps onSnapshot with an automatic fallback.
 * If the primary query fails (e.g. missing Firestore index), it retries
 * against the fallback query (usually the bare collection, sorted client-side).
 */
function safeSnapshot<T>(
  primary: Query | CollectionReference,
  fallback: Query | CollectionReference,
  mapDoc: (d: QueryDocumentSnapshot) => T,
  callback: (items: T[]) => void,
  onError?: (err: Error) => void,
  sortFn?: (a: T, b: T) => number
): () => void {
  // Keep a ref to whichever listener is currently active so we can unsub cleanly
  let activeUnsub: () => void = () => {};

  const primaryUnsub = onSnapshot(
    primary as Query,
    (snap) => {
      callback(snap.docs.map(mapDoc));
    },
    (err) => {
      console.error('[Firestore] Primary query failed, using fallback:', err.message);
      // Primary failed → start fallback listener
      activeUnsub = onSnapshot(
        fallback as Query,
        (snap) => {
          let items = snap.docs.map(mapDoc);
          if (sortFn) items = items.sort(sortFn);
          callback(items);
        },
        (fallbackErr) => {
          console.error('[Firestore] Fallback query also failed:', fallbackErr.message);
          if (onError) onError(fallbackErr);
        }
      );
    }
  );

  activeUnsub = primaryUnsub;
  return () => activeUnsub();
}

// ─── Date sort helper ─────────────────────────────────────────────────────────

function byCreatedAtDesc<T extends { createdAt?: string }>(a: T, b: T) {
  return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
}

// ─── Projects ────────────────────────────────────────────────────────────────

function mapProject(d: QueryDocumentSnapshot): Project {
  return {
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
    updatedAt: toDate(d.data().updatedAt),
  } as Project;
}

export function subscribeToProjects(
  callback: (projects: Project[]) => void,
  filter?: { managerId?: string; workerId?: string; customerId?: string },
  onError?: (err: Error) => void
) {
  const ref = collection(db, 'projects');

  // Primary: filtered + ordered (may need composite index)
  let primary: Query;
  let fallback: Query;

  if (filter?.managerId) {
    primary = query(ref, where('assignedManager', '==', filter.managerId), orderBy('createdAt', 'desc'));
    fallback = query(ref, where('assignedManager', '==', filter.managerId));
  } else if (filter?.workerId) {
    primary = query(ref, where('assignedWorkers', 'array-contains', filter.workerId), orderBy('createdAt', 'desc'));
    fallback = query(ref, where('assignedWorkers', 'array-contains', filter.workerId));
  } else if (filter?.customerId) {
    primary = query(ref, where('customerId', '==', filter.customerId), orderBy('createdAt', 'desc'));
    fallback = query(ref, where('customerId', '==', filter.customerId));
  } else {
    primary = query(ref, orderBy('createdAt', 'desc'));
    fallback = ref;
  }

  return safeSnapshot(primary, fallback, mapProject, callback, onError, byCreatedAtDesc);
}

export function subscribeToRecentProjects(
  callback: (projects: Project[]) => void,
  n = 5,
  onError?: (err: Error) => void
) {
  const ref = collection(db, 'projects');
  const primary = query(ref, orderBy('createdAt', 'desc'), limit(n));
  const fallback = ref;

  return safeSnapshot(
    primary,
    fallback,
    mapProject,
    (items) => callback(items.slice(0, n)),
    onError,
    byCreatedAtDesc
  );
}

// ─── Quotations ──────────────────────────────────────────────────────────────

function mapQuotation(d: QueryDocumentSnapshot): Quotation {
  return {
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  } as Quotation;
}

export function subscribeToQuotations(
  callback: (quotations: Quotation[]) => void,
  onError?: (err: Error) => void
) {
  const ref = collection(db, 'quotations');
  const primary = query(ref, orderBy('createdAt', 'desc'));
  return safeSnapshot(primary, ref, mapQuotation, callback, onError, byCreatedAtDesc);
}

// ─── Customers ───────────────────────────────────────────────────────────────

function mapCustomer(d: QueryDocumentSnapshot): Customer {
  return {
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  } as Customer;
}

export function subscribeToCustomers(
  callback: (customers: Customer[]) => void,
  onError?: (err: Error) => void
) {
  const ref = collection(db, 'customers');
  const primary = query(ref, orderBy('createdAt', 'desc'));
  return safeSnapshot(primary, ref, mapCustomer, callback, onError, byCreatedAtDesc);
}

// ─── Leads ───────────────────────────────────────────────────────────────────

function mapLead(d: QueryDocumentSnapshot): Lead {
  return {
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
    updatedAt: toDate(d.data().updatedAt),
  } as Lead;
}

export function subscribeToLeads(
  callback: (leads: Lead[]) => void,
  managerId?: string,
  onError?: (err: Error) => void
) {
  const ref = collection(db, 'leads');
  const primary = managerId
    ? query(ref, where('assignedTo', '==', managerId), orderBy('createdAt', 'desc'))
    : query(ref, orderBy('createdAt', 'desc'));
  const fallback = managerId
    ? query(ref, where('assignedTo', '==', managerId))
    : ref;

  return safeSnapshot(primary, fallback, mapLead, callback, onError, byCreatedAtDesc);
}

// ─── Portal Users ─────────────────────────────────────────────────────────────

function mapUser(d: QueryDocumentSnapshot): PortalUser {
  return {
    uid: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  } as PortalUser;
}

export function subscribeToUsers(
  callback: (users: PortalUser[]) => void,
  role?: string,
  onError?: (err: Error) => void
) {
  const ref = collection(db, 'portalUsers');
  const primary = role
    ? query(ref, where('role', '==', role))
    : query(ref, orderBy('createdAt', 'desc'));
  const fallback = role ? query(ref, where('role', '==', role)) : ref;

  return safeSnapshot(primary, fallback, mapUser, callback, onError, byCreatedAtDesc);
}

// ─── Dashboard Stats (aggregated real-time) ───────────────────────────────────

export interface DashboardStats {
  totalCustomers: number;
  totalLeads: number;
  totalProjects: number;
  totalQuotations: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
  revenueThisMonth: number;
  managers: number;
  workers: number;
}

export function subscribeToDashboardStats(callback: (stats: DashboardStats) => void) {
  let customerCount = 0;
  let leadCount = 0;
  let quotationCount = 0;
  let projectDocs: any[] = [];
  let userDocs: any[] = [];

  function emit() {
    const activeProjects = projectDocs.filter(
      (p) => !['completed', 'warranty_active', 'lead'].includes(p.status)
    ).length;
    const completedProjects = projectDocs.filter(
      (p) => p.status === 'completed' || p.status === 'warranty_active'
    ).length;
    const pendingProjects = projectDocs.filter(
      (p) => p.status === 'pending' || p.status === 'pending_start'
    ).length;
    const now = new Date();
    const revenueThisMonth = projectDocs
      .filter((p) => {
        if (p.status !== 'completed') return false;
        const d =
          p.updatedAt instanceof Timestamp
            ? p.updatedAt.toDate()
            : new Date(p.updatedAt ?? 0);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum: number, p: any) => sum + (Number(p.totalAmount) || 0), 0);

    callback({
      totalCustomers: customerCount,
      totalLeads: leadCount,
      totalProjects: projectDocs.length,
      totalQuotations: quotationCount,
      activeProjects,
      completedProjects,
      pendingProjects,
      revenueThisMonth,
      managers: userDocs.filter((u) => u.role === 'manager').length,
      workers: userDocs.filter((u) => u.role === 'worker').length,
    });
  }

  // Dashboard stats use simple collection listeners (no orderBy = no index issues)
  const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
    customerCount = snap.size;
    emit();
  });
  const unsubLeads = onSnapshot(collection(db, 'leads'), (snap) => {
    leadCount = snap.size;
    emit();
  });
  const unsubQuotations = onSnapshot(collection(db, 'quotations'), (snap) => {
    quotationCount = snap.size;
    emit();
  });
  const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
    projectDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    emit();
  });
  const unsubUsers = onSnapshot(collection(db, 'portalUsers'), (snap) => {
    userDocs = snap.docs.map((d) => d.data());
    emit();
  });

  return () => {
    unsubCustomers();
    unsubLeads();
    unsubQuotations();
    unsubProjects();
    unsubUsers();
  };
}
