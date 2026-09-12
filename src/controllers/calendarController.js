import { getDb } from '../db/connection.js';
import * as cal from '../utils/calendarUtils.js';
import Holidays from 'date-holidays';

// --- Conversions ---
export const convert = async (req, res) => {
    try {
        const { from, to, date, options } = req.body;
        const result = cal.convertDate({ from, to, date, options });
        res.json({ success: true, result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

export const convertBulk = async (req, res) => {
    try {
        const { from, to, startDate, endDate } = req.body;
        const result = cal.bulkConvert({ from, to, startDate, endDate });
        res.json({ success: true, result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// --- Holidays ---
export const listHolidays = async (req, res) => {
    try {
        const { country, year, system } = req.query;
        const db = await getDb();

        let dynamicHolidays = [];
        if (country && year) {
            try {
                const hd = new Holidays(country.toUpperCase());
                const publicHolidays = hd.getHolidays(year) || [];
                dynamicHolidays = publicHolidays.map(ph => ({
                    id: `ph_${ph.date}`,
                    country_code: country.toUpperCase(),
                    name: ph.name,
                    date: ph.date.split(' ')[0], // normalize to YYYY-MM-DD
                    is_official: ph.type === 'public' ? 1 : 0
                }));
            } catch (e) {
                console.error("Error resolving date-holidays", e);
            }
        }

        let sql = 'SELECT * FROM holidays WHERE 1=1';
        const params = [];
        if (country) {
            sql += ' AND country_code = ?';
            params.push(country.toUpperCase());
        }
        if (year) {
            sql += ' AND date LIKE ?';
            params.push(`${year}-%`);
        }
        const dbRows = await db.all(sql, params);

        // combine dynamic with db overrides
        const combined = [...dynamicHolidays, ...dbRows];

        res.json({ success: true, holidays: combined });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const addHoliday = async (req, res) => {
    try {
        const { country_code, name, date, movable = 0, rule, system_id } = req.body;
        const db = await getDb();
        const stmt = await db.run(
            `INSERT INTO holidays(country_code,name,date,movable,rule,system_id) VALUES(?,?,?,?,?,?)`,
            [country_code.toUpperCase(), name, date, movable ? 1 : 0, rule || null, system_id || null]
        );
        res.json({ success: true, id: stmt.lastID });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const { country_code, name, date, movable, rule, system_id } = req.body;
        const db = await getDb();
        await db.run(
            `UPDATE holidays SET country_code=?, name=?, date=?, movable=?, rule=?, system_id=? WHERE id=?`,
            [country_code.toUpperCase(), name, date, movable ? 1 : 0, rule || null, system_id || null, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        await db.run(`DELETE FROM holidays WHERE id=?`, [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- Calendars ---
export const listCalendars = async (req, res) => {
    try {
        const user_id = req.user?.id || req.query.user_id; // Support both auth middleware and query for now
        const db = await getDb();
        const rows = await db.all('SELECT * FROM calendars WHERE user_id=?', [user_id]);
        res.json({ success: true, calendars: rows });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const addCalendar = async (req, res) => {
    try {
        const user_id = req.user?.id || req.body.user_id;
        const { name, system_id, color, is_default } = req.body;
        const db = await getDb();
        const stmt = await db.run(
            `INSERT INTO calendars(user_id, name, system_id, color, is_default) VALUES(?,?,?,?,?)`,
            [user_id, name, system_id, color, is_default || 0]
        );
        res.json({ success: true, id: stmt.lastID });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const updateCalendar = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, system_id, color, is_default } = req.body;
        const db = await getDb();
        await db.run(
            `UPDATE calendars SET name=?, system_id=?, color=?, is_default=?, updated_at=datetime('now') WHERE id=?`,
            [name, system_id, color, is_default || 0, id]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const deleteCalendar = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        await db.run(`DELETE FROM calendars WHERE id=?`, [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// --- Events ---
export const listEvents = async (req, res) => {
    try {
        const { calendar_id, start, end } = req.query;
        const db = await getDb();
        let sql = 'SELECT * FROM events WHERE 1=1';
        const params = [];
        if (calendar_id) {
            sql += ' AND calendar_id=?'; params.push(calendar_id);
        }
        if (start) {
            sql += ' AND start_ts>=?'; params.push(start);
        }
        if (end) {
            sql += ' AND start_ts<=?'; params.push(end);
        }
        const rows = await db.all(sql, params);
        res.json({ success: true, events: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const addEvent = async (req, res) => {
    try {
        const { calendar_id, title, start_ts, end_ts, description, location, recurrence_rule, priority, all_day, category_id } = req.body;
        const db = await getDb();
        const stmt = await db.run(
            `INSERT INTO events(calendar_id,title,start_ts,end_ts,description,location,recurrence_rule,priority,all_day,category_id) VALUES(?,?,?,?,?,?,?,?,?,?)`,
            [calendar_id, title, start_ts, end_ts, description, location, recurrence_rule, priority || 0, all_day || 0, category_id || null]
        );
        res.json({ success: true, id: stmt.lastID });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, start_ts, end_ts, description, location, recurrence_rule, priority, all_day, category_id } = req.body;
        const db = await getDb();
        await db.run(`UPDATE events SET title=?, start_ts=?, end_ts=?, description=?, location=?, recurrence_rule=?, priority=?, all_day=?, category_id=?, updated_at=datetime('now') WHERE id=?`,
            [title, start_ts, end_ts, description, location, recurrence_rule, priority || 0, all_day || 0, category_id || null, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        await db.run(`DELETE FROM events WHERE id=?`, [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- Tasks ---
export const listTasks = async (req, res) => {
    try {
        const user_id = req.user?.id || req.query.user_id;
        const db = await getDb();
        let sql = 'SELECT * FROM tasks WHERE 1=1';
        const params = [];
        if (user_id) { sql += ' AND user_id=?'; params.push(user_id); }
        const rows = await db.all(sql, params);
        res.json({ success: true, tasks: rows });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const addTask = async (req, res) => {
    try {
        const user_id = req.user?.id || req.body.user_id;
        const { description, due_ts, recurrence_rule, priority, category } = req.body;
        const db = await getDb();
        const stmt = await db.run(`INSERT INTO tasks(user_id,description,due_ts,recurrence_rule,priority,category) VALUES(?,?,?,?,?,?)`,
            [user_id, description, due_ts, recurrence_rule, priority || 0, category || null]);
        res.json({ success: true, id: stmt.lastID });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, due_ts, completed, recurrence_rule, priority, category } = req.body;
        const db = await getDb();
        await db.run(`UPDATE tasks SET description=?, due_ts=?, completed=?, recurrence_rule=?, priority=?, category=?, updated_at=datetime('now') WHERE id=?`,
            [description, due_ts, completed ? 1 : 0, recurrence_rule, priority || 0, category || null, id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        await db.run(`DELETE FROM tasks WHERE id=?`, [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// --- Notes ---
export const listNotes = async (req, res) => {
    try {
        const user_id = req.user?.id || req.query.user_id;
        const db = await getDb();
        const rows = await db.all('SELECT * FROM notes WHERE user_id=?', [user_id]);
        res.json({ success: true, notes: rows });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const addNote = async (req, res) => {
    try {
        const user_id = req.user?.id || req.body.user_id;
        const { title, content, is_pinned } = req.body;
        const db = await getDb();
        const stmt = await db.run(`INSERT INTO notes(user_id,title,content,is_pinned) VALUES(?,?,?,?)`,
            [user_id, title, content, is_pinned || 0]);
        res.json({ success: true, id: stmt.lastID });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, is_pinned } = req.body;
        const db = await getDb();
        await db.run(`UPDATE notes SET title=?, content=?, is_pinned=?, update_ts=datetime('now') WHERE id=?`,
            [title, content, is_pinned || 0, id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        await db.run(`DELETE FROM notes WHERE id=?`, [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

// --- Sync ---
export const pushSync = async (req, res) => {
    try {
        const user_id = req.user?.id || req.body.user_id;
        const { client_id, mutations } = req.body;
        const db = await getDb();

        await db.run('BEGIN TRANSACTION');
        for (const m of mutations) {
            await db.run(
                `INSERT INTO sync_logs(user_id, client_id, entity_type, entity_id, operation, payload) VALUES(?,?,?,?,?,?)`,
                [user_id, client_id, m.entity_type, m.entity_id, m.operation, JSON.stringify(m.payload)]
            );
            // In a full implementation, apply the mutations to their respective tables here
        }
        await db.run('COMMIT');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const pullSync = async (req, res) => {
    try {
        const user_id = req.user?.id || req.query.user_id;
        const { since } = req.query;
        const db = await getDb();

        let sql = 'SELECT * FROM sync_logs WHERE user_id=?';
        const params = [user_id];
        if (since) {
            sql += ' AND timestamp > ?';
            params.push(since);
        }
        const rows = await db.all(sql, params);
        res.json({ success: true, logs: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
