import { db } from "../db.js";

/**
 * Find a user by email
 * @param {string} email
 * @returns {Object|null}
 */
export async function findUserByEmail(email) {
  const sql = `
    SELECT
      id,
      name,
      email,
      password_hash,
      role,
      created_at
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [email]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}
