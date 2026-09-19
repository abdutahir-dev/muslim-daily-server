import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { asmaulHusnaDb, initDatabases } from '../db/connection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFilePath = path.join(__dirname, '..', '..', 'data', 'asmaul-husna.json');

// In-memory cache loaded from JSON file
let cachedNames = [];
try {
  if (fs.existsSync(dataFilePath)) {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    cachedNames = JSON.parse(raw);
  }
} catch (err) {
  console.warn('[asmaulHusnaService] Failed to load data/asmaul-husna.json:', err.message);
}

/**
 * Strips Arabic tashkeel / harakat and normalizes Alifs for diacritic-tolerant matching
 */
export function normalizeArabic(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // Tashkeel
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim();
}

/**
 * Formats a raw Asmaul Husna item according to the requested language
 */
export function formatNameRecord(item, lang = 'all') {
  if (!item) return null;

  const base = {
    number: item.number,
    name_ar: item.name_ar,
    name_ar_clean: item.name_ar_clean || normalizeArabic(item.name_ar),
    transliteration: item.transliteration,
    reference: item.reference || {
      quran: item.quran_reference,
      surah_number: item.surah_number,
      ayah_number: item.ayah_number,
      ayah_ar: item.ayah_ar,
      hadith: item.hadith_reference
    }
  };

  const translations = item.translation || {
    en: item.translation_en,
    am: item.translation_am,
    ar: item.translation_ar
  };

  const descriptions = item.description || {
    en: item.description_en,
    am: item.description_am,
    ar: item.description_ar
  };

  if (lang === 'en') {
    return {
      ...base,
      language: 'en',
      translation: translations.en || '',
      description: descriptions.en || ''
    };
  } else if (lang === 'am') {
    return {
      ...base,
      language: 'am',
      translation: translations.am || '',
      description: descriptions.am || ''
    };
  } else if (lang === 'ar') {
    return {
      ...base,
      language: 'ar',
      translation: translations.ar || '',
      description: descriptions.ar || ''
    };
  }

  // Default: 'all' returns the complete multilingual bundle
  return {
    ...base,
    translation: translations,
    description: descriptions
  };
}

/**
 * Retrieves all 99 names with optional search, language localization, and pagination
 */
export async function getAllNames(options = {}) {
  const { lang = 'all', search, page, limit } = options;

  let items = [...cachedNames];

  // If search query is supplied
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    const qNorm = normalizeArabic(q);

    items = items.filter(n => {
      const translitMatch = (n.transliteration || '').toLowerCase().includes(q);
      const enTransMatch = (n.translation?.en || '').toLowerCase().includes(q);
      const enDescMatch = (n.description?.en || '').toLowerCase().includes(q);
      const amTransMatch = (n.translation?.am || '').includes(q);
      const amDescMatch = (n.description?.am || '').includes(q);
      const arNameMatch = (n.name_ar || '').includes(q);
      const arCleanMatch = normalizeArabic(n.name_ar_clean || n.name_ar).includes(qNorm);
      const arTransMatch = (n.translation?.ar || '').includes(q);
      const arDescMatch = (n.description?.ar || '').includes(q);
      const refMatch = (n.reference?.quran || '').toLowerCase().includes(q) || (n.reference?.hadith || '').toLowerCase().includes(q);

      return translitMatch || enTransMatch || enDescMatch || amTransMatch || amDescMatch ||
             arNameMatch || arCleanMatch || arTransMatch || arDescMatch || refMatch;
    });
  }

  const total = items.length;

  // Pagination if limit is specified
  if (limit && Number(limit) > 0) {
    const l = Math.min(Number(limit), 100);
    const p = Math.max(Number(page) || 1, 1);
    const startIndex = (p - 1) * l;
    items = items.slice(startIndex, startIndex + l);

    return {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
      language: lang,
      data: items.map(i => formatNameRecord(i, lang))
    };
  }

  return {
    total,
    count: items.length,
    language: lang,
    data: items.map(i => formatNameRecord(i, lang))
  };
}

/**
 * Retrieves a single name by number (1-99), transliteration, or Arabic name
 */
export async function getNameByIdentifier(identifier, options = {}) {
  const { lang = 'all' } = options;
  if (!identifier) return null;

  const rawId = String(identifier).trim();
  const num = parseInt(rawId, 10);

  // Match by number (1..99)
  if (!isNaN(num) && num >= 1 && num <= 99) {
    const found = cachedNames.find(n => n.number === num);
    if (found) return formatNameRecord(found, lang);
  }

  const cleanQuery = rawId.toLowerCase().replace(/^(al-|ar-|as-|ash-|an-|ad-|at-|az-)/, '');
  const arNorm = normalizeArabic(rawId);

  // Match by transliteration or Arabic
  const found = cachedNames.find(n => {
    const translitNorm = n.transliteration.toLowerCase().replace(/^(al-|ar-|as-|ash-|an-|ad-|at-|az-)/, '');
    if (n.transliteration.toLowerCase() === rawId.toLowerCase()) return true;
    if (translitNorm === cleanQuery) return true;
    if (n.name_ar === rawId) return true;
    if (normalizeArabic(n.name_ar_clean || n.name_ar) === arNorm) return true;
    return false;
  });

  return found ? formatNameRecord(found, lang) : null;
}

/**
 * Returns a random name of Allah
 */
export async function getRandomName(options = {}) {
  const { lang = 'all' } = options;
  if (!cachedNames.length) return null;
  const randomIndex = Math.floor(Math.random() * cachedNames.length);
  return formatNameRecord(cachedNames[randomIndex], lang);
}

/**
 * Returns a deterministic daily name of Allah for a given date
 */
export async function getDailyName(options = {}) {
  const { date, lang = 'all' } = options;
  const targetDate = date ? new Date(date) : new Date();

  // Create deterministic hash from date (YYYY-MM-DD)
  const y = targetDate.getFullYear();
  const m = targetDate.getMonth() + 1;
  const d = targetDate.getDate();

  // Day of year calculation
  const startOfYear = new Date(y, 0, 1);
  const dayOfYear = Math.floor((targetDate - startOfYear) / (24 * 60 * 60 * 1000));

  const nameIndex = Math.abs(dayOfYear) % (cachedNames.length || 99);
  const selected = cachedNames[nameIndex] || cachedNames[0];

  return {
    date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    name: formatNameRecord(selected, lang)
  };
}

/**
 * Returns summary statistics about the Asmaul Husna dataset
 */
export async function getStats() {
  return {
    total: cachedNames.length || 99,
    supportedLanguages: ['ar', 'am', 'en'],
    languageLabels: {
      ar: 'العربية (Arabic)',
      am: 'አማርኛ (Amharic)',
      en: 'English'
    },
    referenceCoverage: '100%',
    quranicVersesCited: 99,
    hadithSources: ['Sahih al-Bukhari', 'Sahih Muslim', 'Sunan at-Tirmidhi', 'Sunan Abu Dawood', 'Musnad Ahmad'],
    datasetVersion: '1.0.0'
  };
}
