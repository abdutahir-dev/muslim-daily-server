import { initializeApp, getApps, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebaseConfig.js';

let adminApp: App;

if (getApps().length === 0) {
  adminApp = initializeApp({
    projectId: firebaseConfig.projectId,
  });
} else {
  adminApp = getApps()[0];
}

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId);

export { adminApp };
export default { adminApp, adminAuth, adminDb };
