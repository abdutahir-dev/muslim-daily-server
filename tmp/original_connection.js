import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');

export let quotesDb;
export let deenbotDb;
export let quranDb;
export let prayersDb;
export let duaDb;
export let hadithDb;

export async function initDatabases() {
  quotesDb = await open({
    filename: path.join(rootDir, 'db', 'muslimdaily.sqlite'),
    driver: sqlite3.Database
  });

  deenbotDb = await open({
    filename: path.join(rootDir, 'db', 'deenbot.sqlite'),
    driver: sqlite3.Database
  });

  quranDb = await open({
    filename: path.join(rootDir, 'db', 'muslimdaily.sqlite'),
    driver: sqlite3.Database
  });

  prayersDb = await open({
    filename: path.join(rootDir, 'db', 'muslimdaily.sqlite'),
    driver: sqlite3.Database
  });

  duaDb = await open({
    filename: path.join(rootDir, 'db', 'muslimdaily.sqlite'),
    driver: sqlite3.Database
  });

  hadithDb = await open({
    filename: path.join(rootDir, 'db', 'muslimdaily.sqlite'),
    driver: sqlite3.Database
  });

  // Ensure tables exist
  await prayersDb.exec(`
    CREATE TABLE IF NOT EXISTS prayer_timings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      city TEXT,
      country TEXT,
      method INTEGER,
      fajr TEXT,
      sunrise TEXT,
      dhuhr TEXT,
      asr TEXT,
      maghrib TEXT,
      isha TEXT,
      UNIQUE(date, city, country, method)
    );
  `);

  await deenbotDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      settings TEXT DEFAULT '{}',
      bookmarks TEXT DEFAULT '[]',
      favorites TEXT DEFAULT '[]'
    );

    -- calendar/holiday tables
    CREATE TABLE IF NOT EXISTS calendar_systems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      epoch_offset INTEGER DEFAULT 0,
      type TEXT DEFAULT 'tabular'
    );
    -- seed basic systems if empty
    INSERT OR IGNORE INTO calendar_systems(name,description,type) VALUES
      ('gregorian','Standard solar calendar','tabular'),
      ('hijri','Islamic calendar, tabular default','tabular'),
      ('ethiopian','Ethiopian calendar','tabular');

    CREATE TABLE IF NOT EXISTS holidays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      system_id INTEGER REFERENCES calendar_systems(id),
      country_code CHAR(2) NOT NULL,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      movable INTEGER DEFAULT 0,
      rule TEXT,
      is_official INTEGER DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_holidays_country_date ON holidays(country_code, date);

    CREATE TABLE IF NOT EXISTS calendars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      name TEXT,
      system_id INTEGER REFERENCES calendar_systems(id),
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      calendar_id INTEGER REFERENCES calendars(id),
      title TEXT,
      start_ts TEXT,
      end_ts TEXT,
      description TEXT,
      location TEXT,
      recurrence_rule TEXT,
      priority INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_events_calendar_start ON events(calendar_id, start_ts);

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      title TEXT,
      content TEXT,
      create_ts TEXT DEFAULT (datetime('now')),
      update_ts TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      description TEXT NOT NULL,
      due_ts TEXT,
      completed INTEGER DEFAULT 0,
      recurrence_rule TEXT,
      priority INTEGER DEFAULT 0,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      entity_type TEXT,
      entity_id INTEGER,
      operation TEXT,
      payload TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT,
      details TEXT,
      ts TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_information (
    user_id INTEGER NOT NULL,
    firstname TEXT ,
    lastname TEXT,
    nickname TEXT,

    gender INTEGER DEFAULT 0 CHECK (gender IN (0,1,2)),
    -- 0 = unknown, 1 = male, 2 = female

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `); // close exec call properly

  // Migration: Add role column if it doesn't exist
  try {
    await deenbotDb.exec('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"');
  } catch (e) {
    // Column might already exist
  }

  await deenbotDb.exec(`
    CREATE TABLE IF NOT EXISTS prayer_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      date TEXT,
      prayer_name TEXT,
      status INTEGER DEFAULT 0,
      prayed_as TEXT,
      prayer_type TEXT DEFAULT 'fard',
      UNIQUE(username, date, prayer_name, prayer_type),
      FOREIGN KEY(username) REFERENCES users(username)
    );
  `);

  // interactions tracking (extended analytics)
  await deenbotDb.exec(`
    CREATE TABLE IF NOT EXISTS user_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      type TEXT,
      value TEXT,
      metadata TEXT,
      timestamp TEXT,
      FOREIGN KEY(username) REFERENCES users(username)
    );
  `);

  // bookmarks table (hadith/dua etc.)
  await deenbotDb.exec(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      item_type TEXT,
      item_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(username, item_type, item_id),
      FOREIGN KEY(username) REFERENCES users(username)
    );
  `);

  // favorites table
  await deenbotDb.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      item_type TEXT,
      item_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(username, item_type, item_id),
      FOREIGN KEY(username) REFERENCES users(username)
    );
  `);

  // daily content overrides stored in user DB for simplicity
  await deenbotDb.exec(`
    CREATE TABLE IF NOT EXISTS daily_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_type TEXT,
      content_id INTEGER,
      date TEXT UNIQUE,
      overridden_by TEXT,
      FOREIGN KEY(overridden_by) REFERENCES users(username)
    );
  `);

  await deenbotDb.exec(`
    CREATE TABLE IF NOT EXISTS community_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT,
      created_by TEXT,
      created_at TEXT,
      FOREIGN KEY(created_by) REFERENCES users(username)
    );

    CREATE TABLE IF NOT EXISTS group_members (
      group_id INTEGER,
      username TEXT,
      joined_at TEXT,
      PRIMARY KEY(group_id, username),
      FOREIGN KEY(group_id) REFERENCES community_groups(id),
      FOREIGN KEY(username) REFERENCES users(username)
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER,
      title TEXT,
      description TEXT,
      type TEXT,
      target_value INTEGER,
      start_date TEXT,
      end_date TEXT,
      created_by TEXT,
      FOREIGN KEY(group_id) REFERENCES community_groups(id),
      FOREIGN KEY(created_by) REFERENCES users(username)
    );

    CREATE TABLE IF NOT EXISTS challenge_participants (
      challenge_id INTEGER,
      username TEXT,
      current_progress INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      updated_at TEXT,
      PRIMARY KEY(challenge_id, username),
      FOREIGN KEY(challenge_id) REFERENCES challenges(id),
      FOREIGN KEY(username) REFERENCES users(username)
    );
  `);

  // Migration: Add new columns to prayer_logs if they don't exist
  try {
    await deenbotDb.exec('ALTER TABLE prayer_logs ADD COLUMN prayed_as TEXT');
  } catch (e) { }
  try {
    await deenbotDb.exec('ALTER TABLE prayer_logs ADD COLUMN prayer_type TEXT DEFAULT "fard"');
  } catch (e) { }

  await quranDb.exec(`
    CREATE TABLE IF NOT EXISTS surahs (
      id INTEGER PRIMARY KEY,
      name_simple TEXT,
      name_arabic TEXT,
      verses_count INTEGER,
      revelation_place TEXT
    );

    CREATE TABLE IF NOT EXISTS ayah_audio (
      surah_number INTEGER,
      verse_number INTEGER,
      reciter TEXT,
      audio_data BLOB,
      PRIMARY KEY(surah_number, verse_number, reciter)
    );
  `);

  // Migration: Add revelation_place column if it doesn't exist
  try {
    await quranDb.exec('ALTER TABLE surahs ADD COLUMN revelation_place TEXT');
  } catch (e) {
    // Column might already exist
  }

  await quranDb.exec(`
    CREATE TABLE IF NOT EXISTS ayahs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surah_number INTEGER,
        verse_number INTEGER,
        text_uthmani TEXT,
        verse_key TEXT UNIQUE,
        FOREIGN KEY(surah_number) REFERENCES surahs(id)
    );

    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      language_name TEXT,
      author_name TEXT
    );

    CREATE TABLE IF NOT EXISTS tafsirs (
      id INTEGER PRIMARY KEY,
      name TEXT,
      language_name TEXT,
      author_name TEXT
    );

    CREATE TABLE IF NOT EXISTS ayah_translations (
        verse_key TEXT,
        translation_id INTEGER,
        text TEXT,
        PRIMARY KEY(verse_key, translation_id),
        FOREIGN KEY(verse_key) REFERENCES ayahs(verse_key),
        FOREIGN KEY(translation_id) REFERENCES translations(id)
    );

    CREATE TABLE IF NOT EXISTS ayah_tafsirs (
        verse_key TEXT,
        tafsir_id INTEGER,
        text TEXT,
        PRIMARY KEY(verse_key, tafsir_id),
        FOREIGN KEY(verse_key) REFERENCES ayahs(verse_key),
        FOREIGN KEY(tafsir_id) REFERENCES tafsirs(id)
    );

    CREATE INDEX IF NOT EXISTS idx_ayahs_surah ON ayahs(surah_number);
    CREATE INDEX IF NOT EXISTS idx_ayahs_key ON ayahs(verse_key);
  `);

  await duaDb.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT UNIQUE,
      name_ar TEXT
    );

    CREATE TABLE IF NOT EXISTS duas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      title_en TEXT,
      title_ar TEXT,
      content_ar TEXT,
      content_en TEXT,
      transliteration TEXT,
      reference TEXT,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    );
  `);

  await hadithDb.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT UNIQUE,
      name_ar TEXT,
      slug TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS hadiths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER,
      hadith_number TEXT,
      text_ar TEXT,
      text_en TEXT,
      grade TEXT,
      source TEXT,
      FOREIGN KEY(book_id) REFERENCES books(id)
    );
    CREATE INDEX IF NOT EXISTS idx_hadiths_text_en ON hadiths(text_en);

    -- override table for daily hadith (if storing here instead of user DB)
    CREATE TABLE IF NOT EXISTS daily_hadith (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL,
      edition_id INTEGER,
      date TEXT UNIQUE,
      overridden_by TEXT,
      FOREIGN KEY(hadith_id) REFERENCES hadiths(id)
    );
  `);

  // Calendar Module Migrations
  const migrations = [
    { table: 'calendars', column: 'is_default', type: 'INTEGER DEFAULT 0' },
    { table: 'calendars', column: 'created_at', type: 'TEXT DEFAULT (datetime(now))' },
    { table: 'calendars', column: 'updated_at', type: 'TEXT DEFAULT (datetime(now))' },

    { table: 'events', column: 'all_day', type: 'INTEGER DEFAULT 0' },
    { table: 'events', column: 'category_id', type: 'INTEGER' },

    { table: 'tasks', column: 'created_at', type: 'TEXT DEFAULT (datetime(now))' },
    { table: 'tasks', column: 'updated_at', type: 'TEXT DEFAULT (datetime(now))' },

    { table: 'notes', column: 'is_pinned', type: 'INTEGER DEFAULT 0' },

    { table: 'sync_logs', column: 'client_id', type: 'TEXT' }
  ];

  for (const m of migrations) {
    try {
      await deenbotDb.exec(`ALTER TABLE ${m.table} ADD COLUMN ${m.column} ${m.type}`);
    } catch (e) {
      // Column might already exist, ignore error
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  console.log('Databases initialized');
  return { quotesDb, deenbotDb, quranDb, prayersDb };
}

export const getDb = async () => {
  if (!deenbotDb) await initDatabases();
  return deenbotDb;
};
