import { Router } from 'express';
import { adminAuth, adminDb } from '../lib/firebaseAdmin.js';
import { firebaseConfig } from '../lib/firebaseConfig.js';
import { requireFirebaseAuth } from '../middleware/firebaseAuth.js';
import { handleFirestoreError, OperationType } from '../utils/firestoreError.js';

const router = Router();

/**
 * Public endpoint to retrieve non-sensitive Firebase client configuration
 */
router.get('/config', (req, res) => {
  res.json({
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId,
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    oAuthClientId: firebaseConfig.oAuthClientId
  });
});

/**
 * Firebase health check and Firestore connection test
 */
router.get('/health', async (req, res) => {
  try {
    // Attempt reading or writing metadata collection
    const testDocRef = adminDb.collection('_health').doc('ping');
    await testDocRef.set({
      timestamp: new Date().toISOString(),
      status: 'healthy'
    });
    const snapshot = await testDocRef.get();
    res.json({
      status: 'ok',
      service: 'firebase-firestore',
      databaseId: firebaseConfig.firestoreDatabaseId,
      projectId: firebaseConfig.projectId,
      healthy: snapshot.exists
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed connecting to Firestore database',
      error: err.message
    });
  }
});

/**
 * Sync user profile to Firestore (requires Firebase ID Token)
 */
router.post('/sync-user', requireFirebaseAuth, async (req, res) => {
  const user = req.user;
  const path = `users/${user.uid}`;
  try {
    const userRef = adminDb.collection('users').doc(user.uid);
    const docSnap = await userRef.get();
    const now = new Date().toISOString();

    const userData = {
      uid: user.uid,
      email: user.email || '',
      displayName: req.body.displayName || user.name || '',
      role: 'user',
      updatedAt: now
    };

    if (!docSnap.exists) {
      userData.createdAt = now;
      await userRef.set(userData);
    } else {
      await userRef.set(userData, { merge: true });
    }

    res.json({
      success: true,
      message: 'User profile synced to Firestore',
      user: userData
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, {
      userId: user.uid,
      email: user.email
    });
  }
});

/**
 * Save prayer tracking log to Firestore
 */
router.post('/prayer-logs', requireFirebaseAuth, async (req, res) => {
  const user = req.user;
  const { date, prayerName, status, prayedAs } = req.body;

  if (!date || !prayerName || status === undefined) {
    return res.status(400).json({ error: 'date, prayerName, and status are required' });
  }

  const logId = `${date}_${prayerName}`;
  const path = `users/${user.uid}/prayerLogs/${logId}`;

  try {
    const logRef = adminDb.collection('users').doc(user.uid).collection('prayerLogs').doc(logId);
    const logData = {
      userId: user.uid,
      date,
      prayerName,
      status: Boolean(status),
      prayedAs: prayedAs || 'fard',
      updatedAt: new Date().toISOString()
    };
    await logRef.set(logData);

    res.json({
      success: true,
      log: logData
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, {
      userId: user.uid,
      email: user.email
    });
  }
});

/**
 * Retrieve prayer logs for authenticated user
 */
router.get('/prayer-logs', requireFirebaseAuth, async (req, res) => {
  const user = req.user;
  const path = `users/${user.uid}/prayerLogs`;

  try {
    const snapshot = await adminDb
      .collection('users')
      .doc(user.uid)
      .collection('prayerLogs')
      .orderBy('date', 'desc')
      .limit(30)
      .get();

    const logs = [];
    snapshot.forEach(doc => logs.push(doc.data()));

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, {
      userId: user.uid,
      email: user.email
    });
  }
});

export default router;
