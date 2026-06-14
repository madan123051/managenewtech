import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyATvwM_0B9ibtD9MniIoiNuiirnC0mb2AY",
  authDomain: "newtechhomesolutions-b6ab6.firebaseapp.com",
  databaseURL: "https://newtechhomesolutions-b6ab6-default-rtdb.firebaseio.com",
  projectId: "newtechhomesolutions-b6ab6",
  storageBucket: "newtechhomesolutions-b6ab6.firebasestorage.app",
  messagingSenderId: "1015056454392",
  appId: "1:1015056454392:web:09b8e2911248681807e10d",
  measurementId: "G-KYS4GK29L5",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);

// Analytics is browser-only — guard against SSR
export const getFirebaseAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const { getAnalytics } = await import('firebase/analytics');
    return getAnalytics(app);
  }
  return null;
};

export default app;
