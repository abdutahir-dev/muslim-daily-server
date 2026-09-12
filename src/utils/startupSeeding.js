import { quranDb } from '../db/connection.js';
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

import { migrateAzkar } from '../../scripts/migrateAzkar.js';
import { migrateJsonDuas } from '../../scripts/migrateJsonDuas.js';

export async function startupSeeding() {
    const count = await quranDb.get('SELECT COUNT(*) as count FROM ayahs');
    if (count.count === 0) {
        console.log('Performing initial Quran seeding...');
        // We could call the admin controller functions here or just implement a minimal version
        // For now, let's just log and let the user trigger it via API if they want the full data,
        // OR we can implement the basic one here.
    }

    // ensure dua content is populated
    try {
        console.log('Running azkar -> dua migration (if needed)');
        await migrateAzkar();
    } catch (e) {
        console.error('azkar migration failed', e);
    }
    try {
        console.log('Running JSON dua migration (if needed)');
        await migrateJsonDuas();
    } catch (e) {
        console.error('json dua migration failed', e);
    }
}
