import { deenbotDb } from '../db/connection.js';

const db = deenbotDb;

/**
 * Create User
 */
export const createUser = (req, res) => {
    try {
        const { firstname, lastname, nickname, gender } = req.body;

        if (!firstname || !lastname) {
            return res.status(400).json({
                success: false,
                message: "firstname and lastname are required",
            });
        }

        const query = `
      INSERT INTO user_information (firstname, lastname, nickname, gender)
      VALUES (?, ?, ?, ?)
    `;

        const result = db.prepare(query).run(
            firstname,
            lastname,
            nickname || null,
            gender ?? 0
        );

        res.status(201).json({
            success: true,
            message: "User created",
            userId: result.lastInsertRowid,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create user",
        });
    }
};

/**
 * Get All Users
 */
export const getAllUsers = (req, res) => {
    try {
        const users = db.prepare(`SELECT * FROM user_information`).all();

        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

/**
 * Get User By ID
 */
export const getUserById = (req, res) => {
    try {
        const { id } = req.params;

        const user = db
            .prepare(`SELECT * FROM user_information WHERE user_id = ?`)
            .get(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

/**
 * Update User
 */
export const updateUser = (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, nickname, gender } = req.body;

        const result = db
            .prepare(`
        UPDATE user_information
        SET firstname = ?, lastname = ?, nickname = ?, gender = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `)
            .run(firstname, lastname, nickname, gender, id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "User updated",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};

/**
 * Delete User
 */
export const deleteUser = (req, res) => {
    try {
        const { id } = req.params;

        const result = db
            .prepare(`DELETE FROM user_information WHERE user_id = ?`)
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            message: "User deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};

export const upsertUser = (req, res) => {
    try {
        const { user_id, firstname, lastname, nickname, gender } = req.body;

        if (!firstname || !lastname) {
            return res.status(400).json({
                success: false,
                message: "firstname and lastname are required",
            });
        }

        const query = `
      INSERT INTO user_information (
        user_id,
        firstname,
        lastname,
        nickname,
        gender
      )
      VALUES (?, ?, ?, ?, ?)

      ON CONFLICT(user_id) DO UPDATE SET
        firstname = excluded.firstname,
        lastname = excluded.lastname,
        nickname = excluded.nickname,
        gender = excluded.gender,
        updated_at = CURRENT_TIMESTAMP
    `;

        const result = db.prepare(query).run(
            user_id || null,
            firstname,
            lastname,
            nickname || null,
            gender ?? 0
        );

        res.json({
            success: true,
            message: "User upserted successfully",
            changes: result.changes,
            lastInsertId: result.lastInsertRowid
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to upsert user"
        });
    }
};