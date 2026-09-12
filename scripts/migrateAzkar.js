import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function migrateAzkar() {
  const azkarPath = path.join(__dirname, '..', 'data', 'azkar-db');
  const duaPath = path.join(__dirname, '..', 'db', 'dua.sqlite');

  const azkarDb = await open({ filename: azkarPath, driver: sqlite3.Database });
  const duaDb = await open({ filename: duaPath, driver: sqlite3.Database });

  console.log('reading categories from azkar-db');
  const cats = await azkarDb.all('SELECT * FROM category');

  for (const c of cats) {
    const name_ar = c.category;
    const name_en = c.category; // no english translation available
    await duaDb.run(
      'INSERT OR IGNORE INTO categories (name_en, name_ar) VALUES (?,?)',
      name_en,
      name_ar,
    );
  }

  console.log('importing azkar entries');
  const rows = await azkarDb.all('SELECT * FROM azkar');

  for (const r of rows) {
    const catRow = await duaDb.get('SELECT id FROM categories WHERE name_ar = ?', r.category);
    if (!catRow) continue;

    const title_ar = r.category || '';
    const title_en = r.category || '';
    const content_ar = r.zekr || '';
    const content_en = r.description || '';
    const transliteration = '';
    const reference = r.reference || '';

    await duaDb.run(
      `INSERT OR IGNORE INTO duas (category_id,title_en,title_ar,content_ar,content_en,transliteration,reference)
         VALUES (?,?,?,?,?,?,?)`,
      catRow.id,
      title_en,
      title_ar,
      content_ar,
      content_en,
      transliteration,
      reference,
    );
  }

  console.log('migration complete');
  await azkarDb.close();
  await duaDb.close();
}

// execute immediately when run as script
migrateAzkar().catch((e) => {
  console.error(e);
  process.exit(1);
});
