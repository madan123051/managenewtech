'use client';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function SetupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [done, setDone] = useState(false);
  const [alreadySetup, setAlreadySetup] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAdmin() {
      try {
        const q = query(collection(db, 'portalUsers'), where('role', '==', 'admin'));
        const snap = await getDocs(q);
        if (!snap.empty) setAlreadySetup(true);
      } catch (e) {
        // Firestore might be empty, that's fine
      } finally {
        setChecking(false);
      }
    }
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'portalUsers', cred.user.uid), {
        displayName,
        email,
        role: 'admin',
        isActive: true,
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Yeh email pehle se registered hai. Firebase Console se us user ka UID copy karke manually Firestore mein add karo.');
      } else {
        setError(err.message || 'Kuch galat hua. Dobara try karo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#1a2744] flex items-center justify-center">
        <p className="text-white text-lg">Checking setup status...</p>
      </div>
    );
  }

  if (alreadySetup) {
    return (
      <div className="min-h-screen bg-[#1a2744] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Setup Already Done!</h1>
          <p className="text-gray-500 mb-6">Admin account pehle se exist karta hai.</p>
          <a href="/login" className="block w-full bg-[#1a2744] text-white py-3 rounded-xl font-semibold hover:bg-[#243460] transition">
            Login Page Par Jao
          </a>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#1a2744] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Ban Gaya!</h1>
          <p className="text-gray-500 mb-1">Email: <span className="font-semibold text-gray-700">{email}</span></p>
          <p className="text-gray-500 mb-6">Ab login kar sakte ho!</p>
          <a href="/login" className="block w-full bg-[#1a2744] text-white py-3 rounded-xl font-semibold hover:bg-[#243460] transition">
            Login Karo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2744] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            NT
          </div>
          <h1 className="text-2xl font-bold text-gray-800">First Time Setup</h1>
          <p className="text-gray-500 text-sm mt-1">Pehla Admin Account Banao</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              placeholder="Jaise: Madan"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Kam se kam 6 characters"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a2744] text-white py-3 rounded-xl font-semibold hover:bg-[#243460] transition disabled:opacity-60"
          >
            {loading ? 'Bana raha hai...' : 'Admin Account Banao'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          ⚠️ Yeh page sirf ek baar use karo — pehla admin banane ke baad yeh automatically lock ho jata hai.
        </p>
      </div>
    </div>
  );
}
