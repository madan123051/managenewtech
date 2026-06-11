# NewTech Home Solutions - Management Portal

**Production-ready ERP/CRM system for blinds, pleated mesh, honeycomb systems, and partitions installations.**

## 📋 Overview

A **completely separate** management portal from the public website. Shares the same Firebase project but has its own domain and frontend.

- **Public Website** (unchanged): `shop.newtech.com` – Product catalog, lead generation, quotes
- **Management Portal** (new): `manage.newtech.com` – Admin, manager, worker, customer dashboards

## 🏗 Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Hook Form
- **Backend:** Firebase Auth, Firestore, Cloud Storage
- **Hosting:** Vercel (or any Node.js host)

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/madan123051/managenewtech
cd managenewtech

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in your Firebase config (from your existing Shop project)

# Run dev server
npm run dev
```

Visit `http://localhost:3000`

## ⚙️ Environment Setup

Copy these values **from your existing Shop website** Firebase project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

## 📚 Features

### 1. **Authentication & Authorization**
- Firebase Auth (email/password)
- Role-based access control (Admin, Manager, Worker, Customer)
- Protected routes

### 2. **Dashboards**
- **Admin:** All metrics, user management, full visibility
- **Manager:** Assigned projects, worker assignments, schedules
- **Worker:** Today's jobs, progress photos, site updates
- **Customer:** Project status, installation photos, warranty info

### 3. **Customer Management**
- Create, edit, view customers
- Track associated projects and quotations
- Contact details and notes

### 4. **Lead Management**
- Create and track leads
- Convert to quotations
- Assign to managers
- Track lead status (new → contacted → qualified → converted/lost)

### 5. **Quotations**
- Line items with product selection
- Pricing, discounts, taxes
- Status tracking (draft → sent → approved → rejected)
- Print quotations as PDF

### 6. **Project Management**
- Full project lifecycle
- Status flow: Lead → Quotation → Approved → Site Measurement → Production → Installation → Completed → Warranty
- Assign managers and workers
- Photo uploads (before/after/site/progress)
- Notes and updates
- View by role (managers see assigned, workers see assigned, customers see own)

### 7. **Worker Assignment**
- Assign workers to projects
- Track worker availability and projects
- Job lists and completion status

### 8. **User Management** (Admin)
- Create users (requires server-side Firebase Admin)
- Assign roles
- Activate/deactivate users
- Change user roles

## 🗄 Firestore Collections

```
portalUsers/
├── {uid}
│   ├── email
│   ├── displayName
│   ├── role (admin|manager|worker|customer)
│   ├── phone
│   ├── isActive
│   └── createdAt

customers/
├── {customerId}
│   ├── name
│   ├── email
│   ├── phone
│   ├── address
│   ├── city
│   ├── notes
│   └── createdAt

leads/
├── {leadId}
│   ├── customerId
│   ├── customerName
│   ├── customerPhone
│   ├── customerEmail
│   ├── productInterest[] (ProductCategory)
│   ├── source
│   ├── status (new|contacted|qualified|converted|lost)
│   ├── assignedTo (managerId)
│   ├── notes
│   ├── createdAt
│   └── updatedAt

quotations/
├── {quotationId}
│   ├── quotationNumber
│   ├── customerId
│   ├── customerName
│   ├── leadId
│   ├── items[] (QuotationItem)
│   ├── subtotal
│   ├── discount
│   ├── tax
│   ├── total
│   ├── status (draft|sent|approved|rejected|expired)
│   ├── validUntil
│   ├── notes
│   ├── createdBy
│   └── createdAt

projects/
├── {projectId}
│   ├── projectNumber
│   ├── customerId
│   ├── customerName
│   ├── quotationId
│   ├── title
│   ├── description
│   ├── category[] (ProductCategory)
│   ├── status (ProjectStatus)
│   ├── assignedManager
│   ├── assignedManagerName
│   ├── assignedWorkers[]
│   ├── assignedWorkerNames[]
│   ├── siteAddress
│   ├── scheduledDate
│   ├── completedDate
│   ├── warrantyExpiry
│   ├── photos[] (ProjectPhoto)
│   ├── notes[] (ProjectNote)
│   ├── totalAmount
│   ├── createdAt
│   └── updatedAt
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# Vercel automatically deploys on push

# Set environment variables in Vercel dashboard
```

### Docker / Self-hosted
```bash
npm run build
npm start
```

## 🔑 Roles & Permissions

| Feature | Admin | Manager | Worker | Customer |
|---------|-------|---------|--------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Customers | ✅ | ✅ | ❌ | ❌ |
| Leads | ✅ | ✅ | ❌ | ❌ |
| Quotations | ✅ | ✅ | ❌ | ✅ |
| Projects | ✅ | ✅ | ✅ | ✅ |
| Workers | ✅ | ✅ | ❌ | ❌ |
| Managers | ✅ | ❌ | ❌ | ❌ |
| User Mgmt | ✅ | ❌ | ❌ | ❌ |

## 📸 Product Categories

- Roller Blinds
- Zebra Blinds
- Wooden Blinds
- Printed Blinds
- Polyester Pleated Mesh
- SS304 Pleated Mesh
- Honeycomb Blackout
- 2 in 1 Pleated Mesh + Honeycomb
- PVC Partition
- Crystal Partition Door
- Security Mesh

## 🎨 Branding

- **Primary Color:** Navy `#1a3a6b`
- **Accent Color:** Orange `#f97316`
- **Font:** System default (SF Pro, Helvetica, Arial)

## 🔄 Integration with Public Website

Both apps share:
- **Same Firebase Project** (shop-aaf2f)
- **Same Firestore Database**
- **Same Authentication** (but separate user tables)
- **Same Cloud Storage**

No API layer needed — direct Firestore access with proper security rules.

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Portal users can read/write their own profile
    match /portalUsers/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if request.auth.uid == uid && get(/databases/$(database)/documents/portalUsers/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Managers can read customers, leads, quotations
    match /customers/{customerId} {
      allow read, write: if request.auth.uid != null;
    }
    
    // Projects visible to assigned manager/worker or customer
    match /projects/{projectId} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

## 📝 TODO / Future Features

- [ ] SMS/WhatsApp notifications to customers
- [ ] Email templates for quotations and project updates
- [ ] Export reports to PDF
- [ ] Worker mobile app
- [ ] Customer mobile app
- [ ] Warranty management & reminders
- [ ] Payment tracking
- [ ] Cost tracking & profitability
- [ ] Analytics dashboard
- [ ] Integration with accounting software

## 🤝 Contributing

Push changes and create PRs to `develop` branch.

## 📞 Support

Contact: walter@newtech.com

---

**Built with ❤️ for NewTech Home Solutions**
