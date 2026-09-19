import { jest } from '@jest/globals';

// Mock firebase-admin modules to prevent Jest CJS-ESM interop issues
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
const asmaulHusnaService = await import('../src/services/asmaulHusnaService.js');
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');

describe('Asmaul Husna (99 Names of Allah) Service & Endpoints', () => {
  beforeAll(async () => {
    await initDatabases();
  });

  describe('asmaulHusnaService', () => {
    test('getAllNames returns exactly 99 names with trilingual data', async () => {
      const result = await asmaulHusnaService.getAllNames({ lang: 'all' });
      expect(result.total).toBe(99);
      expect(result.data.length).toBe(99);

      const first = result.data[0];
      expect(first.number).toBe(1);
      expect(first.name_ar).toBe('الرَّحْمَٰنُ');
      expect(first.transliteration).toBe('Ar-Rahman');
      expect(first.translation.en).toBe('The Entirely Merciful');
      expect(first.translation.am).toBe('እጅግ በጣም ሩኅሩህ');
      expect(first.reference.quran).toBeDefined();
      expect(first.reference.quran).toContain('Al-Fatihah');
      expect(first.reference.hadith).toBeDefined();
    });

    test('getAllNames formats output properly for Amharic localization', async () => {
      const result = await asmaulHusnaService.getAllNames({ lang: 'am', limit: 3 });
      expect(result.data.length).toBe(3);
      expect(result.language).toBe('am');
      expect(result.data[0].translation).toBe('እጅግ በጣም ሩኅሩህ');
      expect(result.data[0].description).toContain('ፍጥረታት');
    });

    test('getNameByIdentifier finds name by number, Arabic, or transliteration', async () => {
      const byNum = await asmaulHusnaService.getNameByIdentifier(1);
      expect(byNum.name_ar_clean).toBe('الرحمن');

      const byAr = await asmaulHusnaService.getNameByIdentifier('الرحمن');
      expect(byAr.number).toBe(1);

      const byTrans = await asmaulHusnaService.getNameByIdentifier('ar-rahman');
      expect(byTrans.number).toBe(1);

      const byMalik = await asmaulHusnaService.getNameByIdentifier('Al-Malik', { lang: 'am' });
      expect(byMalik.number).toBe(3);
      expect(byMalik.translation).toContain('ንጉሥ');
    });

    test('getDailyName returns deterministic entry for date', async () => {
      const daily1 = await asmaulHusnaService.getDailyName({ date: '2026-09-13' });
      const daily2 = await asmaulHusnaService.getDailyName({ date: '2026-09-13' });
      expect(daily1.name.number).toBe(daily2.name.number);
      expect(daily1.date).toBe('2026-09-13');
    });

    test('getRandomName returns a valid name', async () => {
      const random = await asmaulHusnaService.getRandomName();
      expect(random.number).toBeGreaterThanOrEqual(1);
      expect(random.number).toBeLessThanOrEqual(99);
    });

    test('getAllNames with search matches across Arabic, Amharic, and English', async () => {
      // English query
      const enSearch = await asmaulHusnaService.getAllNames({ search: 'Peace' });
      expect(enSearch.total).toBeGreaterThanOrEqual(1);
      expect(enSearch.data.some((n) => n.transliteration === 'As-Salam')).toBe(true);

      // Amharic query
      const amSearch = await asmaulHusnaService.getAllNames({ search: 'ንጉሥ' });
      expect(amSearch.total).toBeGreaterThanOrEqual(1);
      expect(amSearch.data.some((n) => n.transliteration === 'Al-Malik')).toBe(true);

      // Arabic query without tashkeel
      const arSearch = await asmaulHusnaService.getAllNames({ search: 'رحيم' });
      expect(arSearch.total).toBeGreaterThanOrEqual(1);
      expect(arSearch.data.some((n) => n.transliteration === 'Ar-Rahim')).toBe(true);
    });

    test('getStats returns verification metrics', async () => {
      const stats = await asmaulHusnaService.getStats();
      expect(stats.total).toBe(99);
      expect(stats.referenceCoverage).toBe('100%');
      expect(stats.supportedLanguages).toContain('am');
      expect(stats.supportedLanguages).toContain('ar');
      expect(stats.supportedLanguages).toContain('en');
    });
  });

  describe('HTTP Endpoints /asmaul-husna', () => {
    test('GET /asmaul-husna returns 200 with list of names', async () => {
      const res = await request(app).get('/asmaul-husna?limit=5');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(5);
      expect(res.body.total).toBe(99);
    });

    test('GET /asmaul-husna/1?lang=am returns Amharic localized name', async () => {
      const res = await request(app).get('/asmaul-husna/1?lang=am');
      expect(res.status).toBe(200);
      expect(res.body.translation).toBe('እጅግ በጣም ሩኅሩህ');
      expect(res.body.reference.quran).toBeDefined();
    });

    test('GET /asmaul-husna/daily returns daily contemplation name', async () => {
      const res = await request(app).get('/asmaul-husna/daily');
      expect(res.status).toBe(200);
      expect(res.body.date).toBeDefined();
      expect(res.body.name.number).toBeDefined();
    });

    test('GET /asmaul-husna/search?q=ንጉሥ&lang=am returns matching result', async () => {
      const res = await request(app).get('/asmaul-husna/search?q=%E1%8A%95%E1%8C%89%E1%88%A5&lang=am');
      expect(res.status).toBe(200);
      expect(res.body.total).toBeGreaterThanOrEqual(1);
      expect(res.body.results.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /asmaul-husna/stats returns metrics', async () => {
      const res = await request(app).get('/asmaul-husna/stats');
      expect(res.status).toBe(200);
      expect(res.body.total).toBe(99);
    });

    test('GET /api/asmaul-husna alias works identically', async () => {
      const res = await request(app).get('/api/asmaul-husna/stats');
      expect(res.status).toBe(200);
      expect(res.body.total).toBe(99);
    });
  });
});
