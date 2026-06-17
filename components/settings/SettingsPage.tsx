'use client';

import { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Settings2,
  Briefcase,
  Shield,
  HardHat,
  ChevronRight,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

// ─── helpers ────────────────────────────────────────────────────────────────

function SectionCard({ title, description, children }: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function FieldRow({ label, hint, children }: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <div className="sm:w-48 shrink-0">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] transition"
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] transition bg-white"
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange, label }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-[#1a3a6b]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute left-0.5 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function SaveButton({ loading, saved }: { loading: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a3a6b] text-white text-sm font-medium hover:bg-[#1a3a6b]/90 transition disabled:opacity-60"
    >
      {saved ? (
        <><CheckCircle className="w-4 h-4" /> Saved!</>
      ) : (
        <><Save className="w-4 h-4" /> {loading ? 'Saving…' : 'Save Changes'}</>
      )}
    </button>
  );
}

// ─── tab definitions per role ────────────────────────────────────────────────

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const TABS: Tab[] = [
  { id: 'profile',       label: 'Profile',        icon: User,      roles: ['admin','manager','worker','customer'] },
  { id: 'security',      label: 'Security',        icon: Lock,      roles: ['admin','manager','worker','customer'] },
  { id: 'notifications', label: 'Notifications',   icon: Bell,      roles: ['admin','manager','worker','customer'] },
  { id: 'system',        label: 'System',          icon: Settings2, roles: ['admin'] },
  { id: 'team',          label: 'Team',            icon: Briefcase, roles: ['admin','manager'] },
  { id: 'work',          label: 'Work Preferences',icon: HardHat,   roles: ['worker'] },
  { id: 'privacy',       label: 'Privacy',         icon: Shield,    roles: ['customer'] },
];

// ─── individual tab panels ───────────────────────────────────────────────────

function ProfileTab({ portalUser }: { portalUser: NonNullable<ReturnType<typeof useAuth>['portalUser']> }) {
  const [form, setForm] = useState({
    displayName: portalUser.displayName || '',
    email: portalUser.email || '',
    phone: portalUser.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionCard title="Personal Information" description="Your name and contact details visible across the platform.">
        <FieldRow label="Full Name">
          <Input
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            placeholder="Your full name"
          />
        </FieldRow>
        <FieldRow label="Email Address" hint="Used for login & notifications">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </FieldRow>
        <FieldRow label="Phone Number">
          <Input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 99999 99999"
          />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Account Info" description="Read-only information about your account.">
        <FieldRow label="Role">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#1a3a6b]/10 text-[#1a3a6b] text-sm font-medium capitalize">
            {portalUser.role}
          </span>
        </FieldRow>
        <FieldRow label="Account Status">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
            portalUser.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {portalUser.isActive ? 'Active' : 'Inactive'}
          </span>
        </FieldRow>
        <FieldRow label="Member Since">
          <span className="text-sm text-gray-600">
            {new Date(portalUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </FieldRow>
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={saving} saved={saved} />
      </div>
    </form>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [sessionAlert, setSessionAlert] = useState(true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setForm({ current: '', newPwd: '', confirm: '' });
    setTimeout(() => setSaved(false), 2500);
  };

  const PwdInput = ({ show, onToggle, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { show: boolean; onToggle: () => void }) => (
    <div className="relative">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] transition"
      />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        <SectionCard title="Change Password" description="Use a strong password with at least 8 characters.">
          <FieldRow label="Current Password">
            <PwdInput show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)}
              value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} placeholder="Enter current password" />
          </FieldRow>
          <FieldRow label="New Password">
            <PwdInput show={showNew} onToggle={() => setShowNew(!showNew)}
              value={form.newPwd} onChange={(e) => setForm({ ...form, newPwd: e.target.value })} placeholder="Enter new password" />
          </FieldRow>
          <FieldRow label="Confirm New Password">
            <PwdInput show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}
              value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat new password" />
          </FieldRow>
        </SectionCard>
        <div className="flex justify-end">
          <SaveButton loading={saving} saved={saved} />
        </div>
      </form>

      <SectionCard title="Security Options" description="Extra layers of protection for your account.">
        <Toggle checked={twoFA} onChange={setTwoFA} label="Enable Two-Factor Authentication (2FA)" />
        <Toggle checked={sessionAlert} onChange={setSessionAlert} label="Send alert on new device sign-in" />
      </SectionCard>
    </div>
  );
}

