import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { qamusDb, initDatabases } from '../db/connection.js';
import dayjs from 'dayjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');

// Lazy-loaded auxiliary datasets
let manifestCache = null;
let ontologyCache = null;
let spineCache = null;

function loadJsonFile(relativePath) {
  try {
    const fullPath = path.join(rootDir, relativePath);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    }
  } catch (err) {
    console.warn(`[qamusService] Could not load ${relativePath}:`, err.message);
  }
  return null;
}

export function getManifest() {
  if (!manifestCache) {
    manifestCache = loadJsonFile('data/qamus/entry-manifest.json') || {
      entry_count: 2092,
      distinct_roots: 1091,
      section_counts: { verb: 947, noun: 1045, particle: 100 },
      category_count: 55,
      total_examples: 7700
    };
  }
  return manifestCache;
}

export function getGrammarOntology() {
  if (!ontologyCache) {
    ontologyCache = loadJsonFile('data/qamus/qg-ontology.json') || [];
  }
  return ontologyCache;
}

export function getSpine() {
  if (!spineCache) {
    spineCache = loadJsonFile('data/qamus/quran_usage_spine.json') || { ayah: {} };
  }
  return spineCache;
}

export function normalizeArabic(text) {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // remove tashkeel/diacritics
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

async function ensureDb() {
  if (!qamusDb) {
    await initDatabases();
  }
  return qamusDb;
}

function parseEntryRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    headword: row.headword,
    translit: row.translit,
    root: row.root,
    root_translit: row.root_translit,
    category: row.category,
    section: row.section,
    definition: row.definition,
    meaning: row.meaning,
    senses: row.senses_json ? JSON.parse(row.senses_json) : [],
    usage: row.usage_json ? JSON.parse(row.usage_json) : [],
    tags: row.tags_json ? JSON.parse(row.tags_json) : [],
    total_uses: row.total_uses || 0,
    source_keys: row.source_keys_json ? JSON.parse(row.source_keys_json) : []
  };
}

export async function getQamusInfo() {
  const db = await ensureDb();
  const manifest = getManifest();
  const countRow = await db.get('SELECT COUNT(*) as count FROM entries');
  const sectionRows = await db.all('SELECT section, COUNT(*) as count FROM entries GROUP BY section');
  const sections = {};
  sectionRows.forEach(r => { sections[r.section] = r.count; });

  const rootCount = await db.get('SELECT COUNT(DISTINCT root) as count FROM entries WHERE root != ""');
  const ayahVocabCount = await db.get('SELECT COUNT(*) as count FROM ayah_vocabulary');

  return {
    name: 'Fusha Qamus Quranic Lexicon',
    description: 'Quran-anchored sarf (morphology), nahw (syntax), and tarkeeb lexicon over 2,092 certified entries with exact-occurrence Ayah transclusions and syntactic color ontology.',
    source: 'https://github.com/abdutahir-dev/fusha',
    version: '1.0.0',
    statistics: {
      total_entries: countRow?.count || manifest.entry_count || 2092,
      sections: sections,
      distinct_roots: rootCount?.count || manifest.distinct_roots || 1091,
      total_ayah_occurrences: ayahVocabCount?.count || manifest.total_examples || 7700,
      categories_count: manifest.category_count || 55
    },
    endpoints: {
      root: '/qamus',
      entries: '/qamus/entries',
      entry_by_id: '/qamus/entries/{id}',
      search: '/qamus/search?q={query}',
      roots: '/qamus/roots',
      root_entries: '/qamus/roots/{root}',
      sections: '/qamus/sections',
      categories: '/qamus/categories',
      category_entries: '/qamus/categories/{category}',
      ayah_vocabulary: '/qamus/ayah/{ref}',
      daily_word: '/qamus/daily',
      random_word: '/qamus/random',
      grammar_ontology: '/qamus/grammar-classes',
      manifest: '/qamus/manifest'
    }
  };
}

