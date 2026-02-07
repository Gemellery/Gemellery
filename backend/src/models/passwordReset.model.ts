import pool from "../database";

// Reset token
export const createResetToken = async (
    email: string,
    token: string,
    expiresAt: Date
) => {
    await pool.query(
        `INSERT INTO password_resets (email, token, expires_at)
     VALUES (?, ?, ?)`,
        [email, token, expiresAt]
    );
};

// Find token
export const findResetToken = async (token: string) => {
    const [rows]: any = await pool.query(
        `SELECT * FROM password_resets WHERE token = ?`,
        [token]
    );
    return rows[0];
};

// Delete token
export const deleteResetToken = async (token: string) => {
    await pool.query(
        `DELETE FROM password_resets WHERE token = ?`,
        [token]
    );
};
