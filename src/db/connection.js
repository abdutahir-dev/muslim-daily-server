import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');
const dbDir = path.join(rootDir, 'db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export let quotesDb;
export let deenbotDb;
export let quranDb;
export let prayersDb;
export let duaDb;
export let hadithDb;
export let qamusDb;

class SqliteWrapper {
  constructor(filePath, SQL) {
    this.filePath = filePath;
    this.SQL = SQL;
    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        this.rawDb = new SQL.Database(fileBuffer);
      } catch (err) {
        console.warn(`[db] Could not load ${filePath}, creating new Database:`, err.message);
        this.rawDb = new SQL.Database();
      }
    } else {
      this.rawDb = new SQL.Database();
    }
  }

  save() {
    try {
      const data = this.rawDb.export();
      fs.writeFileSync(this.filePath, Buffer.from(data));
    } catch (err) {
      // Best effort save
    }
  }

  normalizeParams(params) {
    if (!params) return [];
    if (Array.isArray(params)) return params;
    if (typeof params === 'object') return params;
    return [params];
  }

  exec(sql) {
    this.rawDb.run(sql);
    this.save();
    return Promise.resolve();
  }

  run(sql, ...args) {
    const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    const normalized = this.normalizeParams(params);
    this.rawDb.run(sql, normalized);
    const changes = this.rawDb.getRowsModified();
    let lastID = null;
    try {
      const res = this.rawDb.exec('SELECT last_insert_rowid() AS id');
      if (res && res[0] && res[0].values && res[0].values[0]) {
        lastID = res[0].values[0][0];
      }
    } catch (e) { }
    this.save();
    return Promise.resolve({ lastID, lastInsertRowid: lastID, changes });
  }

  get(sql, ...args) {
    const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    const normalized = this.normalizeParams(params);
    const stmt = this.rawDb.prepare(sql);
    try {
      stmt.bind(normalized);
      if (stmt.step()) {
        return Promise.resolve(stmt.getAsObject());
      }
      return Promise.resolve(undefined);
    } finally {
      stmt.free();
    }
  }

  all(sql, ...args) {
    const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    const normalized = this.normalizeParams(params);
    const stmt = this.rawDb.prepare(sql);
    const rows = [];
    try {
      stmt.bind(normalized);
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      return Promise.resolve(rows);
    } finally {
      stmt.free();
    }
  }

  prepare(sql) {
    const self = this;
    const statement = {
      run: (...params) => self.run(sql, ...params),
      get: (...params) => self.get(sql, ...params),
      all: (...params) => self.all(sql, ...params),
      finalize: () => Promise.resolve(),
      then: (resolve) => resolve(statement)
    };
    return statement;
  }
}

let isInitialized = false;

