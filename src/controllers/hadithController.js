import * as service from '../services/hadithService.js';

export const getEditions = async (req, res) => {
  try {
    const editions = await service.listEditions();
    res.json(editions);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load editions' });
  }
};

export const getSections = async (req, res) => {
  try {
    const { editionId } = req.params;
    const sections = await service.listSectionsForEdition(editionId);
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load sections' });
  }
};

export const getHadiths = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const hadiths = await service.listHadithsForSection(sectionId, parseInt(page), parseInt(limit));
    res.json(hadiths);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load hadiths' });
  }
};

export const getHadithsBySection = async (req, res) => {
  try {
    const { editionId, sectionId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const hadiths = await service.listHadithsBySection(sectionId, editionId, parseInt(page), parseInt(limit));
    res.json(hadiths);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load hadiths' });
  }
};

export const getHadithsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const hadiths = await service.listHadithsForBook(
      parseInt(bookId, 10),
      parseInt(page, 10),
      parseInt(limit, 10)
    );
    res.json(hadiths);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load hadiths' });
  }
};

export const getHadith = async (req, res) => {
  try {
    const { id } = req.params;
    const hadith = await service.getHadithById(id);
    if (!hadith) return res.status(404).json({ error: 'Hadith not found' });
    res.json(hadith);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load hadith' });
  }
};

export const getDaily = async (req, res) => {
  try {
    const hadith = await service.getDailyHadith();
    res.json(hadith);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load daily hadith' });
  }
};

export const postOverrideDaily = async (req, res) => {
  try {
    const { hadithId } = req.body;
    await service.overrideDailyHadith(hadithId, req.user.username);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Unable to override daily hadith' });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await service.listBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load hadith Books' });
  }
}

export const getHadithByBook = async (req, res) => {
  try {
    const { id } = req.params;
    const hadith = await service.getHadithByBook(id);
    if (!hadith) return res.status(404).json({ error: 'Hadith not found' });
    res.json(hadith);
  } catch (err) {
    res.status(500).json({ error: 'Unable to load hadith' });
  }
}

export const searchHadiths = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 20, grade = '', source = '', narrator = '' } = req.query;
    const result = await service.searchHadiths({
      query: q,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      grade,
      source,
      narrator
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Unable to search hadiths' });
  }
};
