import { deenbotDb } from '../db/connection.js';

const favoritesSchemaCache = {
    checked: false,
    legacy: false
};

const detectFavoritesSchema = async () => {
    if (favoritesSchemaCache.checked) {
        return favoritesSchemaCache.legacy ? 'legacy' : 'modern';
    }

    const columns = await deenbotDb.all('PRAGMA table_info(favorites)');
    const names = new Set(columns.map((c) => c.name));
    const isLegacy = names.has('sub_id') && names.has('ftype') && names.has('content');
    favoritesSchemaCache.checked = true;
    favoritesSchemaCache.legacy = isLegacy;
    return isLegacy ? 'legacy' : 'modern';
};

export const getSettings = async (req, res) => {
    try {
        const user = await deenbotDb.get('SELECT settings FROM users WHERE username = ?', [req.params.username]);
        res.json(user ? JSON.parse(user.settings) : {});
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const updateSettings = async (req, res) => {
    const { username, settings } = req.body;
    try {
        await deenbotDb.run('UPDATE users SET settings = ? WHERE username = ?', [JSON.stringify(settings || {}), username]);
        res.json({ success: true, settings });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const updateLocation = async (req, res) => {
    const { username, location } = req.body;
    try {
        const user = await deenbotDb.get('SELECT settings FROM users WHERE username = ?', [username]);
        let settings = JSON.parse(user?.settings || '{}');
        settings.location = location;
        await deenbotDb.run('UPDATE users SET settings = ? WHERE username = ?', [JSON.stringify(settings), username]);
        res.json({ success: true, settings });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

export const getBookmarks = async (req, res) => {
    try {
        // prefer normalized table
        const rows = await deenbotDb.all('SELECT item_type as type, item_id as id, created_at FROM bookmarks WHERE username = ?', [req.params.username]);
        return res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
};

export const toggleBookmark = async (req, res) => {
    const { username, item_type, item_id } = req.body;
    try {
        // check existing
        const existing = await deenbotDb.get(
            'SELECT id FROM bookmarks WHERE username = ? AND item_type = ? AND item_id = ?',
            [username, item_type, item_id]
        );
        let action;
        if (existing) {
            await deenbotDb.run('DELETE FROM bookmarks WHERE id = ?', [existing.id]);
            action = 'removed';
        } else {
            await deenbotDb.run(
                'INSERT INTO bookmarks (username,item_type,item_id) VALUES (?,?,?)',
                [username, item_type, item_id]
            );
            action = 'added';
        }
        // log user activity
        await deenbotDb.run(
            'INSERT INTO user_activities (username, type, value, timestamp) VALUES (?,?,?,datetime("now"))',
            [username, 'bookmark_' + action, JSON.stringify({ item_type, item_id }),]
        );
        const rows = await deenbotDb.all('SELECT item_type as type, item_id as id FROM bookmarks WHERE username = ?', [username]);
        res.json({ success: true, action, bookmarks: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
};

export const deleteBookmark = async (req, res) => {
    const { username, item_type, item_id } = req.body;
    try {
        await deenbotDb.run('DELETE FROM bookmarks WHERE username = ? AND item_type = ? AND item_id = ?', [username, item_type, item_id]);
        const rows = await deenbotDb.all('SELECT item_type as type, item_id as id FROM bookmarks WHERE username = ?', [username]);
        res.json({ success: true, bookmarks: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const schema = await detectFavoritesSchema();
        const rows = schema === 'legacy'
            ? await deenbotDb.all(
                'SELECT ftype as type, content as id, added_on as created_at FROM favorites WHERE sub_id = ?',
                [req.params.username]
            )
            : await deenbotDb.all(
                'SELECT item_type as type, item_id as id, created_at FROM favorites WHERE username = ?',
                [req.params.username]
            );

        const normalized = rows.map((row) => ({
            ...row,
            id: Number.isNaN(Number(row.id)) ? row.id : Number(row.id)
        }));
        res.json(normalized);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
};

export const toggleFavorite = async (req, res) => {
    const { username, item_type, item_id } = req.body;
    try {
        const schema = await detectFavoritesSchema();
        const existing = schema === 'legacy'
            ? await deenbotDb.get(
                'SELECT _id as id FROM favorites WHERE sub_id = ? AND ftype = ? AND content = ?',
                [username, item_type, String(item_id)]
            )
            : await deenbotDb.get(
                'SELECT id FROM favorites WHERE username = ? AND item_type = ? AND item_id = ?',
                [username, item_type, item_id]
            );
        let action;
        if (existing) {
            await deenbotDb.run(
                schema === 'legacy' ? 'DELETE FROM favorites WHERE _id = ?' : 'DELETE FROM favorites WHERE id = ?',
                [existing.id]
            );
            action = 'removed';
        } else {
            if (schema === 'legacy') {
                await deenbotDb.run(
                    'INSERT INTO favorites (sub_id, ftype, content) VALUES (?,?,?)',
                    [username, item_type, String(item_id)]
                );
            } else {
                await deenbotDb.run(
                    'INSERT INTO favorites (username,item_type,item_id) VALUES (?,?,?)',
                    [username, item_type, item_id]
                );
            }
            action = 'added';
        }
        await deenbotDb.run(
            'INSERT INTO user_activities (username, type, value, timestamp) VALUES (?,?,?,datetime("now"))',
            [username, 'favorite_' + action, JSON.stringify({ item_type, item_id })]
        );
        const rows = schema === 'legacy'
            ? await deenbotDb.all('SELECT ftype as type, content as id FROM favorites WHERE sub_id = ?', [username])
            : await deenbotDb.all('SELECT item_type as type, item_id as id FROM favorites WHERE username = ?', [username]);
        res.json({ success: true, action, favorites: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
};

export const deleteFavorite = async (req, res) => {
    const { username, item_type, item_id } = req.body;
    try {
        const schema = await detectFavoritesSchema();
        if (schema === 'legacy') {
            await deenbotDb.run(
                'DELETE FROM favorites WHERE sub_id = ? AND ftype = ? AND content = ?',
                [username, item_type, String(item_id)]
            );
        } else {
            await deenbotDb.run(
                'DELETE FROM favorites WHERE username = ? AND item_type = ? AND item_id = ?',
                [username, item_type, item_id]
            );
        }
        const rows = schema === 'legacy'
            ? await deenbotDb.all('SELECT ftype as type, content as id FROM favorites WHERE sub_id = ?', [username])
            : await deenbotDb.all('SELECT item_type as type, item_id as id FROM favorites WHERE username = ?', [username]);
        res.json({ success: true, favorites: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete favorite' });
    }
};
