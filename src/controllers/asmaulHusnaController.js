import * as asmaulHusnaService from '../services/asmaulHusnaService.js';

/**
 * Controller for Asmaul Husna service endpoints
 */

export async function getOverview(req, res) {
  try {
    const stats = await asmaulHusnaService.getStats();
    res.json({
      service: 'Asmaul Husna (The 99 Most Beautiful Names of Allah)',
      version: '1.0.0',
      description: 'Comprehensive service providing the 99 Names of Allah with translations, detailed theological descriptions, Quranic and Hadith references, and full trilingual support for Arabic, Amharic, and English.',
      endpoints: {
        all: '/asmaul-husna',
        byId: '/asmaul-husna/:identifier (number 1-99, name in Arabic, or transliteration)',
        random: '/asmaul-husna/random',
        daily: '/asmaul-husna/daily',
        search: '/asmaul-husna/search?q={query}',
        stats: '/asmaul-husna/stats'
      },
      supportedLanguages: stats.supportedLanguages,
      languageLabels: stats.languageLabels,
      stats
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve Asmaul Husna overview', message: err.message });
  }
}

export async function getAllNames(req, res) {
  try {
    const { lang, search, page, limit } = req.query;
    const result = await asmaulHusnaService.getAllNames({ lang, search, page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Asmaul Husna list', message: err.message });
  }
}

export async function getNameByIdentifier(req, res) {
  try {
    const { identifier } = req.params;
    const { lang } = req.query;

    const item = await asmaulHusnaService.getNameByIdentifier(identifier, { lang });
    if (!item) {
      return res.status(404).json({
        error: 'Name not found',
        message: `No name of Allah found matching identifier '${identifier}'. Identifier can be a number from 1 to 99, an Arabic name (e.g. الرحمن), or a transliteration (e.g. Ar-Rahman).`
      });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch name of Allah', message: err.message });
  }
}

export async function getRandomName(req, res) {
  try {
    const { lang } = req.query;
    const item = await asmaulHusnaService.getRandomName({ lang });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch random name of Allah', message: err.message });
  }
}

export async function getDailyName(req, res) {
  try {
    const { date, lang } = req.query;
    const result = await asmaulHusnaService.getDailyName({ date, lang });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily name of Allah', message: err.message });
  }
}

export async function searchNames(req, res) {
  try {
    const { q, lang, limit } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: 'Missing search query', message: 'Query parameter q is required' });
    }

    const result = await asmaulHusnaService.getAllNames({ lang, search: q, limit });
    res.json({
      query: q,
      total: result.total || result.data.length,
      language: lang || 'all',
      results: result.data
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to search Asmaul Husna', message: err.message });
  }
}

export async function getStats(req, res) {
  try {
    const stats = await asmaulHusnaService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Asmaul Husna statistics', message: err.message });
  }
}
