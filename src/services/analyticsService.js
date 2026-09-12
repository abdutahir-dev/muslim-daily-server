import { deenbotDb } from '../db/connection.js';
import dayjs from 'dayjs';

function formatDate(d) {
  return dayjs(d).format('YYYY-MM-DD');
}

export async function getSummary(username, period = 'weekly') {
  const now = dayjs();
  let start;
  if (period === 'weekly') start = now.startOf('week');
  else if (period === 'monthly') start = now.startOf('month');
  else start = now.subtract(1, 'week');
  const rows = await deenbotDb.all(
    `SELECT type, COUNT(*) as count
     FROM user_activities
     WHERE username = ? AND timestamp >= ?
     GROUP BY type`,
    [username, start.format('YYYY-MM-DD')]
  );
  return rows;
}

export async function getReadingStreak(username) {
  // assume we record a 'read_hadith' or 'view_hadith' activity with metadata containing date
  const rows = await deenbotDb.all(
    `SELECT timestamp FROM user_activities
     WHERE username = ? AND type LIKE 'read_%' 
     ORDER BY timestamp DESC`,
    [username]
  );
  if (!rows.length) return 0;
  let streak = 0;
  let current = dayjs();
  for (const r of rows) {
    const d = dayjs(r.timestamp);
    if (current.diff(d, 'day') <= 1) {
      streak++;
      current = current.subtract(1, 'day');
    } else {
      break;
    }
  }
  return streak;
}

export async function topCategories(username, period = 'monthly', limit = 5) {
  // assume metadata contains { category: '...' }
  const now = dayjs();
  let start = period === 'monthly' ? now.startOf('month') : now.startOf('week');
  const rows = await deenbotDb.all(
    `SELECT json_extract(metadata, '$.category') as category, COUNT(*) as cnt
     FROM user_activities
     WHERE username = ? AND timestamp >= ?
     GROUP BY category
     ORDER BY cnt DESC
     LIMIT ?`,
    [username, start.format('YYYY-MM-DD'), limit]
  );
  return rows;
}
