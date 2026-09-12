import https from 'https';
import http from 'http';
import { quranDb } from '../db/connection.js';

/**
 * GET /api/audio/:surahId/:ayahId?reciter=...
 * Serves MP3 audio from local SQLite Database if available.
 * If not, fetches from everyayah.com, proxies to client, and asynchronously caches it.
 */
export const streamAudio = async (req, res) => {
    const { surahId, ayahId } = req.params;
    let reciter = req.query.reciter || 'Alafasy_128kbps';

    // Map old names if necessary
    if (reciter === 'Mishari_Rashid_Alafasy_24kbps') {
        reciter = 'Alafasy_128kbps';
    }

    try {
        const cached = await quranDb.get(
            'SELECT audio_data FROM ayah_audio WHERE surah_number = ? AND verse_number = ? AND reciter = ?',
            [parseInt(surahId), parseInt(ayahId), reciter]
        );

        if (cached && cached.audio_data) {
            const audioBuffer = cached.audio_data;
            const fileSize = audioBuffer.length;
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                if (start >= fileSize) {
                    res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                    return;
                }

                const chunksize = (end - start) + 1;
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'audio/mpeg',
                    'Cache-Control': 'public, max-age=86400'
                });
                res.end(audioBuffer.slice(start, end + 1));
            } else {
                res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Type': 'audio/mpeg',
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': 'public, max-age=86400'
                });
                res.end(audioBuffer);
            }
            return;
        }
    } catch (e) {
        console.error('[audioController] Error querying cached audio:', e.message);
    }

    // Fallback to proxying from everyayah.com
    const s = String(surahId).padStart(3, '0');
    const a = String(ayahId).padStart(3, '0');
    const upstreamUrl = `https://everyayah.com/data/${encodeURIComponent(reciter)}/${s}${a}.mp3`;

    const client = upstreamUrl.startsWith('https') ? https : http;

    const upstreamReq = client.get(upstreamUrl, { rejectUnauthorized: false }, (upstreamRes) => {
        if (upstreamRes.statusCode !== 200) {
            res.status(upstreamRes.statusCode ?? 502).json({ error: 'Upstream audio not found' });
            upstreamRes.resume();
            return;
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        if (upstreamRes.headers['content-length']) {
            res.setHeader('Content-Length', upstreamRes.headers['content-length']);
        }
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=86400');

        const chunks = [];
        upstreamRes.on('data', chunk => chunks.push(chunk));

        upstreamRes.pipe(res);

        upstreamRes.on('end', async () => {
            const audioBuffer = Buffer.concat(chunks);
            try {
                await quranDb.run(
                    'INSERT OR IGNORE INTO ayah_audio (surah_number, verse_number, reciter, audio_data) VALUES (?, ?, ?, ?)',
                    [parseInt(surahId), parseInt(ayahId), reciter, audioBuffer]
                );
                console.log(`[audioController] Cached audio for ${surahId}:${ayahId} (${reciter})`);
            } catch (dbErr) {
                console.error('[audioController] Failed to cache audio:', dbErr.message);
            }
        });
    });

    upstreamReq.on('error', (err) => {
        console.error('[audioController] upstream error:', err.message);
        if (!res.headersSent) {
            res.status(502).json({ error: 'Failed to fetch audio from upstream' });
        }
    });

    req.on('close', () => upstreamReq.destroy());
};
