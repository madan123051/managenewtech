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
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

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
        setPortalUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, portalUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
