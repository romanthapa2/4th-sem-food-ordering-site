import { db } from '../db.js';
import { hashPassword } from '../utils/password.js';

/**
 * User Model - Database operations for users
 */

/**
 * Create a new user in the database
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - Plain text password (will be hashed before saving)
 * @param {string} userData.phone - User's phone number (optional)
 * @returns {Promise<Object>} - Created user object
 */
export async function createUser(userData) {
  const { name, email, password } = userData;
  const hashedPassword = await hashPassword(password);
  
  const query = `
    INSERT INTO users (name, email, password_hash, created_at)
    VALUES (?, ?, ?, NOW())
  `;
  
  const values = [name, email, hashedPassword];
  
  try {
    const [result] = await db.execute(query, values);
    
    // Fetch the created user
    const [users] = await db.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    return users[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Find user by email
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} - User object or null if not found
 */
export async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  
  try {
    const [users] = await db.execute(query, [email]);
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    throw error;
  }
}

/**
 * Find user by ID
 * @param {number} id - User's ID
 * @returns {Promise<Object|null>} - User object or null if not found
 */
export async function findUserById(id) {
  const query = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
  
  try {
    const [users] = await db.execute(query, [id]);
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    throw error;
  }
}

