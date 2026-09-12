import { deenbotDb, quranDb, prayersDb, hadithDb, duaDb } from '../db/connection.js';
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

// Helper to seed basic Quran
async function seedBasicQuran(force = false) {
    const count = await quranDb.get('SELECT COUNT(*) as count FROM ayahs');
    if (count.count === 0 || force) {
        console.log(force ? 'Force Seeding Basic Quran...' : 'Seeding Basic Quran...');
        try {
            const chaptersRes = await fetch('https://api.quran.com/api/v4/chapters', { agent });
            const { chapters } = await chaptersRes.json();

            await quranDb.exec('BEGIN TRANSACTION');
            if (force) {
                await quranDb.run('DELETE FROM ayahs');
                await quranDb.run('DELETE FROM surahs');
            }
            const insertSurah = await quranDb.prepare('INSERT OR REPLACE INTO surahs (id, name_simple, name_arabic, verses_count, revelation_place) VALUES (?, ?, ?, ?, ?)');
            const insertAyah = await quranDb.prepare('INSERT INTO ayahs (surah_number, verse_number, text_uthmani, verse_key) VALUES (?, ?, ?, ?)');

            for (const chapter of chapters) {
                await insertSurah.run(chapter.id, chapter.name_simple, chapter.name_arabic, chapter.verses_count, chapter.revelation_place);
                const ayahCount = await quranDb.get('SELECT COUNT(*) as count FROM ayahs WHERE surah_number = ?', [chapter.id]);
                if (ayahCount.count === 0 || force) {
                    const versesRes = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${chapter.id}`, { agent });
                    const { verses } = await versesRes.json();
                    for (const v of verses) {
                        await insertAyah.run(chapter.id, parseInt(v.verse_key.split(':')[1]), v.text_uthmani, v.verse_key);
                    }
                }
            }
            await insertSurah.finalize();
            await insertAyah.finalize();
            await quranDb.exec('COMMIT');
            console.log('Basic Quran text seeded.');
        } catch (err) {
            await quranDb.exec('ROLLBACK').catch(() => { });
            console.error('Failed to seed basic Quran text:', err);
        }
    }
}

async function seedTranslationMetadata(force = false) {
    const transCount = await quranDb.get('SELECT COUNT(*) as count FROM translations');
    if (transCount.count === 0 || force) {
        console.log('Fetching translations metadata...');
        const res = await fetch('https://api.quran.com/api/v4/resources/translations', { agent });
        const { translations } = await res.json();

        await quranDb.exec('BEGIN TRANSACTION');
        if (force) await quranDb.run('DELETE FROM translations');
        const ins = await quranDb.prepare('INSERT INTO translations (id, name, language_name, author_name) VALUES (?, ?, ?, ?)');
        for (const t of translations) {
            await ins.run(t.id, t.name, t.language_name, t.author_name);
        }
        await ins.finalize();
        await quranDb.exec('COMMIT');
        console.log(`Stored metadata for ${translations.length} translations.`);
    }
}

async function seedTafsirMetadata(force = false) {
    const tafsirCount = await quranDb.get('SELECT COUNT(*) as count FROM tafsirs');
    if (tafsirCount.count === 0 || force) {
        console.log('Fetching tafsirs metadata...');
        const res = await fetch('https://api.quran.com/api/v4/resources/tafsirs', { agent });
        const { tafsirs } = await res.json();

        await quranDb.exec('BEGIN TRANSACTION');
        if (force) await quranDb.run('DELETE FROM tafsirs');
        const ins = await quranDb.prepare('INSERT INTO tafsirs (id, name, language_name, author_name) VALUES (?, ?, ?, ?)');
        for (const t of tafsirs) {
            await ins.run(t.id, t.name, t.language_name, t.author_name);
        }
        await ins.finalize();
        await quranDb.exec('COMMIT');
        console.log(`Stored metadata for ${tafsirs.length} tafsirs.`);
    }
}

async function seedPrayerTimes(city = 'Addis Ababa', country = 'Ethiopia', method = 2, year = new Date().getFullYear(), force = false) {
    try {
        const existing = await prayersDb.get(
            'SELECT COUNT(*) as count FROM prayer_timings WHERE city = ? AND country = ? AND method = ? AND date LIKE ?',
            [city, country, method, `${year}-%`]
        );

        if (existing.count > 0 && !force) return;

        const res = await fetch(`https://api.aladhan.com/v1/calendarByCity/${year}?city=${city}&country=${country}&method=${method}`, { agent });
        const data = await res.json();

        if (data?.data) {
            await prayersDb.exec('BEGIN TRANSACTION');
            if (force) await prayersDb.run('DELETE FROM prayer_timings WHERE city = ? AND country = ? AND method = ? AND date LIKE ?', [city, country, method, `${year}-%`]);
            const ins = await prayersDb.prepare(`
          INSERT INTO prayer_timings (date, city, country, method, fajr, sunrise, dhuhr, asr, maghrib, isha)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
            for (const month of Object.values(data.data)) {
                for (const day of month) {
                    const date = day.date.gregorian.date;
                    const t = day.timings;
                    await ins.run(date, city, country, method, t.Fajr.split(' ')[0], t.Sunrise.split(' ')[0], t.Dhuhr.split(' ')[0], t.Asr.split(' ')[0], t.Maghrib.split(' ')[0], t.Isha.split(' ')[0]);
                }
            }
            await ins.finalize();
            await prayersDb.exec('COMMIT');
        }
    } catch (err) {
        await prayersDb.exec('ROLLBACK').catch(() => { });
    }
}

export const seedData = async (req, res) => {
    const { force = false, types = ['quran', 'translations', 'tafsirs', 'prayers'] } = req.body;
    try {
        const results = {};
        if (types.includes('quran')) {
            await seedBasicQuran(force);
            results.quran = 'seeded';
        }
        if (types.includes('translations')) {
            await seedTranslationMetadata(force);
            results.translations = 'seeded';
        }
        if (types.includes('tafsirs')) {
            await seedTafsirMetadata(force);
            results.tafsirs = 'seeded';
        }
        if (types.includes('prayers')) {
            await seedPrayerTimes('Addis Ababa', 'Ethiopia', 2, new Date().getFullYear(), force);
            results.prayers = 'seeded';
        }
        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ error: 'Seeding failed', message: err.message });
    }
};

export const getStats = async (req, res) => {
    try {
        const userCount = await deenbotDb.get('SELECT COUNT(*) as count FROM users');
        const prayerLogCount = await deenbotDb.get('SELECT COUNT(*) as count FROM prayer_logs');
        const surahCount = await quranDb.get('SELECT COUNT(*) as count FROM surahs');
        const translationCount = await quranDb.get('SELECT COUNT(*) as count FROM translations');
        const tafsirCount = await quranDb.get('SELECT COUNT(*) as count FROM tafsirs');
        const prayerTimingCount = await prayersDb.get('SELECT COUNT(*) as count FROM prayer_timings');
        const hadithCount = await hadithDb.get('SELECT COUNT(*) as count FROM hadiths');
        const duaCount = await duaDb.get('SELECT COUNT(*) as count FROM duas');

        res.json({
            users: userCount.count,
            prayerLogs: prayerLogCount.count,
            surahs: surahCount.count,
            translations: translationCount.count,
            tafsirs: tafsirCount.count,
            prayerTimings: prayerTimingCount.count,
            hadiths: hadithCount.count,
            duas: duaCount.count
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await deenbotDb.all('SELECT id, username, email, role FROM users ORDER BY id DESC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await deenbotDb.get('SELECT username FROM users WHERE id = ?', [id]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await deenbotDb.run('DELETE FROM prayer_logs WHERE username = ?', [user.username]);
        await deenbotDb.run('DELETE FROM users WHERE id = ?', [id]);

        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const getDuaCategoryCounts = async (req, res) => {
    try {
        const rows = await duaDb.all(
            `SELECT c.id, COALESCE(c.name_en, c.name_ar, '') as name, COUNT(d.id) as count
             FROM categories c
             LEFT JOIN duas d ON d.category_id = c.id
             GROUP BY c.id
             ORDER BY count DESC`);
        res.json(rows);
    } catch (err) {
        console.error('Failed to get dua category counts:', err);
        res.status(500).json({ error: 'Failed to fetch category distribution' });
    }
};

// Generic CRUD handlers
export const listResource = (db, tableName, allowedFields, idField = 'id') => async (req, res) => {
    const { page = 1, limit = 10, sort = idField, order = 'DESC', search } = req.query;
    const offset = (page - 1) * limit;
    try {
        let query = `SELECT * FROM ${tableName}`;
        const params = [];
        if (search) {
            const searchField = allowedFields.find(f => !f.endsWith('_id') && !f.includes('number'));
            if (searchField) {
                query += ` WHERE ${searchField} LIKE ?`;
                params.push(`%${search}%`);
            }
        }
        query += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        const items = await db.all(query, params);
        const countResult = await db.get(`SELECT COUNT(*) as count FROM ${tableName}`);
        res.json({ data: items, total: countResult.count, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const createResource = (db, tableName, allowedFields) => async (req, res) => {
    const data = req.body;
    try {
        const fields = allowedFields.filter(f => data[f] !== undefined);
        if (fields.length === 0) return res.status(400).json({ error: 'No valid fields' });
        const placeholders = fields.map(() => '?').join(',');
        const values = fields.map(f => data[f]);
        await db.run(`INSERT INTO ${tableName} (${fields.join(',')}) VALUES (${placeholders})`, values);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const updateResource = (db, tableName, allowedFields, idField = 'id') => async (req, res) => {
    const data = req.body;
    try {
        const fields = allowedFields.filter(f => data[f] !== undefined);
        const setClause = fields.map(f => `${f} = ?`).join(',');
        const values = [...fields.map(f => data[f]), req.params.id];
        await db.run(`UPDATE ${tableName} SET ${setClause} WHERE ${idField} = ?`, values);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const deleteResource = (db, tableName, idField = 'id') => async (req, res) => {
    try {
        await db.run(`DELETE FROM ${tableName} WHERE ${idField} = ?`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};
