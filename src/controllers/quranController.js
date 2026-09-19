import { quranDb } from '../db/connection.js';

export const getSurahs = async (req, res) => {
    try {
        const surahs = await quranDb.all('SELECT * FROM surahs ORDER BY id ASC');
        const formatted = surahs.map(s => {
            let themes = [];
            try {
                if (s.themes_json) themes = JSON.parse(s.themes_json);
            } catch (_) {}
            return {
                ...s,
                themes
            };
        });
        res.setHeader('x-total-count', formatted.length);
        res.setHeader('Access-Control-Expose-Headers', 'x-total-count');
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch surahs' });
    }
};

export const getSurah = async (req, res) => {
    try {
        const surah = await quranDb.get('SELECT * FROM surahs WHERE id = ?', [req.params.id]);
        if (!surah) return res.status(404).json({ error: 'Surah not found' });
        let themes = [];
        try {
            if (surah.themes_json) themes = JSON.parse(surah.themes_json);
        } catch (_) {}
        res.json({
            ...surah,
            themes
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch surah' });
    }
};

export const getAyahs = async (req, res) => {
    const surahId = parseInt(req.params.id);
    const translationId = parseInt(req.query.translationId) || 1;
    const tafsirId = parseInt(req.query.tafsirId) || 1;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 20;

    try {
        let query = `
      SELECT 
        a.id,
        a.verse_key,
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

const formatEnrichedAyah = (row) => {
    let themes = [];
    try {
        if (row.themes_json) themes = JSON.parse(row.themes_json);
    } catch (_) {}

    const translationEn = row.translation_en || '';
    const translationAm = row.translation_am || '';
    const tafsirAr = row.tafsir_ar || '';
    const tafsirEn = row.tafsir_en || '';
    const tafsirAm = row.tafsir_am || '';

    return {
        id: row.id,
        verse_key: row.verse_key,
        verse_number: row.verse_number,
        verseNumber: row.verse_number,
        surah_number: row.surah_number,
        surahNumber: row.surah_number,
        text_uthmani: row.text_uthmani,
        arabicText: row.text_uthmani,
        translation_en: translationEn,
        translation_am: translationAm,
        tafsir_ar: tafsirAr,
        tafsir_en: tafsirEn,
        tafsir_am: tafsirAm,
        // Legacy backward compatibility fields
        translationText: translationEn || translationAm || 'Translation not yet available',
        translationAmharic: translationAm,
        translationEnglish: translationEn,
        tafsirArabic: tafsirAr,
        tafsirEnglish: tafsirEn,
        tafsirAmharic: tafsirAm,
        surahName: row.name_simple,
        translations: {
            en: translationEn,
            am: translationAm
        },
        tafsirs: {
            ar: tafsirAr,
            en: tafsirEn,
            am: tafsirAm
        },
        surah: {
            id: row.surah_number,
            name_simple: row.name_simple,
            name_arabic: row.name_arabic,
            name_amharic: row.name_amharic || '',
            meaning_english: row.meaning_english || '',
            meaning_amharic: row.meaning_amharic || '',
            verses_count: row.verses_count,
            rukus_count: row.rukus_count,
            revelation_place: row.revelation_place,
            revelation_place_arabic: row.revelation_place_arabic || '',
            revelation_place_amharic: row.revelation_place_amharic || '',
            revelation_order: row.revelation_order,
            time_of_revelation: row.time_of_revelation || '',
            time_of_revelation_arabic: row.time_of_revelation_arabic || '',
            time_of_revelation_amharic: row.time_of_revelation_amharic || '',
            cause_of_revelation: row.cause_of_revelation || '',
            cause_of_revelation_arabic: row.cause_of_revelation_arabic || '',
            cause_of_revelation_amharic: row.cause_of_revelation_amharic || '',
            themes,
            virtues: row.virtues || ''
        }
    };
};

export const getRandomAyahs = async (req, res) => {
    // 7 ayahs by default as requested by user, with configurable count (1-50)
    const limit = Math.min(Math.max(parseInt(req.query.count || req.query.limit) || 7, 1), 50);
    const surahFilter = req.query.surah ? parseInt(req.query.surah) : null;

    try {
        let query = `
          SELECT 
            a.id,
            a.verse_key,
            a.verse_number,
            a.surah_number,
            a.text_uthmani,
            s.name_simple,
            s.name_arabic,
            s.name_amharic,
            s.meaning_english,
            s.meaning_amharic,
            s.verses_count,
            s.rukus_count,
            s.revelation_place,
            s.revelation_place_arabic,
            s.revelation_place_amharic,
            s.revelation_order,
            s.time_of_revelation,
            s.time_of_revelation_arabic,
            s.time_of_revelation_amharic,
            s.cause_of_revelation,
            s.cause_of_revelation_arabic,
            s.cause_of_revelation_amharic,
            s.themes_json,
            s.virtues,
            ten.text as translation_en,
            tam.text as translation_am,
            tar.text as tafsir_ar,
            ten_taf.text as tafsir_en,
            tam_taf.text as tafsir_am
          FROM ayahs a
          JOIN surahs s ON a.surah_number = s.id
          LEFT JOIN ayah_translations ten ON a.verse_key = ten.verse_key AND ten.translation_id = 1
          LEFT JOIN ayah_translations tam ON a.verse_key = tam.verse_key AND tam.translation_id = 2
          LEFT JOIN ayah_tafsirs tar ON a.verse_key = tar.verse_key AND tar.tafsir_id = 1
          LEFT JOIN ayah_tafsirs ten_taf ON a.verse_key = ten_taf.verse_key AND ten_taf.tafsir_id = 2
          LEFT JOIN ayah_tafsirs tam_taf ON a.verse_key = tam_taf.verse_key AND tam_taf.tafsir_id = 3
        `;
        const params = [];

        if (surahFilter) {
            query += ` WHERE a.surah_number = ?`;
            params.push(surahFilter);
        }

        query += ` ORDER BY RANDOM() LIMIT ?`;
        params.push(limit);

        const rows = await quranDb.all(query, params);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'No ayahs found' });
        }

        const ayahs = rows.map(formatEnrichedAyah);
        res.setHeader('x-total-count', ayahs.length);
        res.setHeader('Access-Control-Expose-Headers', 'x-total-count');

        // If client requested wrapper format, return { count, ayahs }, else direct array for legacy compatibility
        if (req.query.format === 'wrapped' || req.query.wrapper === 'true') {
            return res.json({
                count: ayahs.length,
                default_count: 7,
                ayahs
            });
        }

        res.json(ayahs);
    } catch (err) {
        console.error('Failed to fetch random ayahs:', err);
        res.status(500).json({ error: 'Failed to fetch random ayahs' });
    }
};

export const getSingleRandomAyah = async (req, res) => {
    try {
        const rows = await quranDb.all(`
          SELECT 
            a.id,
            a.verse_key,
            a.verse_number,
            a.surah_number,
            a.text_uthmani,
            s.name_simple,
            s.name_arabic,
            s.name_amharic,
            s.meaning_english,
            s.meaning_amharic,
            s.verses_count,
            s.rukus_count,
            s.revelation_place,
            s.revelation_place_arabic,
            s.revelation_place_amharic,
            s.revelation_order,
            s.time_of_revelation,
            s.time_of_revelation_arabic,
            s.time_of_revelation_amharic,
            s.cause_of_revelation,
            s.cause_of_revelation_arabic,
            s.cause_of_revelation_amharic,
            s.themes_json,
            s.virtues,
            ten.text as translation_en,
            tam.text as translation_am,
            tar.text as tafsir_ar,
            ten_taf.text as tafsir_en,
            tam_taf.text as tafsir_am
          FROM ayahs a
          JOIN surahs s ON a.surah_number = s.id
          LEFT JOIN ayah_translations ten ON a.verse_key = ten.verse_key AND ten.translation_id = 1
          LEFT JOIN ayah_translations tam ON a.verse_key = tam.verse_key AND tam.translation_id = 2
          LEFT JOIN ayah_tafsirs tar ON a.verse_key = tar.verse_key AND tar.tafsir_id = 1
          LEFT JOIN ayah_tafsirs ten_taf ON a.verse_key = ten_taf.verse_key AND ten_taf.tafsir_id = 2
          LEFT JOIN ayah_tafsirs tam_taf ON a.verse_key = tam_taf.verse_key AND tam_taf.tafsir_id = 3
          ORDER BY RANDOM()
          LIMIT 1
        `);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'No ayahs found' });
        }

        res.json(formatEnrichedAyah(rows[0]));
    } catch (err) {
        console.error('Failed to fetch single random ayah:', err);
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
