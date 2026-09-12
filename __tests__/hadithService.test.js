import { initDatabases } from '../src/db/connection.js';
import * as service from '../src/services/hadithService.js';

describe('hadithService', () => {
  beforeAll(async () => {
    await initDatabases();
  });

  test('daily hadith returns same value on repeated calls', async () => {
    const first = await service.getDailyHadith();
    const second = await service.getDailyHadith();
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(second.id).toBe(first.id);
  });

  test('overrideDailyHadith updates today record', async () => {
    const random = await service.getDailyHadith();
    const fakeId = random.id || 1;
    await service.overrideDailyHadith(fakeId, 'admin');
    const over = await service.getDailyHadith();
    expect(over.id).toBe(fakeId);
  });
});