const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbDir = path.join(__dirname, 'db');
const duaDbPath = path.join(dbDir, 'dua.sqlite');
const hadithDbPath = path.join(dbDir, 'hadith.sqlite');

const duaDb = new sqlite3.Database(duaDbPath);
const hadithDb = new sqlite3.Database(hadithDbPath);

duaDb.serialize(() => {
    duaDb.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT UNIQUE,
      name_ar TEXT
    )`);
    duaDb.run(`CREATE TABLE IF NOT EXISTS duas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      title_en TEXT,
      title_ar TEXT,
      content_ar TEXT,
      content_en TEXT,
      transliteration TEXT,
      reference TEXT,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    )`);

    duaDb.run("INSERT OR IGNORE INTO categories (id, name_en, name_ar) VALUES (1, 'Morning', 'الصباح')");
    duaDb.run("INSERT OR IGNORE INTO categories (id, name_en, name_ar) VALUES (2, 'Evening', 'المساء')");

    duaDb.run(`INSERT OR IGNORE INTO duas (id, category_id, title_en, title_ar, content_ar, content_en, transliteration, reference) 
               VALUES (1, 1, 'Before Sleeping', 'عند النوم', 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي', 'In Your name, my Lord, I lie down...', 'Bismika Rabbi...', 'Sahih Bukhari')`);
});

hadithDb.serialize(() => {
    hadithDb.run(`CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT UNIQUE,
      name_ar TEXT,
      slug TEXT UNIQUE
    )`);
    hadithDb.run(`CREATE TABLE IF NOT EXISTS hadiths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER,
      hadith_number TEXT,
      text_ar TEXT,
      text_en TEXT,
      grade TEXT,
      source TEXT,
      FOREIGN KEY(book_id) REFERENCES books(id)
    )`);

    hadithDb.run("INSERT OR IGNORE INTO books (id, name_en, name_ar, slug) VALUES (1, 'Sahih Bukhari', 'صحيح البخاري', 'bukhari')");

    hadithDb.run(`INSERT OR IGNORE INTO hadiths (id, book_id, hadith_number, text_ar, text_en, grade, source) 
                 VALUES (1, 1, '1', 'إنما الأعمال بالنيات', 'Actions are but by intentions...', 'Sahih', 'Sahih Bukhari')`);
});

console.log('Seeding complete.');
duaDb.close();
hadithDb.close();

// run migration helpers so that azkar and JSON data get imported as part of initial seed
try {
    console.log('Running migrateAzkar.js');
    require('child_process').execSync('node --experimental-modules scripts/migrateAzkar.js', { stdio: 'inherit' });
} catch (e) {
    console.error('migrateAzkar failed', e);
}
try {
    console.log('Running migrateJsonDuas.js');
    require('child_process').execSync('node --experimental-modules scripts/migrateJsonDuas.js', { stdio: 'inherit' });
} catch (e) {
    console.error('migrateJsonDuas failed', e);
}

