import * as service from '../services/duaService.js';

export const listDuas = async (req, res) => {
  try {
    const { page, limit, category, q } = req.query;
    const data = await service.listDuas({ page: parseInt(page) || 1, limit: parseInt(limit) || 20, category, q });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list duas' });
  }
};

export const listCategories = async (req, res) => {
  try {
    const cats = await service.listCategories();
    res.json(cats);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load categories' });
  }
};

export const getDua = async (req, res) => {
  try {
    const { id } = req.params;
    const dua = await service.getDuaById(id);
    if (!dua) return res.status(404).json({ error: 'Dua not found' });
    res.json(dua);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load dua' });
  }
};

export const getRandomDua = async (req, res) => {
  try {
    const dua = await service.getRandomDua();
    if (!dua) return res.status(404).json({ error: 'Dua not found' });
    res.json(dua);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load dua' });
  }
};

export const createDua = async (req, res) => {
  try {
    const dua = req.body;
    const result = await service.createDua(dua);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create dua' });
  }
};

export const updateDua = async (req, res) => {
  try {
    const { id } = req.params;
    await service.updateDua(id, req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update dua' });
  }
};

export const deleteDua = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteDua(id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete dua' });
  }
};

export const getDaily = async (req, res) => {
  try {
    const dua = await service.getDailyDua();
    res.json(dua);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load daily dua' });
  }
};

export const overrideDaily = async (req, res) => {
  try {
    const { duaId } = req.body;
    await service.overrideDailyDua(duaId, req.user.username);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to override daily dua' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const duaCategory = await service.getDuaCategoryById(id);
    if (!duaCategory) return res.status(404).json({ error: 'Dua not found' });
    res.json(duaCategory);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load dua' });
  }
}
