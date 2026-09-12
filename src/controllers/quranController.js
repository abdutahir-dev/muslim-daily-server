import { quranDb } from '../db/connection.js';

export const getSurahs = async (req, res) => {
    try {
        const surahs = await quranDb.all('SELECT * FROM surahs ORDER BY id ASC');
        res.setHeader('x-total-count', surahs.length);
        res.setHeader('Access-Control-Expose-Headers', 'x-total-count');
        res.json(surahs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch surahs' });
    }
};

export const getSurah = async (req, res) => {
    try {
        const surah = await quranDb.get('SELECT * FROM surahs WHERE id = ?', [req.params.id]);
        if (!surah) return res.status(404).json({ error: 'Surah not found' });
        res.json(surah);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const getAyahs = async (req, res) => {
    const surahId = parseInt(req.params.id);
    const translationId = parseInt(req.query.translationId) || 131;
    const tafsirId = parseInt(req.query.tafsirId) || 169;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 20;

    try {
        let query = `
      SELECT 
        a.id,
        a.verse_number,
        a.text_uthmani,
        t.text as translation,
        taf.text as tafsir
      FROM ayahs a
      LEFT JOIN ayah_translations t ON a.verse_key = t.verse_key AND t.translation_id = ?
      LEFT JOIN ayah_tafsirs taf ON a.verse_key = taf.verse_key AND taf.tafsir_id = ?
      WHERE a.surah_number = ?
      ORDER BY a.verse_number ASC
    `;
        let params = [translationId, tafsirId, surahId];

        if (page) {
            const offset = (page - 1) * limit;
            query += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }

        const ayahs = await quranDb.all(query, params);
        const countResult = await quranDb.get('SELECT COUNT(*) as count FROM ayahs WHERE surah_number = ?', [surahId]);

        res.setHeader('x-total-count', countResult.count);
        res.setHeader('Access-Control-Expose-Headers', 'x-total-count');
        res.json(ayahs);
    } catch (err) {
        console.error('Failed to fetch ayahs:', err);
        res.status(500).json({ error: 'Failed' });
    }
};

export const getRandomAyahs = async (req, res) => {
    const { translationId = 87 } = req.query;
    try {
        const startAyah = await quranDb.get('SELECT id FROM ayahs ORDER BY RANDOM() LIMIT 1');
        if (!startAyah) return res.status(404).json({ error: 'No ayahs found' });

        const ayahs = await quranDb.all(`
      SELECT 
        a.text_uthmani as arabicText,
        COALESCE(t.text, 'Translation not yet available') as translationText,
        a.verse_number as verseNumber,
        s.name_simple as surahName,
        s.id as surahNumber
      FROM ayahs a
      JOIN surahs s ON a.surah_number = s.id
      LEFT JOIN ayah_translations t ON a.verse_key = t.verse_key AND t.translation_id = ?
      WHERE a.id >= ?
      ORDER BY a.id ASC
      LIMIT 7
    `, [translationId, startAyah.id]);

        res.json(ayahs);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const getSingleRandomAyah = async (req, res) => {
    const { translationId = 87 } = req.query;
    try {
        const ayah = await quranDb.get(`
      SELECT 
        a.text_uthmani as arabicText,
        COALESCE(t.text, 'Translation not yet available') as translationText,
        a.verse_number as verseNumber,
        s.name_simple as surahName,
        s.id as surahNumber
      FROM ayahs a
      JOIN surahs s ON a.surah_number = s.id
      LEFT JOIN ayah_translations t ON a.verse_key = t.verse_key AND t.translation_id = ?
      ORDER BY RANDOM()
      LIMIT 1
    `, [translationId]);
        res.json(ayah);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const getTafsir = async (req, res) => {
    const { verseKey, tafsirId = 90 } = req.query;
    try {
        const tafsir = await quranDb.get(`
      SELECT text FROM ayah_tafsirs 
      WHERE verse_key = ? AND tafsir_id = ?
    `, [verseKey, tafsirId]);

        if (!tafsir) {
            return res.json({ text: "Interpretation for this verse is being prepared. Please check back shortly." });
        }
        res.json(tafsir);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tafsir' });
    }
};

export const getTranslationsMetadata = async (req, res) => {
    try {
        const translations = await quranDb.all('SELECT id, name, language_name FROM translations ORDER BY name ASC');
        res.json(translations.map(t => ({ ...t, name: t.name.trim(), language_name: t.language_name.trim() })));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const getTafsirsMetadata = async (req, res) => {
    try {
        const tafsirs = await quranDb.all('SELECT id, name, language_name FROM tafsirs ORDER BY name ASC');
        res.json(tafsirs.map(t => ({ ...t, name: t.name.trim(), language_name: t.language_name.trim() })));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const getQiraatStyles = async (req, res) => {
    try {
        const styles = await quranDb.all('SELECT * FROM qiraat_styles');
        res.json(styles);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch Qiraat styles' });
    }
};

export const getAyahsByStyle = async (req, res) => {
    const surahId = parseInt(req.params.id);
    const { styleId = 'hafs' } = req.query;

    try {
        // If hafs, use base ayahs table, otherwise use ayah_styles
        let ayahs;
        if (styleId === 'hafs') {
            ayahs = await quranDb.all(`
                SELECT verse_key, text_uthmani as text, verse_number
                FROM ayahs WHERE surah_number = ? ORDER BY verse_number ASC
            `, [surahId]);
        } else {
            ayahs = await quranDb.all(`
                SELECT s.verse_key, s.text, a.verse_number
                FROM ayah_styles s
                JOIN ayahs a ON s.verse_key = a.verse_key
                WHERE a.surah_number = ? AND s.style_id = ?
                ORDER BY a.verse_number ASC
            `, [surahId, styleId]);

            // If empty, fallback to hafs or trigger seed
            if (ayahs.length === 0) {
                 ayahs = await quranDb.all(`
                    SELECT verse_key, text_uthmani as text, verse_number
                    FROM ayahs WHERE surah_number = ? ORDER BY verse_number ASC
                `, [surahId]);
            }
        }
        res.json(ayahs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch ayahs' });
    }
};
