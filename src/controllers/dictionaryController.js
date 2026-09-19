import * as dictionaryService from '../services/dictionaryService.js';
import * as translationService from '../services/translationService.js';

export async function getOverview(req, res) {
  try {
    const stats = await dictionaryService.getStats();
    res.json({
      service: 'Trilingual Dictionary & Lexicon (Arabic, Amharic, English)',
      version: '1.0.0',
      description: 'Comprehensive cross-referenced trilingual dictionary service providing vocabulary, morphology, roots, definitions, and usage examples across Classical & Modern Arabic, Amharic (አማርኛ), and English.',
      supportedLanguages: stats.supported_languages,
      languageMatrix: stats.language_matrix,
      endpoints: {
        allEntries: '/dictionary',
        search: '/dictionary/search?q={query}&lang={all|ar|am|en}&category={category}',
        lookup: '/dictionary/lookup/:word?lang={all|ar|am|en}',
        byId: '/dictionary/entry/:id',
        daily: '/dictionary/daily',
        random: '/dictionary/random?category={category}',
        autocomplete: '/dictionary/autocomplete?q={prefix}',
        categories: '/dictionary/categories',
        partsOfSpeech: '/dictionary/parts-of-speech',
        stats: '/dictionary/stats',
        translate: 'POST /dictionary/translate (or /translation/translate)',
        detect: 'POST /dictionary/detect (or /translation/detect)'
      },
      stats
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve dictionary overview', message: err.message });
  }
}

export async function getAllEntries(req, res) {
  try {
    const { q, search, query, lang, category, pos, page, limit } = req.query;
    const searchTerm = q || search || query;
    const result = await dictionaryService.getAllEntries({
      query: searchTerm,
      lang,
      category,
      pos,
      page,
      limit
    });
    res.json({
      success: true,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      },
      ...result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch dictionary entries', message: err.message });
  }
}

export async function lookupWord(req, res) {
  try {
    const { word } = req.params;
    const { lang } = req.query;

    const item = await dictionaryService.lookupWord(word, { lang });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Word not found',
        message: `No dictionary entry found for '${word}'. Try searching with /dictionary/search?q=${encodeURIComponent(word)} or use /translation/translate for phrase translation.`
      });
    }

    res.json({
      success: true,
      data: item,
      ...item
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to lookup word', message: err.message });
  }
}

export async function getEntryById(req, res) {
  try {
    const { id } = req.params;
    const { lang } = req.query;

    const item = await dictionaryService.getEntryById(id, { lang });
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Entry not found',
        message: `No dictionary entry with ID '${id}' exists.`
      });
    }

    res.json({
      success: true,
      data: item,
      ...item
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch entry by ID', message: err.message });
  }
}

export async function getDailyWord(req, res) {
  try {
    const { date, lang } = req.query;
    const item = await dictionaryService.getDailyWord(date ? { date, lang } : lang);
    res.json({
      success: true,
      data: item,
      ...item
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch daily word', message: err.message });
  }
}

export async function getRandomWord(req, res) {
  try {
    const { lang, category } = req.query;
    const item = await dictionaryService.getRandomWord({ lang, category });
    res.json({
      success: true,
      data: item,
      ...item
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch random word', message: err.message });
  }
}

export async function getAutocomplete(req, res) {
  try {
    const { q, query, prefix, limit } = req.query;
    const search = q || query || prefix;
    if (!search || !search.trim()) {
      return res.json({ success: true, suggestions: [], query: '' });
    }

    const suggestions = await dictionaryService.getAutocomplete(search, { limit: Number(limit) || 8 });
    res.json({
      success: true,
      query: search,
      suggestions,
      count: suggestions.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch autocomplete suggestions', message: err.message });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await dictionaryService.getCategories();
    res.json({
      success: true,
      categories,
      total: categories.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories', message: err.message });
  }
}

export async function getPartsOfSpeech(req, res) {
  try {
    const pos = await dictionaryService.getPartsOfSpeech();
    res.json({
      success: true,
      partsOfSpeech: pos,
      total: pos.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch parts of speech', message: err.message });
  }
}

export async function getStats(req, res) {
  try {
    const stats = await dictionaryService.getStats();
    res.json({
      success: true,
      stats,
      ...stats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch dictionary stats', message: err.message });
  }
}
