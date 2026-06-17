# Firebase Admin Setup

## Project Details
- **Project ID:** `newtechhomesolutions-b6ab6`
- **Database URL:** `https://newtechhomesolutions-b6ab6-default-rtdb.firebaseio.com`

## Steps to complete setup

### 1. Install firebase-admin
```bash
npm install firebase-admin
```

### 2. Get Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **newtechhomesolutions-b6ab6**
3. Project Settings (⚙️) → **Service Accounts** tab
4. Click **"Generate new private key"** → Download JSON file

### 3. Add to `.env.local`
Open the downloaded JSON file and paste the entire content as one line:
```env
FIREBASE_ADMIN_SERVICE_ACCOUNT={"type":"service_account","project_id":"newtechhomesolutions-b6ab6","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"..."}
```

> ⚠️ Never commit the service account JSON or `.env.local` to GitHub!
