'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCheck, Briefcase, FileText, Hammer, LogOut, UserCog, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = (role: string) => {
  const all = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin','manager','worker','customer'] },
    { href: '/customers', label: 'Customers', icon: Users, roles: ['admin','manager'] },
    { href: '/leads', label: 'Leads', icon: UserCheck, roles: ['admin','manager'] },
    { href: '/quotations', label: 'Quotations', icon: FileText, roles: ['admin','manager','customer'] },
    { href: '/projects', label: 'Projects', icon: Briefcase, roles: ['admin','manager','worker','customer'] },
    { href: '/workers', label: 'Workers', icon: Hammer, roles: ['admin','manager'] },
    { href: '/managers', label: 'Managers', icon: Building2, roles: ['admin'] },
    { href: '/users', label: 'User Mgmt', icon: UserCog, roles: ['admin'] },
  ];
  return all.filter(i => i.roles.includes(role));
};

export function Sidebar() {
  const pathname = usePathname();
  const { portalUser, signOut } = useAuth();
  if (!portalUser) return null;

  const items = navItems(portalUser.role);

  return (
    <aside className="w-64 min-h-screen bg-[#1a3a6b] flex flex-col text-white">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-sm">NT</div>
          <div><p className="font-bold text-sm">NewTech</p><p className="text-xs text-blue-200">Management</p></div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-red-500/20">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
