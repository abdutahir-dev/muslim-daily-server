import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebaseConfig.js';

let adminApp = null;
let _adminAuth = null;
let _adminDb = null;

export function getAdminApp() {
  if (!adminApp) {
    if (getApps().length === 0) {
      adminApp = initializeApp({
        projectId: firebaseConfig.projectId,
      });
    } else {
      adminApp = getApps()[0];
    }
  }
  return adminApp;
}

export function getAdminAuth() {
  if (!_adminAuth) {
    _adminAuth = getAuth(getAdminApp());
  }
  return _adminAuth;
}

export function getAdminDb() {
  if (!_adminDb) {
    _adminDb = getFirestore(getAdminApp(), firebaseConfig.firestoreDatabaseId);
  }
  return _adminDb;
}

export const adminAuth = {
  verifyIdToken: (...args) => getAdminAuth().verifyIdToken(...args),
  getUser: (...args) => getAdminAuth().getUser(...args)
};

export const adminDb = {
  collection: (...args) => getAdminDb().collection(...args),
  doc: (...args) => getAdminDb().doc(...args)
};

export default { getAdminApp, getAdminAuth, getAdminDb, adminAuth, adminDb };
