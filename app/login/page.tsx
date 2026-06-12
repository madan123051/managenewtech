'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react';

function getDashboardByRole(role: string) {
  if (role === 'manager') return '/manager-dashboard';
  if (role === 'worker') return '/worker-dashboard';
  if (role === 'customer') return '/customer-dashboard';
  return '/dashboard';
}

const DEMO_ROLES = [
  { role: 'admin' as const,    label: 'Admin',    color: 'bg-purple-600 hover:bg-purple-700',  emoji: '👑' },
  { role: 'manager' as const,  label: 'Manager',  color: 'bg-blue-600 hover:bg-blue-700',    emoji: '🏢' },
  { role: 'worker' as const,   label: 'Worker',   color: 'bg-green-600 hover:bg-green-700',  emoji: '🔨' },
  { role: 'customer' as const, label: 'Customer', color: 'bg-orange-500 hover:bg-orange-600', emoji: '🏠' },
];

export default function LoginPage() {
  const { signIn, demoLogin, portalUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  if (portalUser) { router.push(getDashboardByRole(portalUser.role)); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pu = await signIn(email, password);
      router.push(getDashboardByRole(pu?.role ?? 'admin'));
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role: 'admin' | 'manager' | 'worker' | 'customer') => {
    demoLogin(role);
    router.push(getDashboardByRole(role));
  };

  return (
    <div className="min-h-screen bg-[#1a3a6b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-xl">NT</div>
            <div className="text-left">
              <h1 className="text-white text-xl font-bold">NewTech Home Solutions</h1>
              <p className="text-blue-200 text-sm">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Demo Login Buttons */}
        <div className="bg-white/10 rounded-2xl p-5 mb-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-white text-sm font-semibold">Quick Demo — No password needed</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ROLES.map(({ role, label, color, emoji }) => (
              <button
                key={role}
                onClick={() => handleDemo(role)}
                className={`${color} text-white text-sm font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2`}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-gray-500 text-sm">Access your management dashboard</p>
          </div>

          <div>
            <label className="label">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="input pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-blue-200 text-xs mt-6">© 2024 New Tech Home Solutions. All rights reserved.</p>
      </div>
    </div>
  );
}
