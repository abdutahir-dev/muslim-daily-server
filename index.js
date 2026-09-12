import app from './src/app.js';
import { initDatabases } from './src/db/connection.js';
import fs from 'node:fs';
import http from 'http';
import https from 'https';

const PORT = process.env.PORT || 5003;
const IP_ADDRESS = process.env.IP_ADDRESS || '[IP_ADDRESS]';

const S_PORT = process.env.S_PORT || PORT + 1 || 5004;
const CERT = process.env.CERT || './certs/certificate.crt';
const KEY = process.env.KEY || './certs/private.key';


const options = {
  key: fs.readFileSync(KEY),
  cert: fs.readFileSync(CERT),
};




async function startServer() {
  try {
    await initDatabases();

    if (process.env.NODE_ENV === 'production') {
      app.listen(PORT, () => {
        console.log("Server running on production environment");
        console.log("HTTP Link: ", `http://${IP_ADDRESS}:${PORT}`)
      })
    } else {
      console.log("Server running on dev environment");
      http.createServer(app).listen(PORT, IP_ADDRESS, () => {
        console.log("HTTP Link: ", `http://${IP_ADDRESS}:${PORT}`)
      });
      https.createServer(options, app).listen(S_PORT, IP_ADDRESS, () => {

        console.log(`HTTPS Link: https://${IP_ADDRESS}:${S_PORT}`);
      });
    }

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

async function seedTranslationMetadata(force = false) {
  const transCount = await quranDb.get('SELECT COUNT(*) as count FROM translations');
  if (transCount.count === 0 || force) {
    const res = await fetch('https://api.quran.com/api/v4/resources/translations', { agent });
    const { translations } = await res.json();
    await quranDb.exec('BEGIN TRANSACTION');
    const ins = await quranDb.prepare('INSERT INTO translations (id, name, language_name, author_name) VALUES (?, ?, ?, ?)');
    for (const t of translations) { await ins.run(t.id, t.name, t.language_name, t.author_name); }
    await ins.finalize();
    await quranDb.exec('COMMIT');
  }
}

async function seedTafsirMetadata(force = false) {
  const tafsirCount = await quranDb.get('SELECT COUNT(*) as count FROM tafsirs');
  if (tafsirCount.count === 0 || force) {
    const res = await fetch('https://api.quran.com/api/v4/resources/tafsirs', { agent });
    const { tafsirs } = await res.json();
    await quranDb.exec('BEGIN TRANSACTION');
    const ins = await quranDb.prepare('INSERT INTO tafsirs (id, name, language_name, author_name) VALUES (?, ?, ?, ?)');
    for (const t of tafsirs) { await ins.run(t.id, t.name, t.language_name, t.author_name); }
    await ins.finalize();
    await quranDb.exec('COMMIT');
  }
}

async function seedQuranData(force = false) {
  await seedBasicQuran(force);
  await seedTranslationMetadata(force);
  await seedTafsirMetadata(force);
}
/***
// --- Auth Endpoints ---

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await deenbotDb.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing) return res.status(400).json({ error: 'Username or email already exists' });
    await deenbotDb.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    res.json({ success: true, user: { username, email } });
  } catch (err) { res.status(500).json({ error: 'Registration failed' }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await deenbotDb.get('SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?', [username, username, password]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({
      success: true,
      user: { username: user.username, email: user.email, role: user.role || 'user' },
      settings: JSON.parse(user.settings || '{}'),
      bookmarks: JSON.parse(user.bookmarks || '[]'),
      favorites: JSON.parse(user.favorites || '[]')
    });
  } catch (err) { res.status(500).json({ error: 'Login failed' }); }
});

// --- User Sync Endpoints ---

app.get('/api/user/settings/:username', async (req, res) => {
  try {
    const user = await deenbotDb.get('SELECT settings FROM users WHERE username = ?', [req.params.username]);
    res.json(user ? JSON.parse(user.settings) : {});
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/user/settings', async (req, res) => {
  const { username, settings } = req.body;
  try {
    await deenbotDb.run('UPDATE users SET settings = ? WHERE username = ?', [JSON.stringify(settings), username]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/user/bookmarks/:username', async (req, res) => {
  try {
    const user = await deenbotDb.get('SELECT bookmarks FROM users WHERE username = ?', [req.params.username]);
    res.json(JSON.parse(user?.bookmarks || '[]'));
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/user/bookmarks/toggle', async (req, res) => {
  const { username, item } = req.body;
  try {
    const user = await deenbotDb.get('SELECT bookmarks FROM users WHERE username = ?', [username]);
    let bookmarks = JSON.parse(user?.bookmarks || '[]');
    const exists = bookmarks.some(b => b.id === item.id);
    bookmarks = exists ? bookmarks.filter(b => b.id !== item.id) : [item, ...bookmarks];
    await deenbotDb.run('UPDATE users SET bookmarks = ? WHERE username = ?', [JSON.stringify(bookmarks), username]);
    res.json({ success: true, action: exists ? 'removed' : 'added', bookmarks });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/user/favorites/:username', async (req, res) => {
  try {
    const user = await deenbotDb.get('SELECT favorites FROM users WHERE username = ?', [req.params.username]);
    res.json(JSON.parse(user?.favorites || '[]'));
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/user/favorites/toggle', async (req, res) => {
  const { username, item } = req.body;
  try {
    const user = await deenbotDb.get('SELECT favorites FROM users WHERE username = ?', [username]);
    let favorites = JSON.parse(user?.favorites || '[]');
    const exists = favorites.some(f => f.id === item.id);
    favorites = exists ? favorites.filter(f => f.id !== item.id) : [item, ...favorites];
    await deenbotDb.run('UPDATE users SET favorites = ? WHERE username = ?', [JSON.stringify(favorites), username]);
    res.json({ success: true, action: exists ? 'removed' : 'added', favorites });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// --- Prayer Tracking ---

app.get('/api/prayers/times', async (req, res) => {
  const { city = 'Addis Ababa', country = 'Ethiopia', method = 2, date } = req.query;
  let lookupDate = date;
  if (date && date.includes('-')) {
    const parts = date.split('-');
    if (parts[0].length === 4) lookupDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  } else if (!date) {
    const d = new Date();
    lookupDate = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  }

  try {
    const local = await prayersDb.get('SELECT fajr as Fajr, sunrise as Sunrise, dhuhr as Dhuhr, asr as Asr, maghrib as Maghrib, isha as Isha FROM prayer_timings WHERE city = ? AND country = ? AND method = ? AND date = ?', [city, country, parseInt(method), lookupDate]);
    if (local) return res.json(local);
    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${lookupDate}?city=${city}&country=${country}&method=${method}`, { agent });
    const data = await response.json();
    if (data?.data?.timings) return res.json(data.data.timings);
    res.status(502).json({ error: 'Failed to fetch prayer times' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/prayers/status/:username/:date', async (req, res) => {
  const { username, date } = req.params;
  try {
    const logs = await deenbotDb.all('SELECT prayer_name, prayer_type, prayed_as, status FROM prayer_logs WHERE username = ? AND date = ?', [username, date]);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/prayers/update', async (req, res) => {
  const { username, date, prayer_name, prayer_type = 'fard', prayed_as = 'on_time', status = 1 } = req.body;
  try {
    await deenbotDb.run(`
      INSERT INTO prayer_logs (username, date, prayer_name, prayer_type, prayed_as, status)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(username, date, prayer_name, prayer_type) 
      DO UPDATE SET prayed_as = excluded.prayed_as, status = excluded.status
    `, [username, date, prayer_name, prayer_type, prayed_as, status]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/prayers/weekly/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const data = await deenbotDb.all('SELECT date, COUNT(*) as completed_count FROM prayer_logs WHERE username = ? AND status = 1 AND date >= date("now", "-7 days") GROUP BY date', [username]);
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/prayers/monthly/:username/:month', async (req, res) => {
  const { username, month } = req.params;
  try {
    const logs = await deenbotDb.all('SELECT * FROM prayer_logs WHERE username = ? AND date LIKE ?', [username, `${month}-%`]);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/prayers/analysis/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const total = await deenbotDb.get('SELECT COUNT(*) as count FROM prayer_logs WHERE username = ? AND status = 1', [username]);
    const onTime = await deenbotDb.get('SELECT COUNT(*) as count FROM prayer_logs WHERE username = ? AND status = 1 AND prayed_as = "on_time"', [username]);
    const qada = await deenbotDb.get('SELECT COUNT(*) as count FROM prayer_logs WHERE username = ? AND status = 1 AND prayed_as = "qada"', [username]);
    res.json({ total_prayed: total.count, on_time_count: onTime.count, qada_count: qada.count, streak: 0 });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// --- Data Endpoints ---

app.get('/api/quran/surahs', async (req, res) => {
  try {
    const surahs = await quranDb.all('SELECT * FROM surahs ORDER BY id ASC');
    res.setHeader('x-total-count', surahs.length);
    res.json(surahs);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/quran/surahs/:id', async (req, res) => {
  try {
    const surah = await quranDb.get('SELECT * FROM surahs WHERE id = ?', [req.params.id]);
    if (!surah) return res.status(404).json({ error: 'Not found' });
    res.json(surah);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/quran/surahs/:id/ayahs', async (req, res) => {
  const { id } = req.params;
  const transId = req.query.translationId || 131;
  const tafsirId = req.query.tafsirId || 169;
  try {
    const ayahs = await quranDb.all(`
      SELECT a.id, a.verse_number, a.text_uthmani, t.text as translation, taf.text as tafsir
      FROM ayahs a
      LEFT JOIN ayah_translations t ON a.verse_key = t.verse_key AND t.translation_id = ?
      LEFT JOIN ayah_tafsirs taf ON a.verse_key = taf.verse_key AND taf.tafsir_id = ?
      WHERE a.surah_number = ? ORDER BY a.verse_number ASC
    `, [transId, tafsirId, id]);
    res.json(ayahs);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/quotes/random', async (req, res) => {
  try {
    const quote = await quotesDb.get(`
      SELECT words._id as id, words.Wisdom AS arabic_txt, words.enWisdom AS english_txt, source.artitle AS source, topic.artitle AS topic
      FROM words INNER JOIN source ON words.Source = source._id INNER JOIN topic ON words.Topic = topic._id
      WHERE words.enWisdom IS NOT NULL AND words.enWisdom != '' ORDER BY RANDOM() LIMIT 1
    `);
    res.json(quote);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/ayahs/random', async (req, res) => {
  const transId = req.query.translationId || 87;
  try {
    const start = await quranDb.get('SELECT id FROM ayahs ORDER BY RANDOM() LIMIT 1');
    const ayahs = await quranDb.all(`
      SELECT a.text_uthmani as arabicText, COALESCE(t.text, '...') as translationText, a.verse_number as verseNumber, s.name_simple as surahName, s.id as surahNumber
      FROM ayahs a JOIN surahs s ON a.surah_number = s.id LEFT JOIN ayah_translations t ON a.verse_key = t.verse_key AND t.translation_id = ?
      WHERE a.id >= ? ORDER BY a.id ASC LIMIT 7
    `, [transId, start.id]);
    res.json(ayahs);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/hadith/daily', async (req, res) => {
  try {
    const hadith = await hadithDb.get('SELECT * FROM Hadith ORDER BY RANDOM() LIMIT 1');
    res.json(hadith);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/duas/categories', async (req, res) => {
  try {
    const data = await duasDb.all('SELECT * FROM categories');
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/duas/categories/:id', async (req, res) => {
  try {
    const data = await duasDb.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/duas/random', async (req, res) => {
  try {
    const data = await duasDb.get('SELECT * FROM duas ORDER BY RANDOM() LIMIT 1');
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/audio/:surahId/:ayahId', async (req, res) => {
  const { surahId, ayahId } = req.params;
  const { reciter = 'Mishari_Rashid_Alafasy_24kbps' } = req.query;
  const s = surahId.padStart(3, '0');
  const a = ayahId.padStart(3, '0');
  const url = `https://everyayah.com/data/${reciter}/${s}${a}.mp3`;
  https.get(url, (p) => { res.writeHead(p.statusCode, p.headers); p.pipe(res); }).on('error', () => res.status(500).end());
});

// --- Admin Endpoints ---

function registerAdminRoutes() {
  const createCrud = (path, db, table, fields) => {
    app.get(`/api/admin/${path}`, async (req, res) => {
      const { page = 1, limit = 10 } = req.query;
      try {
        const data = await db.all(`SELECT * FROM ${table} LIMIT ? OFFSET ?`, [limit, (page - 1) * limit]);
        const total = await db.get(`SELECT COUNT(*) as count FROM ${table}`);
        res.json({ data, total: total.count });
      } catch (err) { res.status(500).json({ error: 'Failed' }); }
    });
    // Simplified other CRUD for brevity
  };
  createCrud('users', deenbotDb, 'users', ['username', 'email']);
  createCrud('prayer_logs', deenbotDb, 'prayer_logs', ['username', 'date']);
}

// --- Analytics Endpoints ---

app.get('/api/analytics/stats/:username', async (req, res) => {
  try {
    const prayers = await deenbotDb.get('SELECT COUNT(*) as count FROM prayer_logs WHERE username = ? AND status = 1', [req.params.username]);
    res.json([{ type: 'prayer', count: prayers.count }, { type: 'dua', count: 0 }, { type: 'quran_reading', count: 0 }]);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/analytics/history/:username', async (req, res) => {
  try {
    const data = await deenbotDb.all('SELECT "prayer" as type, prayer_name as value, date as timestamp FROM prayer_logs WHERE username = ? AND status = 1 ORDER BY date DESC LIMIT 10', [req.params.username]);
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.get('/api/analytics/streak/:username', async (req, res) => { res.json({ streak: 0 }); });
**/
initDatabases().then(() => {
  app.listen(PORT, '0.0.0.0', () => { console.log(`Server running on http://0.0.0.0:${PORT}`); });
});
