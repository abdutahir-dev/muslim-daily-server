import { quranDb, deenbotDb } from '../db/connection.js';

// We'll import Duas from a JSON we'll create or just hardcode for now
// to maintain consistency with front-end
const duas = [
    { id: '1', title: { en: 'Before Sleeping', ar: 'عند النوم' }, category: 'Daily' },
    // ... more will be added or loaded from a shared file
];

export const globalSearch = async (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 2) {
        return res.json({ results: [] });
    }

    const searchTerm = `%${q}%`;

    try {
        // 1. Search Surahs
        const surahs = await quranDb.all(
            'SELECT id, name_simple as title, name_arabic as subtitle, "surah" as type FROM surahs WHERE name_simple LIKE ? OR name_arabic LIKE ? LIMIT 5',
            [searchTerm, searchTerm]
        );

        // 2. Search Ayahs (Translations)
        const ayahs = await quranDb.all(
            `SELECT a.verse_key as id, a.text_uthmani as subtitle, t.text as title, "ayah" as type, a.surah_number 
             FROM ayahs a
             JOIN ayah_translations t ON a.verse_key = t.verse_key
             WHERE t.text LIKE ? OR a.text_uthmani LIKE ?
             LIMIT 10`,
            [searchTerm, searchTerm]
        );

        // 3. Search Users (Optional, only for admin or specific use cases)
        // const users = ...

        // Combined results
        const results = [
            ...surahs.map(s => ({ ...s, id: `surah-${s.id}`, link: `/quran/${s.id}` })),
            ...ayahs.map(a => ({ ...a, id: `ayah-${a.id}`, link: `/quran/${a.surah_number}?verse=${a.id}` }))
        ];

        res.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};
