import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT as string
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://newtechhomesolutions-b6ab6-default-rtdb.firebaseio.com',
  });
}

export default admin;
