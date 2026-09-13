import { jest } from '@jest/globals';

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
const { initDatabases } = await import('../src/db/connection.js');
const qamusService = await import('../src/services/qamusService.js');
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');

describe('Qamus Quranic Lexicon Service & Routes', () => {
  beforeAll(async () => {
    await initDatabases();
  });

  describe('Service Layer', () => {
    test('getQamusInfo returns correct statistics and metadata', async () => {
      const info = await qamusService.getQamusInfo();
      expect(info).toBeDefined();
      expect(info.name).toContain('Qamus');
      expect(info.statistics.total_entries).toBe(2092);
      expect(info.statistics.distinct_roots).toBe(1091);
      expect(info.statistics.sections.verb).toBe(947);
      expect(info.statistics.sections.noun).toBe(1045);
      expect(info.statistics.sections.particle).toBe(100);
      expect(info.statistics.total_ayah_occurrences).toBe(7700);
    });

    test('getEntries returns paginated entries', async () => {
      const res = await qamusService.getEntries({ page: 1, limit: 5 });
      expect(res.entries).toHaveLength(5);
      expect(res.pagination.total).toBe(2092);
      expect(res.pagination.page).toBe(1);
      expect(res.pagination.limit).toBe(5);

      const first = res.entries[0];
      expect(first.id).toBeDefined();
      expect(first.headword).toBeDefined();
      expect(Array.isArray(first.senses)).toBe(true);
      expect(Array.isArray(first.usage)).toBe(true);
    });

    test('searchQamus finds entries by Arabic headword and root', async () => {
      const arabicResult = await qamusService.searchQamus('رحم');
      expect(arabicResult.results.length).toBeGreaterThan(0);
      const match = arabicResult.results.find(e => e.translit?.includes('raḥim') || e.headword?.includes('رَحِم'));
      expect(match).toBeDefined();
    });

    test('getAyahVocabulary returns words occurring in Surah 1 Ayah 1', async () => {
      const ayahVocab = await qamusService.getAyahVocabulary('1:1');
      expect(ayahVocab.ayah_ref).toBe('1:1');
      expect(ayahVocab.count).toBeGreaterThan(0);
      const word = ayahVocab.vocabulary[0];
      expect(word.headword).toBeDefined();
    });

    test('getRoots lists distinct Quranic roots', async () => {
      const rootsRes = await qamusService.getRoots({ page: 1, limit: 10 });
      expect(rootsRes.roots.length).toBe(10);
      expect(rootsRes.pagination.total).toBe(1091);
      expect(rootsRes.roots[0].root).toBeDefined();
      expect(Array.isArray(rootsRes.roots[0].sample_words)).toBe(true);
    });

    test('getDailyWord returns consistent word for a date', async () => {
      const day1 = await qamusService.getDailyWord('2026-09-13');
      const day1Repeat = await qamusService.getDailyWord('2026-09-13');
      expect(day1.entry.id).toBe(day1Repeat.entry.id);
    });
  });

  describe('HTTP API Endpoints (/qamus and /api/qamus)', () => {
    test('GET /qamus returns 200 with service information', async () => {
      const res = await request(app).get('/qamus');
      expect(res.status).toBe(200);
      expect(res.body.statistics.total_entries).toBe(2092);
      expect(res.body.endpoints.entries).toBe('/qamus/entries');
    });

    test('GET /api/qamus alias returns 200', async () => {
      const res = await request(app).get('/api/qamus');
      expect(res.status).toBe(200);
      expect(res.body.name).toContain('Qamus');
    });

    test('GET /qamus/entries returns paginated entries', async () => {
      const res = await request(app).get('/qamus/entries?limit=3');
      expect(res.status).toBe(200);
      expect(res.body.entries).toHaveLength(3);
    });

    test('GET /qamus/search handles query parameter', async () => {
      const res = await request(app).get('/qamus/search').query({ q: 'mercy' });
      expect(res.status).toBe(200);
      expect(res.body.results.length).toBeGreaterThan(0);
    });

    test('GET /qamus/sections returns verbs, nouns, and particles', async () => {
      const res = await request(app).get('/qamus/sections');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some(s => s.section === 'verb')).toBe(true);
      expect(res.body.some(s => s.section === 'noun')).toBe(true);
      expect(res.body.some(s => s.section === 'particle')).toBe(true);
    });

    test('GET /qamus/grammar-classes returns ontology classes', async () => {
      const res = await request(app).get('/qamus/grammar-classes');
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
  });
});
