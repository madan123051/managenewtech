import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, Timestamp, limit } from 'firebase/firestore';
import { db } from './firebase';
import type { PortalUser, Customer, Lead, Quotation, Project } from '@/types';

function toDate(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === 'string') return val;
  return new Date().toISOString();
}

export async function getPortalUser(uid: string): Promise<PortalUser | null> {
  const snap = await getDoc(doc(db, 'portalUsers', uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { uid: snap.id, ...d, createdAt: toDate(d.createdAt) } as PortalUser;
}

export async function createPortalUser(uid: string, data: Omit<PortalUser, 'uid' | 'createdAt'>): Promise<void> {
  await updateDoc(doc(db, 'portalUsers', uid), { ...data, createdAt: serverTimestamp(), isActive: true }).catch(async () => {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'portalUsers', uid), { ...data, createdAt: serverTimestamp(), isActive: true });
  });
}

export async function getAllUsers(role?: string): Promise<PortalUser[]> {
  const ref = collection(db, 'portalUsers');
  const q = role ? query(ref, where('role', '==', role)) : query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ uid: d.id, ...d.data(), createdAt: toDate(d.data().createdAt) } as PortalUser));
}

export async function updatePortalUser(uid: string, data: Partial<PortalUser>): Promise<void> {
  await updateDoc(doc(db, 'portalUsers', uid), data);
}

export async function getCustomers(): Promise<Customer[]> {
  const snap = await getDocs(query(collection(db, 'customers'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt) } as Customer));
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const snap = await getDoc(doc(db, 'customers', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data(), createdAt: toDate(snap.data()?.createdAt) } as Customer;
}

export async function createCustomer(data: Omit<Customer, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'customers'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
  await updateDoc(doc(db, 'customers', id), data);
}

export async function deleteCustomer(id: string): Promise<void> {
  await deleteDoc(doc(db, 'customers', id));
}

export async function getLeads(managerId?: string): Promise<Lead[]> {
  const ref = collection(db, 'leads');
  const q = managerId ? query(ref, where('assignedTo', '==', managerId), orderBy('createdAt', 'desc')) : query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt), updatedAt: toDate(d.data().updatedAt) } as Lead));
}

export async function getLead(id: string): Promise<Lead | null> {
  const snap = await getDoc(doc(db, 'leads', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data(), createdAt: toDate(snap.data()?.createdAt), updatedAt: toDate(snap.data()?.updatedAt) } as Lead;
}

export async function createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'leads'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<void> {
  await updateDoc(doc(db, 'leads', id), { ...data, updatedAt: serverTimestamp() });
}

export async function getQuotations(): Promise<Quotation[]> {
  const snap = await getDocs(query(collection(db, 'quotations'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt) } as Quotation));
}

export async function getQuotation(id: string): Promise<Quotation | null> {
  const snap = await getDoc(doc(db, 'quotations', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data(), createdAt: toDate(snap.data()?.createdAt) } as Quotation;
}

export async function createQuotation(data: Omit<Quotation, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'quotations'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateQuotation(id: string, data: Partial<Quotation>): Promise<void> {
  await updateDoc(doc(db, 'quotations', id), data);
}

export async function getProjects(filter?: { managerId?: string; workerId?: string; customerId?: string }): Promise<Project[]> {
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
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt), updatedAt: toDate(d.data().updatedAt) } as Project));
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, 'projects', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data(), createdAt: toDate(snap.data()?.createdAt), updatedAt: toDate(snap.data()?.updatedAt) } as Project;
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'projects'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, 'projects', id), { ...data, updatedAt: serverTimestamp() });
}

export async function getDashboardStats() {
  const [customers, leads, projects, users] = await Promise.all([getDocs(collection(db, 'customers')), getDocs(collection(db, 'leads')), getDocs(collection(db, 'projects')), getDocs(collection(db, 'portalUsers'))]);
  const projectDocs = projects.docs.map(d => d.data());
  const activeProjects = projectDocs.filter(p => !['completed', 'warranty_active', 'lead'].includes(p.status)).length;
  const completedProjects = projectDocs.filter(p => p.status === 'completed' || p.status === 'warranty_active').length;
  const userDocs = users.docs.map(d => d.data());
  return { totalCustomers: customers.size, totalLeads: leads.size, totalProjects: projects.size, activeProjects, completedProjects, managers: userDocs.filter(u => u.role === 'manager').length, workers: userDocs.filter(u => u.role === 'worker').length };
}

export async function getRecentProjects(n = 5): Promise<Project[]> {
  const snap = await getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(n)));
  return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt), updatedAt: toDate(d.data().updatedAt) } as Project));
}

export async function getWorkers(): Promise<PortalUser[]> {
  return getAllUsers('worker');
}