export async function initDatabases() {
  if (isInitialized && deenbotDb && qamusDb) {
    return { quotesDb, deenbotDb, quranDb, prayersDb, duaDb, hadithDb, qamusDb };
  }

  const SQL = await initSqlJs();

  deenbotDb = new SqliteWrapper(path.join(dbDir, 'deenbot.sqlite'), SQL);
  prayersDb = new SqliteWrapper(path.join(dbDir, 'prayers.sqlite'), SQL);
  quranDb = new SqliteWrapper(path.join(dbDir, 'quran.sqlite'), SQL);
  duaDb = new SqliteWrapper(path.join(dbDir, 'dua.sqlite'), SQL);
  hadithDb = new SqliteWrapper(path.join(dbDir, 'hadith.sqlite'), SQL);
  quotesDb = new SqliteWrapper(path.join(dbDir, 'quotes.sqlite'), SQL);
  qamusDb = new SqliteWrapper(path.join(dbDir, 'qamus.sqlite'), SQL);

  // Setup prayers table
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

  // Setup deenbot tables
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

    CREATE TABLE IF NOT EXISTS calendar_systems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      epoch_offset INTEGER DEFAULT 0,
      type TEXT DEFAULT 'tabular'
    );

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
      color TEXT,
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
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
      all_day INTEGER DEFAULT 0,
      category_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_events_calendar_start ON events(calendar_id, start_ts);

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      title TEXT,
      content TEXT,
      is_pinned INTEGER DEFAULT 0,
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
      category TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sync_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      entity_type TEXT,
      entity_id INTEGER,
      operation TEXT,
      payload TEXT,
      client_id TEXT,
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
      firstname TEXT,
      lastname TEXT,
      nickname TEXT,
      gender INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS prayer_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      date TEXT,
      prayer_name TEXT,
      status INTEGER DEFAULT 0,
      prayed_as TEXT,
      prayer_type TEXT DEFAULT 'fard',
      UNIQUE(username, date, prayer_name, prayer_type)
    );

    CREATE TABLE IF NOT EXISTS user_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      type TEXT,
      value TEXT,
      metadata TEXT,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      item_type TEXT,
      item_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(username, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      item_type TEXT,
      item_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(username, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS daily_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_type TEXT,
      content_id INTEGER,
      date TEXT UNIQUE,
      overridden_by TEXT
    );

    CREATE TABLE IF NOT EXISTS community_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT,
      created_by TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS group_members (
      group_id INTEGER,
      username TEXT,
      joined_at TEXT,
      PRIMARY KEY(group_id, username)
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
      created_by TEXT
    );

    CREATE TABLE IF NOT EXISTS challenge_participants (
      challenge_id INTEGER,
      username TEXT,
      current_progress INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      updated_at TEXT,
      PRIMARY KEY(challenge_id, username)
    );

    CREATE TABLE IF NOT EXISTS fasting_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      date TEXT,
      is_fasting INTEGER DEFAULT 0,
      fasting_type TEXT DEFAULT 'voluntary',
      notes TEXT,
      UNIQUE(username, date)
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      date TEXT,
      notes TEXT,
      mood TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(username, date)
    );
  `);

  // Setup Quran tables
  await quranDb.exec(`
    CREATE TABLE IF NOT EXISTS surahs (
      id INTEGER PRIMARY KEY,
      name_simple TEXT,
      name_arabic TEXT,
      verses_count INTEGER,
      revelation_place TEXT
    );

    CREATE TABLE IF NOT EXISTS ayahs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_number INTEGER,
      verse_number INTEGER,
      text_uthmani TEXT,
      verse_key TEXT UNIQUE
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
      PRIMARY KEY(verse_key, translation_id)
    );

    CREATE TABLE IF NOT EXISTS ayah_tafsirs (
      verse_key TEXT,
      tafsir_id INTEGER,
      text TEXT,
      PRIMARY KEY(verse_key, tafsir_id)
    );

    CREATE TABLE IF NOT EXISTS ayah_audio (
      surah_number INTEGER,
      verse_number INTEGER,
      reciter TEXT,
      audio_data BLOB,
      PRIMARY KEY(surah_number, verse_number, reciter)
    );
  `);

  // Setup Dua tables
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
      reference TEXT
    );
  `);

  // Setup Hadith tables
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
      source TEXT
    );

    CREATE TABLE IF NOT EXISTS daily_hadith (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hadith_id INTEGER NOT NULL,
      edition_id INTEGER,
      date TEXT UNIQUE,
      overridden_by TEXT
    );
  `);

  // Setup Quotes tables
  await quotesDb.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text_ar TEXT,
      text_en TEXT,
      source TEXT,
      topic TEXT
    );
  `);

  // Seed baseline data if empty
  const bookCount = await hadithDb.get('SELECT COUNT(*) as count FROM books');
  if (!bookCount || bookCount.count === 0) {
    await hadithDb.run(`
      INSERT INTO books (id, name_en, name_ar, slug) VALUES 
      (1, 'Sahih al-Bukhari', 'صحيح البخاري', 'bukhari'),
      (2, 'Sahih Muslim', 'صحيح مسلم', 'muslim'),
      (3, 'Sunan an-Nasa\\i', 'سنن النسائي', 'nasai');
    `);
  }

  const hadithCount = await hadithDb.get('SELECT COUNT(*) as count FROM hadiths');
  if (!hadithCount || hadithCount.count === 0) {
    await hadithDb.run(`
      INSERT INTO hadiths (id, book_id, hadith_number, text_ar, text_en, grade, source) VALUES
      (1, 1, '1', 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', 'Actions are judged by motives, so each man will have what he intended.', 'Sahih', 'Sahih Bukhari 1'),
      (2, 1, '2', 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', 'The best among you are those who learn the Quran and teach it.', 'Sahih', 'Sahih Bukhari 5027'),
      (3, 2, '1', 'الدِّينُ النَّصِيحَةُ', 'The religion is sincere advice.', 'Sahih', 'Sahih Muslim 55');
    `);
  }

  const duaCatCount = await duaDb.get('SELECT COUNT(*) as count FROM categories');
  if (!duaCatCount || duaCatCount.count === 0) {
    await duaDb.run(`
      INSERT INTO categories (id, name_en, name_ar) VALUES
      (1, 'Morning & Evening', 'أذكار الصباح والمساء'),
      (2, 'Prayer & Salah', 'أدعية الصلاة'),
      (3, 'Forgiveness & Repentance', 'الاستغفار والتوبة'),
      (4, 'Protection & Health', 'الحفظ والشفاء');
    `);
    await duaDb.run(`
      INSERT INTO duas (id, category_id, title_en, title_ar, content_ar, content_en, transliteration, reference) VALUES
      (1, 1, 'Morning Dhikr', 'أذكار الصباح', 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ', 'We have entered upon morning and sovereignty belongs to Allah, and all praise is for Allah.', 'Asbahna wa-asbahal-mulku lillah wal-hamdu lillah', 'Muslim 2723'),
      (2, 2, 'After Prayer', 'الذكر بعد الصلاة', 'أَسْتَغْفِرُ اللهَ ، أَسْتَغْفِرُ اللهَ ، أَسْتَغْفِرُ اللهَ', 'I ask Allah for forgiveness (three times).', 'Astaghfirullah, Astaghfirullah, Astaghfirullah', 'Muslim 591');
    `);
  }

  const quoteCount = await quotesDb.get('SELECT COUNT(*) as count FROM quotes');
  if (!quoteCount || quoteCount.count === 0) {
    await quotesDb.run(`
      INSERT INTO quotes (id, text_ar, text_en, source, topic) VALUES
      (1, 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', 'Indeed, with hardship comes ease.', 'Quran 94:6', 'Patience'),
      (2, 'مَنْ صَمَتَ نَجَا', 'Whoever remains silent has found salvation.', 'Tirmidhi', 'Wisdom'),
      (3, 'رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ', 'The pleasure of the Lord lies in the pleasure of the parents.', 'Tirmidhi', 'Parents');
    `);
  }

  const surahCount = await quranDb.get('SELECT COUNT(*) as count FROM surahs');
  if (!surahCount || surahCount.count === 0) {
    await quranDb.run(`
      INSERT INTO surahs (id, name_simple, name_arabic, verses_count, revelation_place) VALUES
      (1, 'Al-Fatihah', 'الفاتحة', 7, 'makkah'),
      (2, 'Al-Baqarah', 'البقرة', 286, 'madinah'),
      (112, 'Al-Ikhlas', 'الإخلاص', 4, 'makkah'),
      (113, 'Al-Falaq', 'الفلق', 5, 'makkah'),
      (114, 'An-Nas', 'الناس', 6, 'makkah');
    `);
    await quranDb.run(`
      INSERT INTO ayahs (id, surah_number, verse_number, text_uthmani, verse_key) VALUES
      (1, 1, 1, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '1:1'),
      (2, 1, 2, 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', '1:2'),
      (3, 1, 3, 'الرَّحْمَٰنِ الرَّحِيمِ', '1:3'),
      (4, 1, 4, 'مَالِكِ يَوْمِ الدِّينِ', '1:4'),
      (5, 1, 5, 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', '1:5'),
      (6, 1, 6, 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', '1:6'),
      (7, 1, 7, 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', '1:7');
    `);
    await quranDb.run(`
      INSERT INTO translations (id, name, language_name, author_name) VALUES
      (1, 'Sahih International', 'english', 'Sahih International');
    `);
    await quranDb.run(`
      INSERT INTO ayah_translations (verse_key, translation_id, text) VALUES
      ('1:1', 1, 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'),
      ('1:2', 1, '[All] praise is [due] to Allah, Lord of the worlds -'),
      ('1:3', 1, 'The Entirely Merciful, the Especially Merciful,'),
      ('1:4', 1, 'Sovereign of the Day of Recompense.'),
      ('1:5', 1, 'It is You we worship and You we ask for help.'),
      ('1:6', 1, 'Guide us to the straight path -'),
      ('1:7', 1, 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.');
    `);
  }

  // Setup Qamus Quranic Lexicon tables
  await qamusDb.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      headword TEXT,
      translit TEXT,
      root TEXT,
      root_translit TEXT,
      category TEXT,
      section TEXT,
      definition TEXT,
      meaning TEXT,
      senses_json TEXT,
      usage_json TEXT,
      tags_json TEXT,
      total_uses INTEGER,
      source_keys_json TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_entries_root ON entries(root);
    CREATE INDEX IF NOT EXISTS idx_entries_section ON entries(section);
    CREATE INDEX IF NOT EXISTS idx_entries_category ON entries(category);
    CREATE INDEX IF NOT EXISTS idx_entries_headword ON entries(headword);

    CREATE TABLE IF NOT EXISTS ayah_vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id TEXT,
      surah_number INTEGER,
      ayah_number INTEGER,
      ayah_ref TEXT,
      ar_text TEXT,
      en_text TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_ayah_vocab_ref ON ayah_vocabulary(ayah_ref);
    CREATE INDEX IF NOT EXISTS idx_ayah_vocab_surah ON ayah_vocabulary(surah_number, ayah_number);
    CREATE INDEX IF NOT EXISTS idx_ayah_vocab_entry ON ayah_vocabulary(entry_id);
  `);

  const qamusEntryCount = await qamusDb.get('SELECT COUNT(*) as count FROM entries');
  if (!qamusEntryCount || qamusEntryCount.count === 0) {
    const jsonlPath = path.join(rootDir, 'data', 'qamus', 'entries.jsonl');
    if (fs.existsSync(jsonlPath)) {
      try {
        const lines = fs.readFileSync(jsonlPath, 'utf8').split('\n').filter(Boolean);
        await qamusDb.exec('BEGIN TRANSACTION;');
        const entryStmt = qamusDb.prepare('INSERT INTO entries VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        const ayahStmt = qamusDb.prepare('INSERT INTO ayah_vocabulary (entry_id, surah_number, ayah_number, ayah_ref, ar_text, en_text) VALUES (?, ?, ?, ?, ?, ?)');

        for (const line of lines) {
          const e = JSON.parse(line);
          await entryStmt.run([
            e.id,
            e.headword || '',
            e.translit || '',
            e.root || '',
            e.root_translit || '',
            e.category || '',
            e.section || '',
            e.definition || '',
            e.meaning || '',
            JSON.stringify(e.senses || []),
            JSON.stringify(e.usage || []),
            JSON.stringify(e.tags || []),
            e.total_uses || 0,
            JSON.stringify(e.source_keys || [])
          ]);

          if (e.usage && Array.isArray(e.usage)) {
            for (const u of e.usage) {
              if (u.examples && Array.isArray(u.examples)) {
                for (const ex of u.examples) {
                  if (ex.ref) {
                    const parts = ex.ref.split(':');
                    const surah = parseInt(parts[0], 10) || null;
                    const ayah = parseInt(parts[1], 10) || null;
                    await ayahStmt.run([
                      e.id,
                      surah,
                      ayah,
                      ex.ref,
                      ex.ar || '',
                      ex.en || ''
                    ]);
                  }
                }
              }
            }
          }
        }
        await qamusDb.exec('COMMIT;');
        qamusDb.save();
        console.log(`[db] Seeded ${lines.length} Qamus lexicon entries into qamus.sqlite.`);
      } catch (seedErr) {
        console.warn('[db] Failed to seed Qamus database:', seedErr.message);
      }
    }
  }

  isInitialized = true;
  console.log('[db] All 7 databases initialized successfully.');
  return { quotesDb, deenbotDb, quranDb, prayersDb, duaDb, hadithDb, qamusDb };
}

export const getDb = async () => {
  if (!deenbotDb) await initDatabases();
  return deenbotDb;
};
