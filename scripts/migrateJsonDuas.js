import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';

// __dirname is not available in ES modules, so derive it
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrateJsonDuas() {
  const dataRoot = path.join(__dirname, '..', 'data', 'dua-dhikr');
  const duaPath = path.join(__dirname, '..', 'db', 'dua.sqlite');

  const duaDb = await open({ filename: duaPath, driver: sqlite3.Database });

  // read categories.json if present
  const catFile = path.join(dataRoot, 'core', 'categories.json');
  let catsJson = null;
  if (fs.existsSync(catFile)) {
    try {
      catsJson = JSON.parse(fs.readFileSync(catFile, 'utf-8'));
      console.log('loaded categories.json');
    } catch (err) {
      console.error('failed parsing categories.json', err);
    }
  }

  async function ensureCategory(slug) {
    // figure out english and arabic names
    let name_en = slug;
    let name_ar = '';
    if (catsJson) {
      if (catsJson.en) {
        const rec = catsJson.en.find((c) => c.slug === slug);
        if (rec) name_en = rec.name;
      }
      if (catsJson.id) {
        const rec = catsJson.id.find((c) => c.slug === slug);
        if (rec) name_ar = rec.name;
      }
      if (catsJson.ar) {
        const rec = catsJson.ar.find((c) => c.slug === slug);
        if (rec) name_ar = rec.name;
      }
    }

    // try to locate existing row by english name or arabic name
    const existing = await duaDb.get(
      'SELECT id FROM categories WHERE name_en = ? OR name_ar = ?',
      name_en,
      name_ar,
    );
    if (existing) {
      return existing.id;
    }
    const res = await duaDb.run(
      'INSERT INTO categories (name_en, name_ar) VALUES (?, ?)',
      name_en,
      name_ar,
    );
    return res.lastID;
  }

  // iterate subdirectories that are actual categories
  const dirents = fs.readdirSync(dataRoot, { withFileTypes: true });
  for (const d of dirents) {
    if (!d.isDirectory()) continue;
    const slug = d.name;
    if (slug === 'core') continue; // metadata folder
    const categoryId = await ensureCategory(slug);
    const categoryDir = path.join(dataRoot, slug);
    const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      const lang = path.basename(file, '.json');
      const filePath = path.join(categoryDir, file);
      let arr;
      try {
        arr = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (err) {
        console.error(`failed to parse ${filePath}`, err);
        continue;
      }

      for (const item of arr) {
        const title_en = lang === 'en' ? item.title || '' : '';
        const title_ar = item.arabic || '';
        const content_ar = item.arabic || '';
        const content_en = item.translation || '';
        const transliteration = item.latin || '';
        const reference = item.source || '';

        // simple duplicate check using category, arabic text and english translation
        const existing = await duaDb.get(
          `SELECT id FROM duas WHERE category_id=? AND content_ar=? AND content_en=?`,
          categoryId,
          content_ar,
          content_en,
        );
        if (existing) continue;

        await duaDb.run(
          `INSERT INTO duas (category_id,title_en,title_ar,content_ar,content_en,transliteration,reference)
              VALUES (?,?,?,?,?,?,?)`,
          categoryId,
          title_en,
          title_ar,
          content_ar,
          content_en,
          transliteration,
          reference,
        );
      }
    }
  }

  console.log('migrateJsonDuas complete');
  await duaDb.close();
}

migrateJsonDuas().catch((e) => {
  console.error(e);
  process.exit(1);
});
