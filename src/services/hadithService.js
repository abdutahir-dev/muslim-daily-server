import { hadithDb, deenbotDb } from '../db/connection.js';
import dayjs from 'dayjs';

let hadithColumnsCache = null;

const getHadithColumns = async () => {
  if (hadithColumnsCache) return hadithColumnsCache;
  const columns = await hadithDb.all('PRAGMA table_info(Hadith)');
  hadithColumnsCache = columns.map((c) => c.name);
  return hadithColumnsCache;
};

const pickFirstExisting = (columns, options) =>
  options.find((name) => columns.includes(name)) || null;

// returns a promise resolving to today's random hadith record
export async function getDailyHadith() {
  const today = dayjs().format('YYYY-MM-DD');

  // first check override stored in daily_content in deenbotDb
  const override = await deenbotDb.get(
    'SELECT * FROM daily_content WHERE content_type = ? AND date = ?',
    ['hadith', today]
  );
  if (override) {
    const hadith = await hadithDb.get(`
      SELECT h.* FROM Hadith h
      JOIN Edition e ON h.editionId = e.id
      WHERE h.id = ? AND e.language = 'Arabic'
    `, [override.content_id]);
    if (hadith) return hadith;
  }

  // no override, check hadithDb.daily_hadith table
  const existing = await hadithDb.get('SELECT * FROM daily_hadith WHERE date = ?', [today]);
  if (existing) {
    const hadith = await hadithDb.get(`
      SELECT h.* FROM Hadith h
      JOIN Edition e ON h.editionId = e.id
      WHERE h.id = ? AND e.language = 'Arabic'
    `, [existing.hadith_id]);
    if (hadith) return hadith;
  }

  // pick random hadith and insert (Arabic only)
  const random = await hadithDb.get(`
    SELECT h.* FROM Hadith h
    JOIN Edition e ON h.editionId = e.id
    WHERE e.language = 'Arabic'
    ORDER BY RANDOM() LIMIT 1
  `);
  if (random) {
    await hadithDb.run('INSERT OR IGNORE INTO daily_hadith (hadith_id, date) VALUES (?, ?)', [random.id, today]);
  }
  return random;
}

// admin override
export async function overrideDailyHadith(hadithId, adminUsername) {
  const today = dayjs().format('YYYY-MM-DD');
  // insert or update override in deenbotDb.daily_content
  await deenbotDb.run(
    `INSERT INTO daily_content (content_type, content_id, date, overridden_by)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(date, content_type) DO UPDATE SET content_id=excluded.content_id, overridden_by=excluded.overridden_by`,
    ['hadith', hadithId, today, adminUsername]
  );
  // also update hadithDb.daily_hadith for completeness
  await hadithDb.run(
    `INSERT INTO daily_hadith (hadith_id, date, overridden_by)
     VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET hadith_id=excluded.hadith_id, overridden_by=excluded.overridden_by`,
    [hadithId, today, adminUsername]
  );
}

// editions, sections, listing
export async function listEditions() {
  return hadithDb.all('SELECT * FROM Edition ORDER BY name');
}

export async function listBooks() {
  return hadithDb.all('SELECT * FROM Book ORDER BY name');
}

export async function listSectionsForEdition(editionId) {
  return hadithDb.all('SELECT * FROM Section WHERE editionId = ? ORDER BY number', [editionId]);
}

export async function listHadithsForSection(sectionId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return hadithDb.all(
    'SELECT * FROM Hadith WHERE id BETWEEN (SELECT hadithNumberFirst FROM Section WHERE id = ?) AND (SELECT hadithNumberLast FROM Section WHERE id = ?) LIMIT ? OFFSET ?',
    [sectionId, sectionId, limit, offset]
  );
}

export async function listHadithsBySection(sectionId, editionId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;



  return hadithDb.all(
    `
    SELECT h.*
    FROM Hadith h
    JOIN Section s ON s.id = ?
    WHERE h.hadithNumber BETWEEN s.hadithNumberFirst AND s.hadithNumberLast
    LIMIT ? OFFSET ?
    `,
    [sectionId, limit, offset]
  );
}

export async function listHadithsForBook(bookId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const columns = await getHadithColumns();
  const bookColumn = pickFirstExisting(columns, ['bookId', 'book_id']);
  if (!bookColumn) {
    return [];
  }

  return hadithDb.all(
    `SELECT * FROM Hadith WHERE ${bookColumn} = ? ORDER BY id LIMIT ? OFFSET ?`,
    [bookId, limit, offset]
  );
}

export async function getHadithById(id) {
  return hadithDb.get('SELECT * FROM Hadith WHERE id = ?', [id]);
}

export async function getHadithByBook(id) {
  return hadithDb.get('SELECT * FROM Hadith WHERE id = ?', [id]);
}

export async function searchHadiths({
  query,
  page = 1,
  limit = 20,
  grade,
  source,
  narrator
}) {
  const normalizedQuery = String(query || '').trim();
  const normalizedGrade = String(grade || '').trim();
  const normalizedSource = String(source || '').trim();
  const normalizedNarrator = String(narrator || '').trim();
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const pageSize = Number.isFinite(limit) && limit > 0 ? limit : 20;
  const offset = (currentPage - 1) * pageSize;

  const columns = await getHadithColumns();
  const searchColumns = ['text_en', 'text_ar', 'source', 'reference', 'grade', 'narrator', 'name', 'key']
    .filter((name) => columns.includes(name));

  const whereClauses = [];
  const params = [];

  if (normalizedQuery && searchColumns.length > 0) {
    const queryClause = searchColumns.map((column) => `${column} LIKE ?`).join(' OR ');
    whereClauses.push(`(${queryClause})`);
    for (let i = 0; i < searchColumns.length; i += 1) {
      params.push(`%${normalizedQuery}%`);
    }
  }

  if (normalizedGrade && columns.includes('grade')) {
    whereClauses.push('grade LIKE ?');
    params.push(`%${normalizedGrade}%`);
  }
  if (normalizedSource && columns.includes('source')) {
    whereClauses.push('source LIKE ?');
    params.push(`%${normalizedSource}%`);
  }
  if (normalizedNarrator && columns.includes('narrator')) {
    whereClauses.push('narrator LIKE ?');
    params.push(`%${normalizedNarrator}%`);
  }

  const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const data = await hadithDb.all(
    `SELECT * FROM Hadith ${where} ORDER BY id LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );
  const totalRow = await hadithDb.get(
    `SELECT COUNT(*) as total FROM Hadith ${where}`,
    params
  );

  return {
    data,
    total: Number(totalRow?.total || 0),
    page: currentPage,
    limit: pageSize
  };
}
