import type { ApiEndpoint } from '../types.js';

export const API_CATEGORIES = [
  'All',
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
  'Search & System'
] as const;

export const ENDPOINTS: ApiEndpoint[] = [
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
  }
];
