import type { ApiEndpoint } from '../types.js';

export const API_CATEGORIES = [
  'All',
  'Trilingual Dictionary & Translation',
  'Asmaul Husna (99 Names)',
  'Firebase & Firestore',
  'Prayers & Timings',
  'Quran & Tafsir',
  'Hadith Collections',
  'Duas & Azkar',
  'Calendar & Conversions',
  'Fasting Tracker',
  'Spiritual Journal',
  'Social & Challenges',
  'Analytics & Streaks',
  'Search & System',
  'Qamus Quranic Lexicon'
] as const;

export const ENDPOINTS: ApiEndpoint[] = [
  // 0. Trilingual Dictionary & Translation Service (Arabic, Amharic, English)
  {
    id: 'dict-browse',
    category: 'Trilingual Dictionary & Translation',
    name: 'Browse Trilingual Dictionary',
    method: 'GET',
    path: '/dictionary',
    description: 'Retrieves cross-referenced dictionary entries across Arabic, Amharic, and English with root words, grammatical categories, definitions, and examples.',
    params: [
      { name: 'lang', type: 'query', defaultValue: 'all', description: 'Target output format: all, ar, am, or en' },
      { name: 'category', type: 'query', defaultValue: '', description: 'Filter by category (e.g. faith, greetings, worship, family)' },
      { name: 'pos', type: 'query', defaultValue: '', description: 'Filter by part of speech (noun, verb, adjective, particle)' },
      { name: 'limit', type: 'query', defaultValue: '10', description: 'Number of results (1-100)' },
      { name: 'page', type: 'query', defaultValue: '1', description: 'Page offset' }
    ]
  },
  {
    id: 'dict-lookup',
    category: 'Trilingual Dictionary & Translation',
    name: 'Word Lookup (Arabic / Amharic / English)',
    method: 'GET',
    path: '/dictionary/lookup/ሰላም',
    description: 'Instantly resolves a headword across any of the three languages (Arabic vocalized or unvocalized, Amharic Ge\'ez, or English).',
    params: [
      { name: 'word', type: 'path', required: true, defaultValue: 'ሰላም', description: 'Word to look up (e.g. ሰላም, سَلَام, سلام, peace, mercy)' },
      { name: 'lang', type: 'query', defaultValue: 'all', description: 'Output language filter (all, ar, am, en)' }
    ]
  },
  {
    id: 'dict-search',
    category: 'Trilingual Dictionary & Translation',
    name: 'Trilingual Search (Diacritic-Tolerant)',
    method: 'GET',
    path: '/dictionary/search',
    description: 'Fuzzy and diacritic-insensitive multi-field search across Arabic roots/clean words, Amharic translations, English definitions, and phonetic transliterations.',
    params: [
      { name: 'q', type: 'query', required: true, defaultValue: 'رحمة', description: 'Search query in Arabic, Amharic, or English' },
      { name: 'lang', type: 'query', defaultValue: 'all', description: 'Output language filter (all, ar, am, en)' }
    ]
  },
  {
    id: 'dict-daily',
    category: 'Trilingual Dictionary & Translation',
    name: 'Daily Word of the Day',
    method: 'GET',
    path: '/dictionary/daily',
    description: 'Deterministic daily vocabulary selection with Arabic, Amharic, and English definitions for spiritual vocabulary building.',
    params: [
      { name: 'lang', type: 'query', defaultValue: 'all', description: 'Output language filter (all, ar, am, en)' }
    ]
  },
  {
    id: 'dict-random',
    category: 'Trilingual Dictionary & Translation',
    name: 'Random Vocabulary Word',
    method: 'GET',
    path: '/dictionary/random',
    description: 'Retrieves a random trilingual vocabulary entry with full etymology and contextual examples.',
    params: [
      { name: 'lang', type: 'query', defaultValue: 'all', description: 'Output language filter (all, ar, am, en)' }
    ]
  },
  {
    id: 'dict-autocomplete',
    category: 'Trilingual Dictionary & Translation',
    name: 'Typeahead Autocomplete',
    method: 'GET',
    path: '/dictionary/autocomplete',
    description: 'Fast prefix suggestions for interactive search bars supporting Arabic, Ge\'ez (Amharic), and Latin (English) inputs.',
    params: [
      { name: 'q', type: 'query', required: true, defaultValue: 'peac', description: 'Prefix text to autocomplete' },
      { name: 'limit', type: 'query', defaultValue: '8', description: 'Max suggestions (1-20)' }
    ]
  },
  {
    id: 'dict-categories',
    category: 'Trilingual Dictionary & Translation',
    name: 'List Semantic Categories',
    method: 'GET',
    path: '/dictionary/categories',
    description: 'Returns all thematic category classifications (faith, worship, greetings, ethics, family, etc.) and word counts.'
  },
  {
    id: 'dict-pos',
    category: 'Trilingual Dictionary & Translation',
    name: 'List Parts of Speech',
    method: 'GET',
    path: '/dictionary/parts-of-speech',
    description: 'Returns available grammatical part-of-speech categories and frequencies (noun, verb, adjective, particle, phrase).'
  },
  {
    id: 'translation-translate',
    category: 'Trilingual Dictionary & Translation',
    name: 'Translate (Arabic / Amharic / English)',
    method: 'POST',
    path: '/translation/translate',
    description: 'Translates sentences or terms between Arabic, Amharic, and English. Features automatic script detection, dual lexicon and Gemini AI neural translation fallback.',
    sampleBody: {
      text: 'السلام عليكم ورحمة الله وبركاته',
      sourceLang: 'ar',
      targetLang: 'am'
    }
  },
  {
    id: 'translation-detect',
    category: 'Trilingual Dictionary & Translation',
    name: 'Detect Language & Script',
    method: 'POST',
    path: '/translation/detect',
    description: 'Identifies whether text is written in Arabic (Arabic script), Amharic (Ethiopic Ge\'ez script), or English (Latin script) with confidence scores.',
    sampleBody: {
      text: 'አላህ ይርዳን እና ይጠብቀን'
    }
  },
  {
    id: 'translation-pairs',
    category: 'Trilingual Dictionary & Translation',
    name: 'Get Supported Translation Pairs',
    method: 'GET',
    path: '/translation/pairs',
    description: 'Returns all 6 supported bidirectional language translation pairs and engine capabilities.'
  },
  // 0. Asmaul Husna (The 99 Beautiful Names of Allah)
  {
    id: 'asmaul-husna-all',
    category: 'Asmaul Husna (99 Names)',
    name: 'Get All 99 Names (Multilingual)',
    method: 'GET',
    path: '/asmaul-husna',
    description: 'Retrieves all 99 Names of Allah with Arabic calligraphy, transliteration, English, Amharic, and Arabic translations, theological explanations, and Quranic/Hadith citations.',
    params: [
      { name: 'lang', type: 'query', defaultValue: 'all', description: 'Language localization: all, en, am (አማርኛ), or ar (العربية)' },
      { name: 'limit', type: 'query', defaultValue: '10', description: 'Items per page (e.g. 10, or empty for all 99)' }
    ]
  },
  {
    id: 'asmaul-husna-amharic',
    category: 'Asmaul Husna (99 Names)',
    name: '99 Names in Amharic (አማርኛ)',
    method: 'GET',
    path: '/asmaul-husna?lang=am',
    description: 'Retrieves the Names of Allah localized in Amharic (Ge\'ez script) translations and theological descriptions.'
  },
  {
    id: 'asmaul-husna-by-id',
    category: 'Asmaul Husna (99 Names)',
    name: 'Lookup Name by Number or Arabic',
    method: 'GET',
    path: '/asmaul-husna/1',
    description: 'Fetches a specific Name of Allah using canonical number (1 to 99), Arabic script (e.g. الرحمن), or transliteration (e.g. Ar-Rahman).',
    params: [
      { name: 'identifier', type: 'path', required: true, defaultValue: '1', description: 'Number 1-99, Arabic name, or transliteration' },
      { name: 'lang', type: 'query', defaultValue: 'am', description: 'Language localization: all, en, am, ar' }
    ]
  },
  {
    id: 'asmaul-husna-daily',
    category: 'Asmaul Husna (99 Names)',
    name: 'Daily Name of Allah (Contemplation)',
    method: 'GET',
    path: '/asmaul-husna/daily',
    description: 'Deterministic Name of the Day for contemplation and digital home screen widgets.',
    params: [
      { name: 'lang', type: 'query', defaultValue: 'en', description: 'Language: all, en, am, ar' }
    ]
  },
  {
    id: 'asmaul-husna-random',
    category: 'Asmaul Husna (99 Names)',
    name: 'Random Name of Allah',
    method: 'GET',
    path: '/asmaul-husna/random',
    description: 'Returns a random Name of Allah with theological commentary and Quran/Hadith references.',
    params: [
      { name: 'lang', type: 'query', defaultValue: 'all', description: 'Language: all, en, am, ar' }
    ]
  },
  {
    id: 'asmaul-husna-search',
    category: 'Asmaul Husna (99 Names)',
    name: 'Trilingual Search (Arabic / Amharic / English)',
    method: 'GET',
    path: '/asmaul-husna/search',
    description: 'Diacritic-tolerant multi-field search across Arabic, Amharic Ge\'ez meanings, and English definitions.',
    params: [
      { name: 'q', type: 'query', required: true, defaultValue: 'ንጉሥ', description: 'Search term in Amharic (e.g. ንጉሥ, ሩኅሩህ), Arabic (e.g. رحيم), or English (e.g. King, Peace)' },
      { name: 'lang', type: 'query', defaultValue: 'am', description: 'Response language localization' }
    ]
  },
  {
    id: 'asmaul-husna-stats',
    category: 'Asmaul Husna (99 Names)',
    name: 'Dataset Verification & Metrics',
    method: 'GET',
    path: '/asmaul-husna/stats',
    description: 'Dataset statistics: 99 verified names, 100% reference coverage, language matrix, and Hadith sources.'
  },

  // 1. Firebase & Cloud Firestore
  {
    id: 'firebase-config',
    category: 'Firebase & Firestore',
    name: 'Get Firebase Public Config',
    method: 'GET',
    path: '/api/firebase/config',
    description: 'Retrieves public Firebase client configuration including Project ID and Firestore Database ID.'
  },
  {
    id: 'firebase-health',
    category: 'Firebase & Firestore',
    name: 'Check Firestore Health',
    method: 'GET',
    path: '/api/firebase/health',
    description: 'Verifies live connectivity to Google Cloud Firestore database.'
  },
  {
    id: 'firebase-sync-user',
    category: 'Firebase & Firestore',
    name: 'Sync User to Firestore',
    method: 'POST',
    path: '/api/firebase/sync-user',
    description: 'Syncs profile metadata to Firestore users/{userId} collection.',
    requiresAuth: true,
    sampleBody: {
      displayName: 'Abdullah'
    }
  },
  {
    id: 'firebase-get-prayer-logs',
    category: 'Firebase & Firestore',
    name: 'Get Firestore Prayer Logs',
    method: 'GET',
    path: '/api/firebase/prayer-logs',
    description: 'Fetches real-time persisted prayer tracking logs from Firestore.',
    requiresAuth: true
  },
  {
    id: 'firebase-save-prayer-log',
    category: 'Firebase & Firestore',
    name: 'Save Prayer Log to Firestore',
    method: 'POST',
    path: '/api/firebase/prayer-logs',
    description: 'Stores an individual prayer completion log in Cloud Firestore.',
    requiresAuth: true,
    sampleBody: {
      date: '2026-09-12',
      prayerName: 'fajr',
      status: true,
      prayedAs: 'jamaah'
    }
  },

  // 2. Prayers & Timings
  {
    id: 'prayers-today',
    category: 'Prayers & Timings',
    name: "Get Today's Timings",
    method: 'GET',
    path: '/api/prayers/today',
    description: "Computes today's prayer schedule based on coordinates or defaults.",
    params: [
      { name: 'latitude', type: 'query', required: false, defaultValue: '21.4225', description: 'Latitude coordinate' },
      { name: 'longitude', type: 'query', required: false, defaultValue: '39.8262', description: 'Longitude coordinate' },
      { name: 'method', type: 'query', required: false, defaultValue: 'MWL', description: 'Calculation authority', options: ['MWL', 'ISNA', 'EGYPT', 'MAKKAH', 'KARACHI', 'TEHRAN', 'JAFARI'] }
    ]
  },
  {
    id: 'prayers-times',
    category: 'Prayers & Timings',
    name: 'Calculate Prayer Times for Date',
    method: 'GET',
    path: '/api/prayers/times',
    description: 'Calculates high-precision astronomical prayer timings for any calendar date.',
    params: [
      { name: 'date', type: 'query', required: false, defaultValue: '2026-09-12', description: 'Date (YYYY-MM-DD)' },
      { name: 'latitude', type: 'query', required: false, defaultValue: '51.5074', description: 'Latitude' },
      { name: 'longitude', type: 'query', required: false, defaultValue: '-0.1278', description: 'Longitude' },
      { name: 'method', type: 'query', required: false, defaultValue: 'MWL', description: 'Calculation method' }
    ]
  },
  {
    id: 'prayers-methods',
    category: 'Prayers & Timings',
    name: 'List Calculation Methods',
    method: 'GET',
    path: '/api/prayers/methods',
    description: 'Retrieves all available astronomical calculation methodologies.'
  },

  // 3. Quran & Tafsir
  {
    id: 'quran-surahs',
    category: 'Quran & Tafsir',
    name: 'List All 114 Surahs',
    method: 'GET',
    path: '/api/quran/surahs',
    description: 'Fetches metadata for all 114 Surahs including English/Arabic names, revelation place, and ayah counts.'
  },
  {
    id: 'quran-surah-detail',
    category: 'Quran & Tafsir',
    name: 'Get Surah Details & Ayahs',
    method: 'GET',
    path: '/api/quran/surah/{number}',
    description: 'Retrieves complete Surah with Arabic text and English translation.',
    params: [
      { name: 'number', type: 'path', required: true, defaultValue: '1', description: 'Surah Number (1-114)' }
    ]
  },
  {
    id: 'quran-ayah',
    category: 'Quran & Tafsir',
    name: 'Get Single Ayah',
    method: 'GET',
    path: '/api/quran/ayah/{surah}/{ayah}',
    description: 'Returns specific Ayah with recitation details and translation.',
    params: [
      { name: 'surah', type: 'path', required: true, defaultValue: '1', description: 'Surah Number (1-114)' },
      { name: 'ayah', type: 'path', required: true, defaultValue: '1', description: 'Ayah Number' }
    ]
  },
  {
    id: 'quran-search',
    category: 'Quran & Tafsir',
    name: 'Search Holy Quran',
    method: 'GET',
    path: '/api/quran/search',
    description: 'Full-text search across Quranic verses and translations.',
    params: [
      { name: 'q', type: 'query', required: true, defaultValue: 'mercy', description: 'Search term or keyword' }
    ]
  },
  {
    id: 'quran-tafsir',
    category: 'Quran & Tafsir',
    name: 'Get Ayah Tafsir',
    method: 'GET',
    path: '/api/quran/tafsir/{surah}/{ayah}',
    description: 'Returns classical Tafsir exegesis for a specific Ayah.',
    params: [
      { name: 'surah', type: 'path', required: true, defaultValue: '1', description: 'Surah Number' },
      { name: 'ayah', type: 'path', required: true, defaultValue: '1', description: 'Ayah Number' }
    ]
  },

  // 4. Hadith Collections
  {
    id: 'hadith-books',
    category: 'Hadith Collections',
    name: 'List Hadith Collections',
    method: 'GET',
    path: '/api/hadith/books',
    description: 'Lists canonical collections (Bukhari, Muslim, Abu Dawood, etc.).'
  },
  {
    id: 'hadith-daily',
    category: 'Hadith Collections',
    name: 'Get Daily Hadith',
    method: 'GET',
    path: '/api/hadith/daily',
    description: 'Fetches deterministic Daily Hadith with English translation and reference.'
  },
  {
    id: 'hadith-search',
    category: 'Hadith Collections',
    name: 'Search Hadith Corpus',
    method: 'GET',
    path: '/api/hadith/search',
    description: 'Performs semantic search across the Hadith database.',
    params: [
      { name: 'q', type: 'query', required: true, defaultValue: 'salam', description: 'Keyword to search' }
    ]
  },

  // 5. Duas & Azkar
  {
    id: 'duas-categories',
    category: 'Duas & Azkar',
    name: 'List Dua Categories',
    method: 'GET',
    path: '/api/duas/categories',
    description: 'Retrieves categorized Duas (Morning/Evening, Protection, Forgiveness, etc.).'
  },
  {
    id: 'duas-daily',
    category: 'Duas & Azkar',
    name: 'Get Daily Dua',
    method: 'GET',
    path: '/api/duas/daily',
    description: 'Returns featured Dua for today with Arabic, transliteration, and translation.'
  },
  {
    id: 'duas-search',
    category: 'Duas & Azkar',
    name: 'Search Duas',
    method: 'GET',
    path: '/api/duas/search',
    description: 'Searches supplications by keyword.',
    params: [
      { name: 'q', type: 'query', required: true, defaultValue: 'forgiveness', description: 'Search term' }
    ]
  },

  // 6. Calendar & Conversions
  {
    id: 'calendar-convert',
    category: 'Calendar & Conversions',
    name: 'Convert Calendar Systems',
    method: 'GET',
    path: '/api/calendar/convert',
    description: 'Converts date between Gregorian, Islamic Hijri, and Ethiopian calendar systems.',
    params: [
      { name: 'date', type: 'query', required: true, defaultValue: '2026-09-12', description: 'Date to convert' },
      { name: 'from', type: 'query', required: true, defaultValue: 'gregorian', description: 'Source system', options: ['gregorian', 'hijri', 'ethiopian'] },
      { name: 'to', type: 'query', required: true, defaultValue: 'hijri', description: 'Target system', options: ['gregorian', 'hijri', 'ethiopian'] }
    ]
  },
  {
    id: 'calendar-holidays',
    category: 'Calendar & Conversions',
    name: 'Get Islamic & National Holidays',
    method: 'GET',
    path: '/api/calendar/holidays/{year}',
    description: 'Retrieves calendar holidays and sacred Islamic dates for a specific year.',
    params: [
      { name: 'year', type: 'path', required: true, defaultValue: '2026', description: 'Year (YYYY)' }
    ]
  },

  // 7. Fasting Tracker
  {
    id: 'fasting-today',
    category: 'Fasting Tracker',
    name: "Get Today's Fasting Status",
    method: 'GET',
    path: '/api/fasting/today',
    description: 'Checks fasting progress, Suhoor, and Iftar timings for today.'
  },

  // 8. Spiritual Journal
  {
    id: 'journal-entries',
    category: 'Spiritual Journal',
    name: 'Get Journal Entries',
    method: 'GET',
    path: '/api/journal/entries',
    description: 'Retrieves reflections and daily spiritual notes.',
    requiresAuth: true
  },

  // 9. Social & Community
  {
    id: 'social-challenges',
    category: 'Social & Challenges',
    name: 'List Community Challenges',
    method: 'GET',
    path: '/api/social/challenges',
    description: 'Returns active community habit challenges (Quran completion, 40-day Fajr, etc.).'
  },

  // 10. Analytics & Streaks
  {
    id: 'analytics-summary',
    category: 'Analytics & Streaks',
    name: 'Get User Habit Summary',
    method: 'GET',
    path: '/api/analytics/summary/{username}',
    description: 'Aggregates completed prayers, reading streaks, and fasting count.',
    params: [
      { name: 'username', type: 'path', required: true, defaultValue: 'demo_user', description: 'User identifier' }
    ]
  },

  // 11. Search & System
  {
    id: 'search-global',
    category: 'Search & System',
    name: 'Global Unified Search',
    method: 'GET',
    path: '/api/search/global',
    description: 'Searches simultaneously across Quran, Hadith, Duas, and Islamic Wisdom.',
    params: [
      { name: 'q', type: 'query', required: true, defaultValue: 'patience', description: 'Search term' }
    ]
  },
  {
    id: 'system-health',
    category: 'Search & System',
    name: 'System Health Check',
    method: 'GET',
    path: '/health',
    description: 'Verifies server status, uptime, and database connections.'
  },
  {
    id: 'system-root',
    category: 'Search & System',
    name: 'Server Metadata & Discovery',
    method: 'GET',
    path: '/',
    description: 'Returns API server name, version, and catalog of mounted endpoint routes.'
  },
  // 13. Qamus Quranic Lexicon (Fusha)
  {
    id: 'qamus-info',
    category: 'Qamus Quranic Lexicon',
    name: 'Qamus Overview & Statistics',
    method: 'GET',
    path: '/qamus',
    description: 'Returns summary statistics (2,092 entries, 1,091 roots, 7,700 Ayah occurrences) and catalog of endpoints.'
  },
  {
    id: 'qamus-entries',
    category: 'Qamus Quranic Lexicon',
    name: 'List Lexicon Entries (Paginated)',
    method: 'GET',
    path: '/qamus/entries',
    description: 'Browse entries with pagination and optional filters by section (verb, noun, particle), category, or root.',
    params: [
      { name: 'page', type: 'query', required: false, defaultValue: '1', description: 'Page number' },
      { name: 'limit', type: 'query', required: false, defaultValue: '10', description: 'Page limit' },
      { name: 'section', type: 'query', required: false, defaultValue: '', description: 'Section: verb, noun, or particle' }
    ]
  },
  {
    id: 'qamus-search',
    category: 'Qamus Quranic Lexicon',
    name: 'Search Quranic Lexicon',
    method: 'GET',
    path: '/qamus/search',
    description: 'Search across Arabic headwords, roots, transliterations, and meanings with diacritic-tolerant normalization.',
    params: [
      { name: 'q', type: 'query', required: true, defaultValue: 'رحم', description: 'Search keyword (e.g. رحم, كتب, mercy)' }
    ]
  },
  {
    id: 'qamus-ayah',
    category: 'Qamus Quranic Lexicon',
    name: 'Lookup Ayah Vocabulary',
    method: 'GET',
    path: '/qamus/ayah/1:1',
    description: 'Retrieves all certified vocabulary entries, transliterations, and grammatical senses occurring in a given Ayah.',
    params: [
      { name: 'ref', type: 'path', required: true, defaultValue: '1:1', description: 'Surah:Ayah reference (e.g. 1:1, 9:69)' }
    ]
  },
  {
    id: 'qamus-roots',
    category: 'Qamus Quranic Lexicon',
    name: 'List Quranic Roots',
    method: 'GET',
    path: '/qamus/roots',
    description: 'List all 1,091 distinct Quranic Arabic triliteral and quadrilateral roots with sample words and entry counts.',
    params: [
      { name: 'page', type: 'query', required: false, defaultValue: '1', description: 'Page number' },
      { name: 'limit', type: 'query', required: false, defaultValue: '15', description: 'Number of roots' }
    ]
  },
  {
    id: 'qamus-root-entries',
    category: 'Qamus Quranic Lexicon',
    name: 'Get Vocabulary by Root',
    method: 'GET',
    path: '/qamus/roots/ر%20ح%20م',
    description: 'Retrieves all verbal and nominal entries stemming from an Arabic root.',
    params: [
      { name: 'root', type: 'path', required: true, defaultValue: 'ر ح م', description: 'Arabic root with or without spaces' }
    ]
  },
  {
    id: 'qamus-sections',
    category: 'Qamus Quranic Lexicon',
    name: 'Get Section Breakdowns',
    method: 'GET',
    path: '/qamus/sections',
    description: 'Returns entry counts and total Quranic occurrences across Verbs, Nouns, and Particles.'
  },
  {
    id: 'qamus-categories',
    category: 'Qamus Quranic Lexicon',
    name: 'List Semantic Categories',
    method: 'GET',
    path: '/qamus/categories',
    description: 'Returns all 55 semantic and thematic categories in the Quranic lexicon.'
  },
  {
    id: 'qamus-daily',
    category: 'Qamus Quranic Lexicon',
    name: 'Daily Quranic Word',
    method: 'GET',
    path: '/qamus/daily',
    description: 'Fetches the deterministic Quranic word of the day with root analysis and example Ayah transclusion.'
  },
  {
    id: 'qamus-random',
    category: 'Qamus Quranic Lexicon',
    name: 'Random Lexicon Word',
    method: 'GET',
    path: '/qamus/random',
    description: 'Retrieves a random certified Quranic vocabulary entry.'
  },
  {
    id: 'qamus-grammar-classes',
    category: 'Qamus Quranic Lexicon',
    name: 'Quranic Grammar (QG) Classes',
    method: 'GET',
    path: '/qamus/grammar-classes',
    description: 'Returns grammatical part-of-speech ontology, semantic roles, and light/dark color hexes.'
  }
];
