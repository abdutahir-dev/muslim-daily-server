/**
 * Bulk Hadith Import Script
 * Fetches Arabic + English editions for the 5 major hadith books
 * from the fawazahmed0/hadith-api CDN and inserts them into hadith.sqlite
 *
 * Usage:
 *   cd muslim-daily-server-v2
 *   node import-hadiths.cjs
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const https = require('https');

const DB_PATH = path.join(__dirname, 'db', 'hadith.sqlite');
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

// 5 major books: (slug, englishEdition, arabicEdition, displayName, arabicName)
const BOOKS = [
    { slug: 'bukhari', en: 'eng-bukhari', ar: 'ara-bukhari', name_en: 'Sahih al-Bukhari', name_ar: 'صحيح البخاري' },
    { slug: 'muslim', en: 'eng-muslim', ar: 'ara-muslim', name_en: 'Sahih Muslim', name_ar: 'صحيح مسلم' },
    { slug: 'abudawud', en: 'eng-abudawud', ar: 'ara-abudawud', name_en: 'Sunan Abu Dawud', name_ar: 'سنن أبي داود' },
    { slug: 'tirmidhi', en: 'eng-tirmidhi', ar: 'ara-tirmidhi', name_en: "Jami' at-Tirmidhi", name_ar: 'جامع الترمذي' },
    { slug: 'ibnmajah', en: 'eng-ibnmajah', ar: 'ara-ibnmajah', name_en: 'Sunan Ibn Majah', name_ar: 'سنن ابن ماجه' },
];

function fetch(url) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        https.get(url, (res) => {
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

// Extract hadiths array from an edition json (handles { hadiths: [...] } and section-based structures)
function extractHadiths(data) {
    if (Array.isArray(data.hadiths)) return data.hadiths;
    if (data.sections) {
        const out = [];
        for (const section of Object.values(data.sections)) {
            if (Array.isArray(section.hadiths)) section.hadiths.forEach(h => out.push(h));
        }
        return out;
    }
    return [];
}

async function main() {
    const db = new sqlite3.Database(DB_PATH);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT UNIQUE,
    name_ar TEXT,
    slug TEXT UNIQUE
  )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS hadiths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    hadith_number TEXT,
    text_ar TEXT,
    text_en TEXT,
    grade TEXT,
    source TEXT,
    FOREIGN KEY(book_id) REFERENCES books(id)
  )`);

    await runAsync(db, `CREATE INDEX IF NOT EXISTS idx_hadiths_text_en ON hadiths(text_en)`);
    await runAsync(db, `DELETE FROM hadiths`);
    await runAsync(db, `DELETE FROM books`);

    for (const book of BOOKS) {
        console.log(`\n📖 Processing: ${book.name_en}`);

        // Insert book
        const bookId = await new Promise((resolve, reject) => {
            db.run(
                `INSERT OR IGNORE INTO books (name_en, name_ar, slug) VALUES (?, ?, ?)`,
                [book.name_en, book.name_ar, book.slug],
                function (err) { err ? reject(err) : resolve(this.lastID); }
            );
        });

        const resolvedBookId = bookId || await getAsync(db, 'SELECT id FROM books WHERE slug = ?', [book.slug]).then(r => r.id);

        // Fetch Arabic and English editions
        let arData, enData;
        try {
            console.log(`  Fetching Arabic (${book.ar})...`);
            arData = await fetch(`${CDN_BASE}/${book.ar}.min.json`);
        } catch (e) {
            console.warn(`  ⚠️  Arabic edition failed: ${e.message}`);
        }
        try {
            console.log(`  Fetching English (${book.en})...`);
            enData = await fetch(`${CDN_BASE}/${book.en}.min.json`);
        } catch (e) {
            console.warn(`  ⚠️  English edition failed: ${e.message}`);
        }

        const arHadiths = arData ? extractHadiths(arData) : [];
        const enHadiths = enData ? extractHadiths(enData) : [];

        // Build lookup map by hadith number for Arabic
        const arMap = {};
        for (const h of arHadiths) {
            const num = h.hadithnumber != null ? String(h.hadithnumber) : null;
            if (num) arMap[num] = h;
        }

        // Use English as the primary, merge Arabic
        const primaryList = enHadiths.length > 0 ? enHadiths : arHadiths;

        console.log(`  Inserting ${primaryList.length} hadiths...`);

        await runAsync(db, 'BEGIN TRANSACTION');
        const stmt = db.prepare(
            `INSERT INTO hadiths (book_id, hadith_number, text_ar, text_en, grade, source) VALUES (?, ?, ?, ?, ?, ?)`
        );

        for (const h of primaryList) {
            const num = h.hadithnumber != null ? String(h.hadithnumber) : null;
            const textEn = typeof h.text === 'string' ? h.text.trim() : null;
            const textAr = arMap[num] ? (typeof arMap[num].text === 'string' ? arMap[num].text.trim() : null) : null;
            const grade = h.grade || null;
            stmt.run([resolvedBookId, num, textAr, textEn, grade, book.name_en]);
        }

        stmt.finalize();
        await runAsync(db, 'COMMIT');
        console.log(`  ✅ ${book.name_en}: ${primaryList.length} hadiths inserted`);
    }

    db.close();
    console.log('\n🎉 Bulk import complete!');
}

function runAsync(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, err => err ? reject(err) : resolve());
    });
}

function getAsync(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });
}

main().catch(err => {
    console.error('\n❌ Import failed:', err.message);
    process.exit(1);
});
