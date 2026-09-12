import { duaDb, deenbotDb } from '../db/connection.js';
import dayjs from 'dayjs';

export async function listCategories() {
  return duaDb.all('SELECT * FROM categories ORDER BY name_en');
}

export async function listDuas({ page = 1, limit = 20, category, q } = {}) {
  let sql = 'SELECT * FROM duas';
  const params = [];
  const clauses = [];
  if (category) {
    clauses.push('category_id = ?');
    params.push(category);
  }
  if (q) {
    clauses.push('(content_en LIKE ? OR content_ar LIKE ? OR title_en LIKE ? OR title_ar LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, (page - 1) * limit);
  return duaDb.all(sql, params);
}

export async function getDuaById(id) {
  return duaDb.get('SELECT * FROM duas WHERE id = ?', [id]);
}

export async function getRandomDua() {
  return duaDb.get('SELECT * FROM duas ORDER BY RANDOM() LIMIT 1');
}

export async function getDuaCategoryById(id) {
  return duaDb.get('SELECT * FROM categories WHERE id = ?', [id]);
}

export async function createDua(dua) {
  const { category_id, title_en, title_ar, content_ar, content_en, transliteration, reference } = dua;
  const res = await duaDb.run(
    `INSERT INTO duas (category_id, title_en, title_ar, content_ar, content_en, transliteration, reference)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [category_id, title_en, title_ar, content_ar, content_en, transliteration, reference]
  );
  return { id: res.lastID };
}

export async function updateDua(id, dua) {
  const { category_id, title_en, title_ar, content_ar, content_en, transliteration, reference } = dua;
  await duaDb.run(
    `UPDATE duas SET category_id=?, title_en=?, title_ar=?, content_ar=?, content_en=?, transliteration=?, reference=? WHERE id=?`,
    [category_id, title_en, title_ar, content_ar, content_en, transliteration, reference, id]
  );
}

export async function deleteDua(id) {
  await duaDb.run('DELETE FROM duas WHERE id = ?', [id]);
}

export async function getDailyDua() {
  const today = dayjs().format('YYYY-MM-DD');
  const override = await deenbotDb.get('SELECT * FROM daily_content WHERE content_type = ? AND date = ?', ['dua', today]);
  if (override) {
    const dua = await duaDb.get('SELECT * FROM duas WHERE id = ?', [override.content_id]);
    if (dua) return dua;
  }
  // since daily_hadith table exists, maybe reuse same for dua or add new.
  const existing = await deenbotDb.get('SELECT * FROM daily_content WHERE content_type = ? AND date = ?', ['dua', today]);
  if (existing) {
    const dua = await duaDb.get('SELECT * FROM duas WHERE id = ?', [existing.content_id]);
    if (dua) return dua;
  }
  // pick random dua
  const random = await duaDb.get('SELECT * FROM duas ORDER BY RANDOM() LIMIT 1');
  if (random) {
    await deenbotDb.run('INSERT OR IGNORE INTO daily_content (content_type, content_id, date) VALUES (?, ?, ?)', ['dua', random.id, today]);
  }
  return random;
}

export async function overrideDailyDua(duaId, adminUsername) {
  const today = dayjs().format('YYYY-MM-DD');
  await deenbotDb.run(
    `INSERT INTO daily_content (content_type, content_id, date, overridden_by)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(date, content_type) DO UPDATE SET content_id=excluded.content_id, overridden_by=excluded.overridden_by`,
    ['dua', duaId, today, adminUsername]
  );
}