function NotificationsTab({ role }: { role: UserRole }) {
  const [email, setEmail] = useState({ projects: true, leads: role === 'admin' || role === 'manager', reports: role === 'admin', invoices: true });
  const [push, setPush] = useState({ projects: true, tasks: true, messages: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionCard title="Email Notifications" description="Choose what emails you receive.">
        <Toggle checked={email.projects} onChange={(v) => setEmail({ ...email, projects: v })} label="Project status updates" />
        {(role === 'admin' || role === 'manager') && (
          <Toggle checked={email.leads} onChange={(v) => setEmail({ ...email, leads: v })} label="New leads assigned" />
        )}
        <Toggle checked={email.invoices} onChange={(v) => setEmail({ ...email, invoices: v })} label="Quotations & invoices" />
        {role === 'admin' && (
          <Toggle checked={email.reports} onChange={(v) => setEmail({ ...email, reports: v })} label="Weekly summary reports" />
        )}
      </SectionCard>

      <SectionCard title="In-App Notifications" description="Alerts shown inside the portal.">
        <Toggle checked={push.projects} onChange={(v) => setPush({ ...push, projects: v })} label="Project & task updates" />
        <Toggle checked={push.tasks} onChange={(v) => setPush({ ...push, tasks: v })} label="Assigned tasks reminders" />
        <Toggle checked={push.messages} onChange={(v) => setPush({ ...push, messages: v })} label="New messages & comments" />
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={saving} saved={saved} />
      </div>
    </form>
  );
}

function SystemTab() {
  const [form, setForm] = useState({ company: 'NewTech Management', timezone: 'Asia/Kolkata', currency: 'INR', dateFormat: 'DD/MM/YYYY', language: 'en' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionCard title="Company Settings" description="Global settings applied across all user accounts.">
        <FieldRow label="Company Name">
          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </FieldRow>
        <FieldRow label="Default Timezone">
          <Select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
            <option value="Asia/Kolkata">India (IST, UTC+5:30)</option>
            <option value="Asia/Kathmandu">Nepal (NPT, UTC+5:45)</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Dubai">Dubai (GST, UTC+4)</option>
          </Select>
        </FieldRow>
        <FieldRow label="Currency">
          <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            <option value="INR">Indian Rupee (₹ INR)</option>
            <option value="NPR">Nepalese Rupee (NPR)</option>
            <option value="USD">US Dollar ($ USD)</option>
            <option value="AED">UAE Dirham (AED)</option>
          </Select>
        </FieldRow>
        <FieldRow label="Date Format">
          <Select value={form.dateFormat} onChange={(e) => setForm({ ...form, dateFormat: e.target.value })}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </Select>
        </FieldRow>
        <FieldRow label="Language">
          <Select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ne">Nepali</option>
          </Select>
        </FieldRow>
      </SectionCard>

      <SectionCard title="Appearance" description="Customize the look of the portal.">
        <FieldRow label="Theme">
          <div className="flex gap-3">
            {['Light', 'Dark', 'System'].map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="theme" value={t} defaultChecked={t === 'Light'} className="accent-[#1a3a6b]" />
                <span className="text-sm text-gray-700">{t}</span>
              </label>
            ))}
          </div>
        </FieldRow>
        <FieldRow label="Sidebar Color">
          <div className="flex gap-3">
            {[{ name: 'Navy', color: '#1a3a6b' }, { name: 'Slate', color: '#334155' }, { name: 'Charcoal', color: '#1f2937' }].map((c) => (
              <label key={c.name} className="flex items-center gap-2 cursor-pointer">
                <span className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ background: c.color }} />
                <span className="text-sm text-gray-700">{c.name}</span>
              </label>
            ))}
          </div>
        </FieldRow>
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={saving} saved={saved} />
      </div>
    </form>
  );
}

