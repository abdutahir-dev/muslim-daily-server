import { initDatabases, deenbotDb } from '../src/db/connection.js';
import * as service from '../src/services/analyticsService.js';

describe('analyticsService', () => {
  beforeAll(async () => {
    await initDatabases();
    // insert a couple of sample activities
    await deenbotDb.run(`INSERT OR IGNORE INTO users(username,email,password) VALUES ('testuser','t@x.com','pass')`);
    await deenbotDb.run(`INSERT INTO user_activities (username,type,value,metadata,timestamp) VALUES ('testuser','read_hadith','1','{"category":"knowledge"}', date('now','-1 day'))`);
    await deenbotDb.run(`INSERT INTO user_activities (username,type,value,metadata,timestamp) VALUES ('testuser','bookmark_added','2','{"category":"wisdom"}', date('now'))`);
  });

  test('getSummary returns counts', async () => {
    const summary = await service.getSummary('testuser', 'weekly');
    expect(Array.isArray(summary)).toBe(true);
    expect(summary.length).toBeGreaterThan(0);
  });

  test('getReadingStreak returns a number', async () => {
    const streak = await service.getReadingStreak('testuser');
    expect(typeof streak).toBe('number');
  });

  test('topCategories returns categories counts', async () => {
    const top = await service.topCategories('testuser', 'monthly', 5);
    expect(Array.isArray(top)).toBe(true);
    expect(top.some(r => r.category === 'knowledge' || r.category === 'wisdom')).toBe(true);
  });
});