export type UserRole = 'admin' | 'manager' | 'worker' | 'customer';

export type ProjectStatus = 'lead' | 'quotation' | 'approved' | 'site_measurement' | 'production' | 'installation_scheduled' | 'installation_in_progress' | 'completed' | 'warranty_active';

export type ProductCategory = 'Roller Blinds' | 'Zebra Blinds' | 'Wooden Blinds' | 'Printed Blinds' | 'Polyester Pleated Mesh' | 'SS304 Pleated Mesh' | 'Honeycomb Blackout' | '2 in 1 Pleated Mesh + Honeycomb' | 'PVC Partition' | 'Crystal Partition Door' | 'Security Mesh';

export interface PortalUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  assignedProjects?: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  createdAt: string;
  uid?: string;
}

export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productInterest: ProductCategory[];
  source: 'website' | 'referral' | 'walk_in' | 'social_media' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  product: ProductCategory;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  leadId?: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  validUntil: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface ProjectPhoto {
  url: string;
  type: 'before' | 'after' | 'site' | 'progress';
  uploadedBy: string;
  uploadedByName: string;
  caption?: string;
  uploadedAt: string;
}

export interface ProjectNote {
  text: string;
  addedBy: string;
  addedByName: string;
  addedAt: string;
}

export interface Project {
  id: string;
  projectNumber: string;
  customerId: string;
  customerName: string;
  quotationId?: string;
  title: string;
  description: string;
  category: ProductCategory[];
  status: ProjectStatus;
  assignedManager?: string;
  assignedManagerName?: string;
  assignedWorkers: string[];
  assignedWorkerNames: string[];
  siteAddress: string;
  scheduledDate?: string;
  completedDate?: string;
  warrantyExpiry?: string;
  photos: ProjectPhoto[];
  notes: ProjectNote[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  lead: 'Lead',
  quotation: 'Quotation',
  approved: 'Approved',
  site_measurement: 'Site Measurement',
  production: 'Production',
  installation_scheduled: 'Installation Scheduled',
  installation_in_progress: 'Installation In Progress',
  completed: 'Completed',
  warranty_active: 'Warranty Active',
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  lead: 'bg-gray-100 text-gray-700',
  quotation: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  site_measurement: 'bg-yellow-100 text-yellow-700',
  production: 'bg-orange-100 text-orange-700',
  installation_scheduled: 'bg-purple-100 text-purple-700',
  installation_in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-teal-100 text-teal-700',
  warranty_active: 'bg-emerald-100 text-emerald-700',
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Roller Blinds',
  'Zebra Blinds',
  'Wooden Blinds',
  'Printed Blinds',
  'Polyester Pleated Mesh',
  'SS304 Pleated Mesh',
  'Honeycomb Blackout',
  '2 in 1 Pleated Mesh + Honeycomb',
  'PVC Partition',
  'Crystal Partition Door',
  'Security Mesh',
];