function TeamTab({ role }: { role: UserRole }) {
  const [defaultView, setDefaultView] = useState('list');
  const [autoAssign, setAutoAssign] = useState(false);
  const [managerApproval, setManagerApproval] = useState(role === 'admin');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionCard title="Team & Project Preferences" description="How you manage teams and project assignments.">
        <FieldRow label="Default Project View">
          <Select value={defaultView} onChange={(e) => setDefaultView(e.target.value)}>
            <option value="list">List View</option>
            <option value="kanban">Kanban Board</option>
            <option value="timeline">Timeline</option>
          </Select>
        </FieldRow>
        <Toggle checked={autoAssign} onChange={setAutoAssign} label="Auto-assign workers to new projects" />
        {role === 'admin' && (
          <Toggle checked={managerApproval} onChange={setManagerApproval} label="Require manager approval before project start" />
        )}
      </SectionCard>

      {role === 'admin' && (
        <SectionCard title="User Roles & Permissions" description="Quick access to permission management.">
          <p className="text-sm text-gray-600">
            Manage detailed permissions in the{' '}
            <a href="/users" className="text-[#1a3a6b] font-medium hover:underline inline-flex items-center gap-1">
              User Management <ChevronRight className="w-3 h-3" />
            </a>{' '}
            section.
          </p>
        </SectionCard>
      )}

      <div className="flex justify-end">
        <SaveButton loading={saving} saved={saved} />
      </div>
    </form>
  );
}

function WorkTab() {
  const [availability, setAvailability] = useState('available');
  const [workHours, setWorkHours] = useState({ start: '08:00', end: '17:00' });
  const [showLocation, setShowLocation] = useState(true);
  const [breakReminder, setBreakReminder] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionCard title="Availability" description="Set your current work status.">
        <FieldRow label="Status">
          <Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="available">Available</option>
            <option value="busy">Busy / On-site</option>
            <option value="off">Off / Leave</option>
          </Select>
        </FieldRow>
      </SectionCard>

      <SectionCard title="Work Hours" description="Your typical working hours.">
        <FieldRow label="Start Time">
          <Input type="time" value={workHours.start} onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })} />
        </FieldRow>
        <FieldRow label="End Time">
          <Input type="time" value={workHours.end} onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })} />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Preferences">
        <Toggle checked={showLocation} onChange={setShowLocation} label="Share my location with manager during jobs" />
        <Toggle checked={breakReminder} onChange={setBreakReminder} label="Remind me to log break times" />
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={saving} saved={saved} />
      </div>
    </form>
  );
}

function PrivacyTab() {
  const [shareContact, setShareContact] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [dataRetention, setDataRetention] = useState('1year');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionCard title="Data & Privacy" description="Control how your data is used.">
        <Toggle checked={shareContact} onChange={setShareContact} label="Share contact details with assigned team members" />
        <Toggle checked={marketingEmails} onChange={setMarketingEmails} label="Receive product updates and offers via email" />
        <FieldRow label="Data Retention" hint="How long we keep your records">
          <Select value={dataRetention} onChange={(e) => setDataRetention(e.target.value)}>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
            <option value="3years">3 Years</option>
            <option value="forever">Indefinitely</option>
          </Select>
        </FieldRow>
      </SectionCard>

      <SectionCard title="Account Actions" description="Permanent actions related to your account.">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full sm:w-auto text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Download My Data
          </button>
          <button
            type="button"
            className="w-full sm:w-auto text-left px-4 py-2.5 rounded-lg border border-red-200 text-sm text-red-600 hover:bg-red-50 transition"
          >
            Request Account Deletion
          </button>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={saving} saved={saved} />
      </div>
    </form>
  );
}

// ─── main export ─────────────────────────────────────────────────────────────

export function SettingsPage() {
  const { portalUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!portalUser) return null;

  const visibleTabs = TABS.filter((t) => t.roles.includes(portalUser.role));

  const renderPanel = () => {
    switch (activeTab) {
      case 'profile':       return <ProfileTab portalUser={portalUser} />;
      case 'security':      return <SecurityTab />;
      case 'notifications': return <NotificationsTab role={portalUser.role} />;
      case 'system':        return <SystemTab />;
      case 'team':          return <TeamTab role={portalUser.role} />;
      case 'work':          return <WorkTab />;
      case 'privacy':       return <PrivacyTab />;
      default:              return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account, preferences, and{' '}
          {portalUser.role === 'admin' ? 'system configuration' :
           portalUser.role === 'manager' ? 'team settings' :
           portalUser.role === 'worker' ? 'work preferences' : 'privacy options'}.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="lg:w-52 shrink-0">
          <ul className="space-y-1">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                      active
                        ? 'bg-[#1a3a6b] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Panel */}
        <div className="flex-1 min-w-0">{renderPanel()}</div>
      </div>
    </div>
  );
}
