import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/services/duaService.js', () => ({
  getDuaById: jest.fn(),
}));

describe('duaController', () => {
  let duaController;
  let duaService;

  beforeAll(async () => {
    duaService = await import('../src/services/duaService.js');
    duaController = await import('../src/controllers/duaController.js');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getDua', () => {
    it('should return 404 if dua is not found', async () => {
      duaService.getDuaById.mockResolvedValue(null);

      const req = { params: { id: 'missing-id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await duaController.getDua(req, res);

      expect(duaService.getDuaById).toHaveBeenCalledWith('missing-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Dua not found' });
    });

    it('should return 200 and the dua if found', async () => {
      const mockDua = { id: 'some-id', content: 'test dua' };
      duaService.getDuaById.mockResolvedValue(mockDua);

      const req = { params: { id: 'some-id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await duaController.getDua(req, res);

      expect(duaService.getDuaById).toHaveBeenCalledWith('some-id');
      expect(res.json).toHaveBeenCalledWith(mockDua);
    });

    it('should return 500 if an error is thrown', async () => {
      duaService.getDuaById.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: 'some-id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await duaController.getDua(req, res);

      expect(duaService.getDuaById).toHaveBeenCalledWith('some-id');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to load dua' });
    });
  });
});
