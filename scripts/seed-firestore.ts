import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { makers, sharedSpaces } from "../src/data/makers";

function getCredential() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccount) return applicationDefault();
  return cert(JSON.parse(serviceAccount));
}

const projectId =
  process.env.FIREBASE_PROJECT_ID ??
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Set FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID before seeding.",
  );
}

if (!getApps().length) {
  initializeApp({
    credential: getCredential(),
    projectId,
  });
}

const db = getFirestore();
const batch = db.batch();

for (const maker of makers) {
  batch.set(
    db.collection("makers").doc(maker.id),
    {
      ...maker,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

batch.set(
  db.collection("siteContent").doc("venue"),
  {
    name: "Borrowdale Race Course",
    city: "Harare",
    country: "Zimbabwe",
    openingDate: "2026-07-01",
    sharedSpaces,
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true },
);

if (process.env.ADMIN_UID) {
  batch.set(
    db.collection("admins").doc(process.env.ADMIN_UID),
    {
      role: "administrator",
      active: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

await batch.commit();

console.log(
  `Seeded ${makers.length} makers, venue content and ${
    process.env.ADMIN_UID ? "one admin record" : "no admin record"
  } into ${projectId}.`,
);
