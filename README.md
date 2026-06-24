# Ipi Tombe Circle

A responsive discovery platform and operational CMS/CRM foundation for a
collective of Zimbabwean artists, artisans, creators and crafters at Borrowdale
Race Course in Harare.

## What is included

- Editorial public website using 97 supplied maker photographs
- Searchable, filterable directory for all 18 occupied stalls
- Maker profile modals with contact details
- Opening and visit conversion flow
- Firebase Authentication sign-in
- Firestore-backed makers, enquiries, updates and site content
- Admin dashboard with maker editing and update publishing
- Firestore and Storage security rules
- Seed command for the initial 18-maker database
- Vercel TypeScript project configuration

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Firebase environment values the site remains fully usable in local demo
mode. Public enquiries and admin updates are kept in browser storage.

## Firebase setup

1. Create a Firebase project and Web App.
2. Enable Authentication providers: Google and Email/Password.
3. Create Firestore and Storage.
4. Copy Web App values into `.env.local`.
5. Deploy rules with `firebase deploy --only firestore:rules,storage`.
6. Set `FIREBASE_PROJECT_ID`, a service-account credential, and `ADMIN_UID`.
7. Run `npm run seed:firestore`.

The `admins/{uid}` document is the authorization boundary for CMS/CRM writes.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

The project is configured for Vercel. Add the `NEXT_PUBLIC_FIREBASE_*`
environment values to Preview and Production before enabling the live admin
workflow.
