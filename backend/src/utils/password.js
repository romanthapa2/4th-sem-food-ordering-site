import crypto from 'crypto';

/**
 * Hash password using Node.js crypto scrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password with salt
 */
export async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      // Format: salt:hash (both hex encoded)
      const hash = derivedKey.toString('hex');
      resolve(`${salt}:${hash}`);
    });
  });
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password with salt (format: salt:hash)
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, hashValue] = hash.split(':');
    
    if (!salt || !hashValue) {
      resolve(false);
      return;
    }
    
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      const derivedHash = derivedKey.toString('hex');
      resolve(derivedHash === hashValue);
    });
  });
}

