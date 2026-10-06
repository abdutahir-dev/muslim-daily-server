import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/db/connection.js', () => ({
  duaDb: {
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn(),
  },
  deenbotDb: {
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn(),
  },
  initDatabases: jest.fn(),
}));

describe('duaService', () => {
  let service;
  let duaDb;
  let deenbotDb;

  beforeAll(async () => {
    service = await import('../src/services/duaService.js');
    const conn = await import('../src/db/connection.js');
    duaDb = conn.duaDb;
    deenbotDb = conn.deenbotDb;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('daily dua returns same value on repeated calls', async () => {
    deenbotDb.get.mockResolvedValueOnce({ content_id: 1 });
    duaDb.get.mockResolvedValueOnce({ id: 1, title_en: 'Dua 1' });

    const first = await service.getDailyDua();
    expect(first).toBeDefined();
    expect(first.id).toBe(1);

    deenbotDb.get.mockResolvedValueOnce({ content_id: 1 });
    duaDb.get.mockResolvedValueOnce({ id: 1, title_en: 'Dua 1' });

    const second = await service.getDailyDua();
    expect(second).toBeDefined();
    expect(second.id).toBe(first.id);
  });

  test('overrideDailyDua updates today record', async () => {
    deenbotDb.run.mockResolvedValueOnce();
    await service.overrideDailyDua(2, 'admin');
    expect(deenbotDb.run).toHaveBeenCalledTimes(1);
    expect(deenbotDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO daily_content'),
      expect.arrayContaining(['dua', 2, expect.any(String), 'admin'])
    );
  });

  test('getDuaById retrieves correct dua', async () => {
    duaDb.get.mockResolvedValueOnce({ id: 1, title_en: 'Test Dua' });
    const dua = await service.getDuaById(1);
    expect(dua).toBeDefined();
    expect(dua.id).toBe(1);
    expect(typeof dua.title_en).toBe('string');
    expect(duaDb.get).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM duas WHERE id = ?'), [1]);
  });

  test('listDuas retrieves a list of duas', async () => {
    duaDb.all.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    const duas = await service.listDuas();
    expect(duas).toBeDefined();
    expect(Array.isArray(duas)).toBe(true);
    expect(duas.length).toBeGreaterThan(0);
    expect(duaDb.all).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM duas LIMIT ? OFFSET ?'), [20, 0]);
  });
});
