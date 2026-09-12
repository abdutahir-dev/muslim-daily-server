import { deenbotDb, prayersDb } from '../db/connection.js';
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export const getPrayerTimes = async (req, res) => {
    const { city = 'Addis Ababa', country = 'Ethiopia', method = 2, date = new Date().toISOString().split('T')[0].split('-').reverse().join('-') } = req.query;
    console.log("Query : ", req.query)

    let newDate = date;

    if (newDate.split('-')[0].length > 2) {
        console.log("Date : ", newDate)
        newDate = newDate.split('-').reverse().join('-');
        console.log("New Date : ", newDate)
    }

    try {

        const local = await prayersDb.get(
            'SELECT fajr as Fajr, sunrise as Sunrise, dhuhr as Dhuhr, asr as Asr, maghrib as Maghrib, isha as Isha FROM prayer_timings WHERE city = ? AND country = ? AND method = ? AND date = ?',
            [city, country, parseInt(method), newDate]
        );

        if (local) return res.json(local);

        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${newDate}?city=${city}&country=${country}&method=${method}`, { agent });
        const data = await response.json();

        if (data?.data?.timings) {
            res.json(data.data.timings);
        } else {
            res.status(502).json({ error: 'Invalid response from prayer times provider' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch prayer times', message: err.message });
    }
};

export const getWeeklyPrayerTimes = async (req, res) => {
    const { weekStart } = req.params;
    try {
        const weeklyData = await prayersDb.all(`
            SELECT fajr, sunrise, dhuhr, asr, maghrib, isha 
            FROM prayer_timings 
            WHERE date >= ? AND date <= date(?, '+6 days')
            ORDER BY date ASC
        `, [weekStart, weekStart]);
        res.json(weeklyData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch weekly prayer times' });
    }
};



export const getPrayerStatus = async (req, res) => {
    const { username, date } = req.params;
    try {
        const logs = await deenbotDb.all('SELECT prayer_name, status, prayed_as, prayer_type FROM prayer_logs WHERE username = ? AND date = ?', [username, date]);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch prayer status' });
    }
};

export const updatePrayerLog = async (req, res) => {
    const { username, date, prayer_name, status, prayed_as, prayer_type = 'fard' } = req.body;
    try {
        const existing = await deenbotDb.get(
            'SELECT id, status FROM prayer_logs WHERE username = ? AND date = ? AND prayer_name = ? AND prayer_type = ?',
            [username, date, prayer_name, prayer_type]
        );

        if (existing) {
            // If toggling without specific status
            const nextStatus = status !== undefined ? status : (existing.status === 1 ? 0 : 1);
            await deenbotDb.run(
                'UPDATE prayer_logs SET status = ?, prayed_as = ? WHERE id = ?',
                [nextStatus, prayed_as, existing.id]
            );
            res.json({ success: true, status: nextStatus });
        } else {
            const nextStatus = status !== undefined ? status : 1;
            await deenbotDb.run(
                'INSERT INTO prayer_logs (username, date, prayer_name, status, prayed_as, prayer_type) VALUES (?, ?, ?, ?, ?, ?)',
                [username, date, prayer_name, nextStatus, prayed_as, prayer_type]
            );
            res.json({ success: true, status: nextStatus });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update prayer log' });
    }
};

export const togglePrayer = async (req, res) => {
    // Keep for backward compatibility or simpler toggles
    return updatePrayerLog(req, res);
};

export const getWeeklyStats = async (req, res) => {
    const { username } = req.params;
    try {
        const weeklyData = await deenbotDb.all(`
      SELECT date, COUNT(*) as completed_count 
      FROM prayer_logs 
      WHERE username = ? AND status = 1 
      AND date >= date('now', '-7 days')
      GROUP BY date
      ORDER BY date DESC
    `, [username]);
        res.json(weeklyData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch weekly stats' });
    }
};

export const getMonthlyStats = async (req, res) => {
    const { username, month } = req.params;
    try {
        const monthlyData = await deenbotDb.all(`
      SELECT date, COUNT(*) as completed_count 
      FROM prayer_logs 
      WHERE username = ? AND status = 1 
      AND date LIKE ?
      GROUP BY date
      ORDER BY date ASC
    `, [username, `${month}-%`]);
        res.json(monthlyData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch monthly stats' });
    }
};
export const getAdvancedAnalysis = async (req, res) => {
    const { username } = req.params;
    try {
        const breakdown = await deenbotDb.all(`
            SELECT prayed_as, COUNT(*) as count 
            FROM prayer_logs 
            WHERE username = ? AND status = 1 AND prayer_type = 'fard'
            GROUP BY prayed_as
        `, [username]);

        const sunnahStats = await deenbotDb.all(`
            SELECT prayer_type, COUNT(*) as count 
            FROM prayer_logs 
            WHERE username = ? AND status = 1 AND (prayer_type LIKE 'sunnah%' OR prayer_type = 'witr')
            GROUP BY prayer_type
        `, [username]);

        const registry = await deenbotDb.all(`
            SELECT prayer_name, COUNT(*) as missed_count 
            FROM prayer_logs 
            WHERE username = ? AND (status = 0 OR prayed_as = 'missed') AND prayer_type = 'fard'
            GROUP BY prayer_name
        `, [username]);

        res.json({ breakdown, sunnahStats, registry });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch advanced analysis' });
    }
};

export const getQadaStats = async (req, res) => {
    const { username } = req.params;
    try {
        const qadaLogs = await deenbotDb.all(`
            SELECT prayer_name, COUNT(*) as count 
            FROM prayer_logs 
            WHERE username = ? AND prayed_as = 'qada'
            GROUP BY prayer_name
        `, [username]);
        res.json(qadaLogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch Qada stats' });
    }
};