export async function getEntries({ page = 1, limit = 20, section, category, root, search, letter } = {}) {
  const db = await ensureDb();
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  const params = [];

  if (section) {
    conditions.push('section = ?');
    params.push(section.toLowerCase());
  }

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (root) {
    const cleanRoot = root.trim();
    // Allow searching with or without spaces, e.g. "كتب" or "ك ت ب"
    const spacedRoot = cleanRoot.includes(' ') ? cleanRoot : cleanRoot.split('').join(' ');
    conditions.push('(root = ? OR root = ?)');
    params.push(cleanRoot, spacedRoot);
  }

  if (letter) {
    conditions.push('(headword LIKE ? OR root LIKE ?)');
    params.push(`${letter}%`, `${letter}%`);
  }

  if (search) {
    const q = search.trim();
    conditions.push('(headword LIKE ? OR translit LIKE ? OR root LIKE ? OR definition LIKE ? OR meaning LIKE ?)');
    const likeParam = `%${q}%`;
    params.push(likeParam, likeParam, likeParam, likeParam, likeParam);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const totalRow = await db.get(`SELECT COUNT(*) as count FROM entries ${whereClause}`, params);
  const total = totalRow?.count || 0;

  const rows = await db.all(
    `SELECT * FROM entries ${whereClause} ORDER BY total_uses DESC, headword ASC LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  return {
    entries: rows.map(parseEntryRow),
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
}

export async function getEntryById(idOrHeadword) {
  const db = await ensureDb();
  if (!idOrHeadword) return null;

  const clean = idOrHeadword.trim();
  let row = await db.get('SELECT * FROM entries WHERE id = ?', [clean]);
  if (!row) {
    row = await db.get('SELECT * FROM entries WHERE headword = ?', [clean]);
  }
  if (!row) {
    // Try normalized arabic headword
    const normalized = normalizeArabic(clean);
    const candidateRows = await db.all('SELECT * FROM entries LIMIT 500');
    row = candidateRows.find(r => normalizeArabic(r.headword) === normalized);
  }
  return parseEntryRow(row);
}

export async function searchQamus(query, { section, limit = 25 } = {}) {
  const db = await ensureDb();
  if (!query || !query.trim()) {
    return { results: [], total: 0, query: '' };
  }

  const q = query.trim();
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));

  const conditions = [];
  const params = [];

  if (section) {
    conditions.push('section = ?');
    params.push(section.toLowerCase());
  }

  const cleanQ = `%${q}%`;
  const normalizedQ = normalizeArabic(q);

  conditions.push('(headword LIKE ? OR translit LIKE ? OR root LIKE ? OR definition LIKE ? OR meaning LIKE ?)');
  params.push(cleanQ, cleanQ, cleanQ, cleanQ, cleanQ);

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = await db.all(`SELECT * FROM entries ${whereClause} ORDER BY total_uses DESC LIMIT ?`, [...params, limitNum * 2]);

  let results = rows.map(parseEntryRow);

  // If query is Arabic and no direct match, check normalized headword / root
  if (results.length === 0 && normalizedQ) {
    const allRows = await db.all(
      section ? 'SELECT * FROM entries WHERE section = ?' : 'SELECT * FROM entries',
      section ? [section.toLowerCase()] : []
    );
    results = allRows
      .filter(r => {
        const hNorm = normalizeArabic(r.headword);
        const rNorm = normalizeArabic(r.root.replace(/\s+/g, ''));
        return hNorm.includes(normalizedQ) || rNorm.includes(normalizedQ);
      })
      .slice(0, limitNum)
      .map(parseEntryRow);
  }

  return {
    query: q,
    results: results.slice(0, limitNum),
    total: results.length
  };
}

export async function getRoots({ page = 1, limit = 50, search, letter } = {}) {
  const db = await ensureDb();
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
  const offset = (pageNum - 1) * limitNum;

  const conditions = ['root != ""'];
  const params = [];

  if (letter) {
    conditions.push('root LIKE ?');
    params.push(`${letter}%`);
  }

  if (search) {
    const q = search.trim();
    conditions.push('(root LIKE ? OR root_translit LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const totalRow = await db.get(`SELECT COUNT(DISTINCT root) as count FROM entries ${whereClause}`, params);
  const total = totalRow?.count || 0;

  const rows = await db.all(`
    SELECT root, root_translit, COUNT(*) as entries_count, GROUP_CONCAT(headword, ', ') as sample_words
    FROM entries
    ${whereClause}
    GROUP BY root
    ORDER BY entries_count DESC, root ASC
    LIMIT ? OFFSET ?
  `, [...params, limitNum, offset]);

  return {
    roots: rows.map(r => ({
      root: r.root,
      root_translit: r.root_translit,
      entries_count: r.entries_count,
      sample_words: r.sample_words ? r.sample_words.split(', ').slice(0, 5) : []
    })),
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
}

export async function getEntriesByRoot(rootStr) {
  const db = await ensureDb();
  if (!rootStr) return { root: '', entries: [], count: 0 };

  const clean = rootStr.trim();
  const spaced = clean.includes(' ') ? clean : clean.split('').join(' ');

  const rows = await db.all(
    'SELECT * FROM entries WHERE root = ? OR root = ? ORDER BY total_uses DESC',
    [clean, spaced]
  );

  return {
    root: clean,
    spaced_root: spaced,
    entries: rows.map(parseEntryRow),
    count: rows.length
  };
}

export async function getSections() {
  const db = await ensureDb();
  const rows = await db.all(`
    SELECT section, COUNT(*) as count, SUM(total_uses) as total_occurrences
    FROM entries
    GROUP BY section
    ORDER BY count DESC
  `);

  const descriptions = {
    noun: 'Quranic nominal forms, verbal nouns (masdar), adjectives, and participles (ism fa\'il / maf\'ul)',
    verb: 'Quranic active and passive verbal conjugations across Arabic triliteral and quadrilateral forms',
    particle: 'Quranic prepositions, conjunctions, interrogatives, conditionals, and operative particles (harf)'
  };

  return rows.map(r => ({
    section: r.section,
    name: r.section.charAt(0).toUpperCase() + r.section.slice(1) + 's',
    count: r.count,
    total_occurrences: r.total_occurrences || 0,
    description: descriptions[r.section] || ''
  }));
}

export async function getCategories() {
  const db = await ensureDb();
  const rows = await db.all(`
    SELECT category, COUNT(*) as count, GROUP_CONCAT(DISTINCT section) as sections
    FROM entries
    WHERE category != ""
    GROUP BY category
    ORDER BY count DESC, category ASC
  `);

  return rows.map(r => ({
    category: r.category,
    entries_count: r.count,
    sections: r.sections ? r.sections.split(',') : []
  }));
}

export async function getEntriesByCategory(categoryName, { page = 1, limit = 20 } = {}) {
  return getEntries({ page, limit, category: categoryName });
}

export async function getAyahVocabulary(refOrSurah, ayah) {
  const db = await ensureDb();
  let ref = '';

  if (ayah !== undefined && ayah !== null) {
    ref = `${refOrSurah}:${ayah}`;
  } else {
    ref = String(refOrSurah).trim();
  }

  // Get vocabulary occurrences mapped to this Ayah
  const vocabRows = await db.all(`
    SELECT DISTINCT e.*
    FROM ayah_vocabulary v
    JOIN entries e ON v.entry_id = e.id
    WHERE v.ayah_ref = ?
    ORDER BY e.total_uses DESC
  `, [ref]);

  // Check Quran usage spine for word-by-word token resolution
  const spine = getSpine();
  const spineTokens = spine?.ayah?.[ref] || [];

  return {
    ayah_ref: ref,
    vocabulary: vocabRows.map(parseEntryRow),
    count: vocabRows.length,
    spine_tokens: spineTokens
  };
}

export async function getDailyWord(dateStr) {
  const db = await ensureDb();
  const targetDate = dateStr || dayjs().format('YYYY-MM-DD');

  // Generate deterministic pseudo-random index based on date string
  let hash = 0;
  for (let i = 0; i < targetDate.length; i++) {
    hash = (hash << 5) - hash + targetDate.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const totalRow = await db.get('SELECT COUNT(*) as count FROM entries');
  const total = totalRow?.count || 2092;
  const targetOffset = positiveHash % total;

  const row = await db.get('SELECT * FROM entries ORDER BY id ASC LIMIT 1 OFFSET ?', [targetOffset]);
  return {
    date: targetDate,
    entry: parseEntryRow(row)
  };
}

export async function getRandomWord({ section } = {}) {
  const db = await ensureDb();
  let query = 'SELECT * FROM entries';
  const params = [];

  if (section) {
    query += ' WHERE section = ?';
    params.push(section.toLowerCase());
  }

  query += ' ORDER BY RANDOM() LIMIT 1';
  const row = await db.get(query, params);
  return parseEntryRow(row);
}
