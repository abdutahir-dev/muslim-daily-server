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

// Dynamic imports after mocking
const { initDatabases } = await import('../src/db/connection.js');
const dictionaryService = await import('../src/services/dictionaryService.js');
const translationService = await import('../src/services/translationService.js');
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');

describe('Trilingual Dictionary & Translation Service (Arabic, Amharic, English)', () => {
  beforeAll(async () => {
    await initDatabases();
  });

  describe('dictionaryService', () => {
    test('getEntries returns seeded trilingual records', async () => {
      const result = await dictionaryService.getEntries({ limit: 10 });
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThanOrEqual(10);
      expect(result.total).toBeGreaterThanOrEqual(60);

      const entry = result.data[0];
      expect(entry.arabic).toBeDefined();
      expect(entry.amharic).toBeDefined();
      expect(entry.english).toBeDefined();
      expect(entry.root).toBeDefined();
    });

    test('lookupWord resolves Arabic, Amharic, and English headwords', async () => {
      // Lookup English
      const enResult = await dictionaryService.lookupWord('peace');
      expect(enResult).toBeDefined();
      expect(enResult.word.en.toLowerCase()).toContain('peace');

      // Lookup Amharic
      const amResult = await dictionaryService.lookupWord('ሰላም');
      expect(amResult).toBeDefined();
      expect(amResult.word.am).toContain('ሰላም');

      // Lookup Arabic (with or without tashkeel)
      const arResult = await dictionaryService.lookupWord('سلام');
      expect(arResult).toBeDefined();
      expect(arResult.word.ar_clean).toBe('سلام');
    });

    test('searchEntries performs diacritic-tolerant trilingual search', async () => {
      const searchAm = await dictionaryService.searchEntries({ q: 'ሰላም' });
      expect(searchAm.data.length).toBeGreaterThan(0);
      expect(searchAm.data.some((e) => e.word.am.includes('ሰላም'))).toBe(true);

      const searchAr = await dictionaryService.searchEntries({ q: 'رحمة' });
      expect(searchAr.data.length).toBeGreaterThan(0);
    });

    test('getDailyWord returns deterministic entry matching date', async () => {
      const dateStr = '2026-09-18';
      const word1 = await dictionaryService.getDailyWord(dateStr);
      const word2 = await dictionaryService.getDailyWord(dateStr);
      expect(word1.id).toBe(word2.id);
      expect(word1.date).toBe(dateStr);
      expect(word1.word).toBeDefined();
    });

    test('getRandomWord returns a valid vocabulary entry', async () => {
      const word = await dictionaryService.getRandomWord();
      expect(word).toBeDefined();
      expect(word.id).toBeDefined();
      expect(word.word.en).toBeDefined();
      expect(word.word.am).toBeDefined();
      expect(word.word.ar).toBeDefined();
    });

    test('getAutocomplete provides prefix suggestions across scripts', async () => {
      const enSuggestions = await dictionaryService.getAutocomplete('peac');
      expect(enSuggestions.length).toBeGreaterThan(0);
      expect(enSuggestions.some((s) => s.word.toLowerCase().includes('peace'))).toBe(true);

      const amSuggestions = await dictionaryService.getAutocomplete('ሰላ');
      expect(amSuggestions.length).toBeGreaterThan(0);
      expect(amSuggestions.some((s) => s.word.includes('ሰላም'))).toBe(true);
    });

    test('getCategories and getPartsOfSpeech return valid metadata', async () => {
      const categories = await dictionaryService.getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories.some((c) => c.category.toLowerCase().includes('faith') || c.category.toLowerCase().includes('greetings'))).toBe(true);

      const pos = await dictionaryService.getPartsOfSpeech();
      expect(pos.length).toBeGreaterThan(0);
      expect(pos.some((p) => (p.part_of_speech || p.pos) === 'noun')).toBe(true);
    });
  });

  describe('translationService', () => {
    test('detectLanguage correctly identifies Arabic, Amharic, and English scripts', () => {
      const arDetect = translationService.detectLanguage('السلام عليكم ورحمة الله');
      expect(arDetect.language).toBe('ar');
      expect(arDetect.script).toBe('arabic');
      expect(arDetect.confidence).toBeGreaterThan(0.8);

      const amDetect = translationService.detectLanguage('ሰላም ለእናንተ ይሁን፤ እንኳን ደህና መጣችሁ');
      expect(amDetect.language).toBe('am');
      expect(amDetect.script).toBe('ethiopic');
      expect(amDetect.confidence).toBeGreaterThan(0.8);

      const enDetect = translationService.detectLanguage('Peace and blessings be upon you');
      expect(enDetect.language).toBe('en');
      expect(enDetect.script).toBe('latin');
      expect(enDetect.confidence).toBeGreaterThan(0.8);
    });

    test('getSupportedPairs lists 6 bidirectional language pairs', () => {
      const pairs = translationService.getSupportedPairs();
      expect(pairs.length).toBe(6);
      expect(pairs.some((p) => p.source === 'ar' && p.target === 'en')).toBe(true);
      expect(pairs.some((p) => p.source === 'ar' && p.target === 'am')).toBe(true);
      expect(pairs.some((p) => p.source === 'am' && p.target === 'ar')).toBe(true);
      expect(pairs.some((p) => p.source === 'am' && p.target === 'en')).toBe(true);
      expect(pairs.some((p) => p.source === 'en' && p.target === 'ar')).toBe(true);
      expect(pairs.some((p) => p.source === 'en' && p.target === 'am')).toBe(true);
    });

    test('translateText uses trilingual lexicon for matched phrases', async () => {
      const res1 = await translationService.translateText({
        text: 'السلام عليكم',
        sourceLang: 'ar',
        targetLang: 'am'
      });
      expect(res1.translatedText).toBeDefined();
      expect(res1.translatedText).toContain('ሰላም');
      expect(res1.engine).toBe('trilingual-lexicon');

      const res2 = await translationService.translateText({
        text: 'ሰላም',
        sourceLang: 'am',
        targetLang: 'en'
      });
      expect(res2.translatedText.toLowerCase()).toContain('peace');
      expect(res2.engine).toBe('trilingual-lexicon');
    });

    test('translateText handles same source and target language gracefully', async () => {
      const res = await translationService.translateText({
        text: 'ሰላም',
        sourceLang: 'am',
        targetLang: 'am'
      });
      expect(res.translatedText).toBe('ሰላም');
      expect(res.engine).toBe('identical');
    });
  });

  describe('HTTP Endpoints Integration', () => {
    test('GET /dictionary returns paginated entries', async () => {
      const res = await request(app).get('/dictionary?limit=5');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(5);
      expect(res.body.pagination).toBeDefined();
    });

    test('GET /dictionary/lookup/:word resolves term', async () => {
      const res = await request(app).get('/dictionary/lookup/' + encodeURIComponent('ሰላም'));
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.word.am).toContain('ሰላም');
    });

    test('GET /dictionary/search returns search results', async () => {
      const res = await request(app).get('/dictionary/search?q=peace');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('GET /dictionary/daily returns daily word', async () => {
      const res = await request(app).get('/dictionary/daily');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.word).toBeDefined();
    });

    test('GET /dictionary/autocomplete returns query suggestions', async () => {
      const res = await request(app).get('/dictionary/autocomplete?q=peac');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.suggestions).toBeDefined();
    });

    test('POST /translation/translate translates text payload', async () => {
      const res = await request(app)
        .post('/translation/translate')
        .send({
          text: 'السلام عليكم',
          sourceLang: 'ar',
          targetLang: 'en'
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.translatedText).toBeDefined();
      expect(res.body.translatedText.toLowerCase()).toContain('peace');
    });

    test('POST /translation/detect identifies script & language', async () => {
      const res = await request(app)
        .post('/translation/detect')
        .send({
          text: 'እንኳን ደህና መጣችሁ'
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.detection.language).toBe('am');
      expect(res.body.detection.script).toBe('ethiopic');
    });

    test('GET /translation/pairs lists language pairs', async () => {
      const res = await request(app).get('/translation/pairs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pairs.length).toBe(6);
    });
  });
});
