export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter((c) => typeof c === 'string')
    .join(' ')
    .trim();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'new': 'gray',
    'contacted': 'blue',
    'qualified': 'yellow',
    'converted': 'green',
    'lost': 'red',
    'lead': 'gray',
    'quotation': 'blue',
    'approved': 'green',
    'site_measurement': 'yellow',
    'production': 'orange',
    'installation_scheduled': 'purple',
    'installation_in_progress': 'indigo',
    'completed': 'teal',
    'warranty_active': 'emerald',
    'draft': 'gray',
    'sent': 'blue',
    'rejected': 'red',
    'expired': 'red',
  };
  return colors[status] || 'gray';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ''));
}"