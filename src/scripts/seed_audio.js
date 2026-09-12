import https from 'https';
import http from 'http';
import { getDb, quranDb } from '../db/connection.js';

const reciter = 'Alafasy_128kbps';
const baseUrl = `https://everyayah.com/data/${reciter}`;

async function fetchAudioBuffer(surah, ayah) {
    const s = String(surah).padStart(3, '0');
    const a = String(ayah).padStart(3, '0');
    const url = `${baseUrl}/${s}${a}.mp3`;

    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { rejectUnauthorized: false }, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to fetch ${url}. Status code: ${res.statusCode}`));
            }

            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
    });
}

async function seedSurah(surahNumber) {
    console.log(`Starting seed for Surah ${surahNumber}...`);
    // Query the surahs table for verses count
    const surah = await quranDb.get('SELECT verses_count as count FROM surahs WHERE id = ?', [surahNumber]);
    const versesCount = surah ? surah.count : 0;

    if (versesCount === 0) {
        console.log(`No verses found in DB for Surah ${surahNumber}. Ensure quran data is seeded first.`);
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (let ayah = 1; ayah <= versesCount; ayah++) {
        try {
            // Check if already seeded
            const existing = await quranDb.get('SELECT 1 FROM ayah_audio WHERE surah_number = ? AND verse_number = ? AND reciter = ?', [surahNumber, ayah, reciter]);
            if (existing) {
                console.log(`[Skipped] Surah ${surahNumber} Ayah ${ayah} already seeded.`);
                continue;
            }

            console.log(`[Fetching] Surah ${surahNumber} Ayah ${ayah}...`);
            const audioBuffer = await fetchAudioBuffer(surahNumber, ayah);

            await quranDb.run(
                'INSERT OR IGNORE INTO ayah_audio (surah_number, verse_number, reciter, audio_data) VALUES (?, ?, ?, ?)',
                [surahNumber, ayah, reciter, audioBuffer]
            );
            console.log(`[Success] Seeded Surah ${surahNumber} Ayah ${ayah}`);
            successCount++;

            // Optional delay to avoid ratelimits if running full quran
            await new Promise(res => setTimeout(res, 200));

        } catch (err) {
            console.error(`[Error] Failed on Surah ${surahNumber} Ayah ${ayah}:`, err.message);
            failCount++;
        }
    }

    console.log(`Finished seeding Surah ${surahNumber}. Success: ${successCount}, Failed: ${failCount}\n`);
}

async function runSeeder() {
    try {
        console.log("Initializing database connection...");
        await getDb(); // Initializes quranDb

        // Seed Surah 1 and Surah 6 as requested by the user endpoint
        for (const target of [1, 6]) {
            await seedSurah(target);
        }

        console.log("Seeding complete. You can run this script to seed other Surahs later.");
        process.exit(0);
    } catch (e) {
        console.error("Seeding failed:");
        console.error(e);
        process.exit(1);
    }
}

runSeeder();
