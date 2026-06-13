'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const ROLES = [
  {
    role: 'admin' as const,
    label: 'Admin',
    description: 'Full access — manage everything',
    emoji: '👑',
    gradient: 'from-purple-600 to-purple-800',
    border: 'border-purple-400',
    path: '/dashboard',
  },
  {
    role: 'manager' as const,
    label: 'Manager',
    description: 'Team & project management',
    emoji: '🏢',
    gradient: 'from-blue-600 to-blue-800',
    border: 'border-blue-400',
    path: '/manager-dashboard',
  },
  {
    role: 'worker' as const,
    label: 'Worker',
    description: 'View tasks & job updates',
    emoji: '🔨',
    gradient: 'from-green-600 to-green-800',
    border: 'border-green-400',
    path: '/worker-dashboard',
  },
  {
    role: 'customer' as const,
    label: 'Customer',
    description: 'Track your home projects',
    emoji: '🏠',
    gradient: 'from-orange-500 to-orange-700',
    border: 'border-orange-400',
    path: '/customer-dashboard',
  },
];

export default function LoginPage() {
  const { demoLogin, portalUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (portalUser) {
      const found = ROLES.find(r => r.role === portalUser.role);
      router.push(found?.path ?? '/dashboard');
    }
  }, [portalUser, router]);

  if (portalUser) return null;

  const handleSelect = (role: 'admin' | 'manager' | 'worker' | 'customer', path: string) => {
    demoLogin(role);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#1a3a6b] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">NT</div>
        </div>
        <h1 className="text-white text-2xl font-bold">NewTech Home Solutions</h1>
        <p className="text-blue-200 text-sm mt-1">Select your role to continue</p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {ROLES.map(({ role, label, description, emoji, gradient, border, path }) => (
          <button
            key={role}
            onClick={() => handleSelect(role, path)}
            className={`bg-gradient-to-br ${gradient} border-2 ${border} border-opacity-50 rounded-2xl p-6 text-left hover:scale-105 active:scale-95 transition-transform shadow-xl`}
          >
            <div className="text-4xl mb-3">{emoji}</div>
            <h2 className="text-white text-xl font-bold">{label}</h2>
            <p className="text-white/70 text-sm mt-1">{description}</p>
          </button>
        ))}
      </div>

      <p className="text-blue-300 text-xs mt-10">© 2024 New Tech Home Solutions</p>
    </div>
  );
}
