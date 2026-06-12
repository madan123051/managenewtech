'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getPortalUser } from '@/lib/firestore';
import type { PortalUser } from '@/types';

interface AuthContextType {
  user: User | null;
  portalUser: PortalUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<PortalUser | null>;
  demoLogin: (role: 'admin' | 'manager' | 'worker' | 'customer') => void;
  signOut: () => Promise<void>;
}

const DEMO_USERS: Record<string, PortalUser> = {
  admin:    { uid: 'demo-admin',    name: 'Demo Admin',    email: 'admin@demo.com',    role: 'admin',    isActive: true } as PortalUser,
  manager:  { uid: 'demo-manager',  name: 'Demo Manager',  email: 'manager@demo.com',  role: 'manager',  isActive: true } as PortalUser,
  worker:   { uid: 'demo-worker',   name: 'Demo Worker',   email: 'worker@demo.com',   role: 'worker',   isActive: true } as PortalUser,
  customer: { uid: 'demo-customer', name: 'Demo Customer', email: 'customer@demo.com', role: 'customer', isActive: true } as PortalUser,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [portalUser, setPortalUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const pu = await getPortalUser(u.uid);
        setPortalUser(pu);
      } else {
        // Don't clear portalUser if it's a demo user
        setPortalUser(prev => (prev?.uid?.startsWith('demo-') ? prev : null));
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string): Promise<PortalUser | null> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const pu = await getPortalUser(cred.user.uid);
    setPortalUser(pu);
    return pu;
  };

  const demoLogin = (role: 'admin' | 'manager' | 'worker' | 'customer') => {
    setPortalUser(DEMO_USERS[role]);
  };

  const signOut = async () => {
    setPortalUser(null);
    if (user) await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, portalUser, loading, signIn, demoLogin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
