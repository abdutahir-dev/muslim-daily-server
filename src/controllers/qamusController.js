import * as qamusService from '../services/qamusService.js';

export const getInfo = async (req, res) => {
  try {
    const info = await qamusService.getQamusInfo();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load Qamus information', message: err.message });
  }
};

export const getEntries = async (req, res) => {
  try {
    const { page, limit, section, category, root, search, letter } = req.query;
    const result = await qamusService.getEntries({ page, limit, section, category, root, search, letter });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch lexicon entries', message: err.message });
  }
};

export const getEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await qamusService.getEntryById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Lexicon entry not found', id });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch lexicon entry', message: err.message });
  }
};

export const search = async (req, res) => {
  try {
    const { q, query, section, limit } = req.query;
    const searchQuery = q || query || '';
    const result = await qamusService.searchQamus(searchQuery, { section, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', message: err.message });
  }
};

export const getRoots = async (req, res) => {
  try {
    const { page, limit, search, letter } = req.query;
    const result = await qamusService.getRoots({ page, limit, search, letter });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch roots', message: err.message });
  }
};

export const getRootEntries = async (req, res) => {
  try {
    const { root } = req.params;
    const result = await qamusService.getEntriesByRoot(root);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch entries for root', message: err.message });
  }
};

export const getSections = async (req, res) => {
  try {
    const sections = await qamusService.getSections();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch sections', message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await qamusService.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch categories', message: err.message });
  }
};

export const getCategoryEntries = async (req, res) => {
  try {
    const { category } = req.params;
    const { page, limit } = req.query;
    const result = await qamusService.getEntriesByCategory(category, { page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch category entries', message: err.message });
  }
};

export const getAyahVocabulary = async (req, res) => {
  try {
    const { ref, surah, ayah } = req.params;
    const ayahRef = ref || (surah && ayah ? `${surah}:${ayah}` : null);
    if (!ayahRef) {
      return res.status(400).json({ error: 'Ayah reference required (e.g. 1:1 or surah 1 ayah 1)' });
    }
    const result = await qamusService.getAyahVocabulary(ayahRef);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch Ayah vocabulary', message: err.message });
  }
};

export const getDailyWord = async (req, res) => {
  try {
    const { date } = req.query;
    const daily = await qamusService.getDailyWord(date);
    res.json(daily);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch daily word', message: err.message });
  }
};

export const getRandomWord = async (req, res) => {
  try {
    const { section } = req.query;
    const word = await qamusService.getRandomWord({ section });
    res.json(word);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch random word', message: err.message });
  }
};

export const getGrammarOntology = async (req, res) => {
  try {
    const ontology = qamusService.getGrammarOntology();
    res.json(ontology);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch grammar ontology', message: err.message });
  }
};

export const getManifest = async (req, res) => {
  try {
    const manifest = qamusService.getManifest();
    res.json(manifest);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch manifest', message: err.message });
  }
};
