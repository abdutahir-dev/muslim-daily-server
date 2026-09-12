import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken, adminOnly } from '../middleware/authMiddleware.js';
import { deenbotDb, quranDb, prayersDb, hadithDb, duaDb } from '../db/connection.js';

const router = express.Router();

router.use(authenticateToken, adminOnly);

router.post('/seed', adminController.seedData);
router.get('/stats', adminController.getStats);
router.get('/users_list', adminController.getUsers); // renamed to avoid conflict
router.delete('/users/:id', adminController.deleteUser);
router.get('/dua_category_counts', adminController.getDuaCategoryCounts);

// Generic CRUD assignments
const resources = [
    { path: 'users', db: deenbotDb, table: 'users', fields: ['username', 'email', 'password', 'role', 'settings', 'bookmarks', 'favorites'] },
    { path: 'surahs', db: quranDb, table: 'surahs', fields: ['name_simple', 'name_arabic', 'verses_count', 'revelation_place'] },
    { path: 'ayahs', db: quranDb, table: 'ayahs', fields: ['surah_number', 'verse_number', 'text_uthmani', 'verse_key'] },
    { path: 'translations', db: quranDb, table: 'translations', fields: ['name', 'language_name', 'author_name'] },
    { path: 'tafsirs', db: quranDb, table: 'tafsirs', fields: ['name', 'language_name', 'author_name'] },
    { path: 'prayer_timings', db: prayersDb, table: 'prayer_timings', fields: ['date', 'city', 'country', 'method', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] },
    { path: 'prayer_logs', db: deenbotDb, table: 'prayer_logs', fields: ['username', 'date', 'prayer_name', 'status'] },
    { path: 'hadiths', db: hadithDb, table: 'hadiths', fields: ['book_id','hadith_number','text_ar','text_en','grade','source'] },
    { path: 'categories', db: duaDb, table: 'categories', fields: ['name_en','name_ar'] },
    { path: 'duas', db: duaDb, table: 'duas', fields: ['category_id','title_en','title_ar','content_ar','content_en','transliteration','reference'] }
];

resources.forEach(res => {
    router.get(`/${res.path}`, adminController.listResource(res.db, res.table, res.fields));
    router.get(`/${res.path}/:id`, async (req, res_express) => {
        try {
            const item = await res.db.get(`SELECT * FROM ${res.table} WHERE id = ?`, [req.params.id]);
            if (!item) return res_express.status(404).json({ error: 'Not found' });
            res_express.json(item);
        } catch (e) {
            res_express.status(500).json({ error: 'Failed' });
        }
    });
    router.post(`/${res.path}`, adminController.createResource(res.db, res.table, res.fields));
    router.put(`/${res.path}/:id`, adminController.updateResource(res.db, res.table, res.fields));
    router.delete(`/${res.path}/:id`, adminController.deleteResource(res.db, res.table));
});

export default router;
