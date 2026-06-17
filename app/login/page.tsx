'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ROLE_PATHS: Record<string, string> = {
  admin: '/dashboard',
  manager: '/manager-dashboard',
  worker: '/worker-dashboard',
};

export default function LoginPage() {
  const { signIn, portalUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (portalUser) {
      router.push(ROLE_PATHS[portalUser.role] ?? '/dashboard');
    }
  }, [portalUser, router]);

  if (portalUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const pu = await signIn(email, password);
      if (!pu) {
        setError('Account not found. Contact your admin.');
        return;
      }
      if (!pu.isActive) {
        setError('Your account has been deactivated. Contact admin.');
        return;
      }
      router.push(ROLE_PATHS[pu.role] ?? '/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-email'
      ) {
        setError('Invalid email or password.');
      } else {
        setError((err as Error)?.message || 'Login failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a3a6b] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            NT
          </div>
        </div>
        <h1 className="text-white text-2xl font-bold">NewTech Home Solutions</h1>
        <p className="text-blue-200 text-sm mt-1">Staff Portal — Sign in to continue</p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a3a6b] hover:bg-[#15305a] text-white font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Don&apos;t have an account? Contact your admin to create one.
        </p>
      </div>

      <p className="text-blue-300 text-xs mt-8">© 2024 New Tech Home Solutions</p>
    </div>
  );
}
