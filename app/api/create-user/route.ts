import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const ALLOWED_ROLES = ['admin', 'manager', 'worker', 'customer'] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

export async function POST(req: NextRequest) {
  try {
    // 1. Verify caller has a valid Firebase token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // 2. Confirm caller is an admin
    const callerSnap = await adminDb.collection('portalUsers').doc(decoded.uid).get();
    if (!callerSnap.exists || callerSnap.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: only admins can create users' }, { status: 403 });
    }

    // 3. Parse and validate the request body
    const { email, password, displayName, phone, role } = (await req.json()) as {
      email: string;
      password: string;
      displayName: string;
      phone?: string;
      role: AllowedRole;
    };

    if (!email || !password || !displayName || !role) {
      return NextResponse.json({ error: 'email, password, displayName and role are required' }, { status: 400 });
    }

    if (!(ALLOWED_ROLES as readonly string[]).includes(role)) {
      return NextResponse.json({ error: `Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}` }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // 4. Create the user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });

    // 5. Save the user profile to Firestore
    await adminDb.collection('portalUsers').doc(userRecord.uid).set({
      email,
      displayName,
      phone: phone?.trim() || '',
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ uid: userRecord.uid, success: true });
  } catch (err: unknown) {
    console.error('[create-user]', err);
    const error = err as { code?: string; message?: string };
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'This email is already in use' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
