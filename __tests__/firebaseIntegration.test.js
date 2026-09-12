import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Mock firebase-admin modules to prevent Jest CJS-ESM interop issues with jose
jest.unstable_mockModule('firebase-admin/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => [{}]),
}));

jest.unstable_mockModule('firebase-admin/auth', () => ({
  getAuth: jest.fn(() => ({
    verifyIdToken: jest.fn(async (token) => {
      if (token === 'valid-token') return { uid: 'user_123', email: 'test@example.com' };
      throw new Error('Invalid token');
    }),
  })),
}));

jest.unstable_mockModule('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(async () => ({ exists: true })),
        set: jest.fn(async () => ({})),
      })),
    })),
  })),
}));

// Dynamic import after mocking
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');
const { firebaseConfig } = await import('../src/lib/firebaseConfig.js');
const { handleFirestoreError, OperationType } = await import('../src/utils/firestoreError.js');

describe('Firebase Integration', () => {
  test('firebaseConfig contains valid projectId and firestoreDatabaseId', () => {
    expect(firebaseConfig).toBeDefined();
    expect(firebaseConfig.projectId).toBe('gen-lang-client-0725368052');
    expect(firebaseConfig.firestoreDatabaseId).toContain('ai-studio-muslimdailyserve');
  });

  test('firebase-blueprint.json exists and defines required entities', () => {
    const blueprintPath = path.join(process.cwd(), 'firebase-blueprint.json');
    expect(fs.existsSync(blueprintPath)).toBe(true);
    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
    expect(blueprint.entities).toBeDefined();
    expect(blueprint.entities.user).toBeDefined();
    expect(blueprint.entities.prayerLog).toBeDefined();
    expect(blueprint.firestore).toBeDefined();
    expect(blueprint.firestore['/users/{userId}']).toBeDefined();
  });

  test('firestore.rules exists and contains default-deny and isOwner rules', () => {
    const rulesPath = path.join(process.cwd(), 'firestore.rules');
    expect(fs.existsSync(rulesPath)).toBe(true);
    const content = fs.readFileSync(rulesPath, 'utf8');
    expect(content).toContain("rules_version = '2'");
    expect(content).toContain('allow read, write: if false');
    expect(content).toContain('isOwner(userId)');
  });

  test('GET /api/firebase/config returns public configuration', async () => {
    const res = await request(app).get('/api/firebase/config');
    expect(res.status).toBe(200);
    expect(res.body.projectId).toBe('gen-lang-client-0725368052');
    expect(res.body.firestoreDatabaseId).toBeDefined();
  });

  test('GET /api/firebase/prayer-logs requires authentication', async () => {
    const res = await request(app).get('/api/firebase/prayer-logs');
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Missing Firebase Bearer token');
  });

  test('handleFirestoreError throws formatted JSON error conforming to specification', () => {
    let thrownError;
    try {
      handleFirestoreError(new Error('Permission denied'), OperationType.GET, 'users/test-uid');
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
    const parsed = JSON.parse(thrownError.message);
    expect(parsed.error).toBe('Permission denied');
    expect(parsed.operationType).toBe('get');
    expect(parsed.path).toBe('users/test-uid');
  });
});
