# NewTech Management Portal - Deployment Guide

## Quick Start (Development)

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
npm run dev
```

Visit `http://localhost:3000/login`

## Production Deployment

### 1. **Prepare Environment**
- Get Firebase config from your `shop-aaf2f` project
- Fill in `.env.local` (never commit this)

### 2. **Deploy to Vercel** (Recommended)

```bash
# Push to GitHub
git add .
git commit -m "Production build"
git push origin main

# Visit https://vercel.com/new
# Select your repository
# Set environment variables in Vercel dashboard:
#   - NEXT_PUBLIC_FIREBASE_API_KEY
#   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
#   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
#   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
#   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
#   - NEXT_PUBLIC_FIREBASE_APP_ID
```

### 3. **Custom Domain**
In Vercel dashboard:
- Go to Settings → Domains
- Add `manage.newtech.com` (or your domain)
- Update DNS records as shown

### 4. **Firestore Security Rules**

Set these rules in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only admins can manage users
    match /portalUsers/{uid} {
      allow read: if request.auth.uid == uid || get(/databases/$(database)/documents/portalUsers/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth.uid == uid || get(/databases/$(database)/documents/portalUsers/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Managers can manage customers and leads
    match /customers/{customerId} {
      allow read, write: if request.auth.uid != null && (get(/databases/$(database)/documents/portalUsers/$(request.auth.uid)).data.role in ['admin','manager']);
    }
    
    // Everyone authenticated can read projects assigned to them
    match /projects/{projectId} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null && (get(/databases/$(database)/documents/portalUsers/$(request.auth.uid)).data.role in ['admin','manager']);
    }
    
    // Managers can create quotations
    match /quotations/{quotationId} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null && (get(/databases/$(database)/documents/portalUsers/$(request.auth.uid)).data.role in ['admin','manager']);
    }
    
    match /leads/{leadId} {
      allow read, write: if request.auth.uid != null && (get(/databases/$(database)/documents/portalUsers/$(request.auth.uid)).data.role in ['admin','manager']);
    }
  }
}
```

### 5. **Firebase Authentication**

Users are authenticated via Firebase Auth (shared with public website).

To create portal users, you need to:
1. Create Firebase Auth user (email/password via Firebase Console or programmatically)
2. Create corresponding `portalUsers` record in Firestore with their role

OR use an admin API route (requires Firebase Admin SDK):

```javascript
// pages/api/create-user.js (example - not in this repo)
import admin from 'firebase-admin';

export default async function handler(req, res) {
  const { email, password, displayName, role } = req.body;
  
  // Create auth user
  const user = await admin.auth().createUser({ email, password, displayName });
  
  // Create portal user
  await admin.firestore().collection('portalUsers').doc(user.uid).set({
    email, displayName, role,
    phone: '',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return res.status(200).json({ uid: user.uid });
}
```

## Architecture

- **Frontend:** Next.js 14, Vercel
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Database:** Firestore (shared with public website)
- **Branding:** Navy `#1a3a6b` + Orange `#f97316`

## Features Available

- ✅ Admin dashboard with full metrics
- ✅ Customer management
- ✅ Lead management & tracking
- ✅ Quotation creation & approval
- ✅ Project lifecycle management
- ✅ Worker & manager assignment
- ✅ Role-based access control
- ✅ Responsive design

## Troubleshooting

**"Firebase Config not found"**
- Ensure `.env.local` is filled correctly
- Check that Firebase project is initialized

**"Authentication failed"**
- Ensure Firebase Auth user exists
- Check Firestore `portalUsers` record has correct data

**"Permission denied" errors**
- Check Firestore security rules
- Verify user has proper role in `portalUsers`

## Future Enhancements

- SMS/WhatsApp notifications
- Email templates
- PDF reports
- Mobile apps
- Payment integration
- Analytics dashboard

---

For questions, contact: walter@newtech.com
