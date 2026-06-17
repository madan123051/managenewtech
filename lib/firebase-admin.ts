import * as admin from 'firebase-admin';

// Prevent multiple initializations in Next.js hot-reload
if (!admin.apps.length) {
  const serviceAccountStr = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

  if (serviceAccountStr) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountStr) as admin.ServiceAccount),
      databaseURL: 'https://newtechhomesolutions-b6ab6-default-rtdb.firebaseio.com',
    });
  } else {
    // Fallback: use Application Default Credentials (for Google Cloud environments)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://newtechhomesolutions-b6ab6-default-rtdb.firebaseio.com',
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
