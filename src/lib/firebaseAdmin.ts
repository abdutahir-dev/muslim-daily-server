import { getApps, initializeApp } from "firebase-admin/app";
import { type Auth, getAuth } from "firebase-admin/auth";
import { type Firestore, getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebaseConfig.js";

const adminApp =
	getApps().length === 0
		? initializeApp({
				projectId: firebaseConfig.projectId,
			})
		: getApps()[0];

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(
	adminApp,
	firebaseConfig.firestoreDatabaseId,
);

export { adminApp };
export default { adminApp, adminAuth, adminDb };
