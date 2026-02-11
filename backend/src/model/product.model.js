import { db } from '../db.js';

/**
 * Product Model - Database operations for products
 */

/**
 * Create a new product in the database
 * @param {Object} productData - Product data object
 * @param {string} productData.name - Product name
 * @param {string} [productData.slug] - Product slug (optional)
 * @param {string} [productData.description] - Product description (optional)
 * @param {number} productData.price - Product price
 * @param {string} [productData.image_url] - Image URL/path (optional)
 * @returns {Promise<Object>} - Created product object
 */
export async function createProduct(productData) {
  const { name, slug, description = null, price, image_url = null } = productData;

  const query = `
    INSERT INTO products (name, slug, description, price, image_url, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  const values = [name, slug, description, price, image_url];

  try {
    const [result] = await db.execute(query, values);

    // Fetch the created product (including image_url)
    const [products] = await db.execute(
      'SELECT id, name, slug, description, price, image_url, created_at FROM products WHERE id = ?',
      [result.insertId]
    );

    return products[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} - List of products in the given category
 */
export async function getProductsByCategory(category) {
  let query;
  let params = [];

  if (category) {
    // If category is provided, filter by category
    query = `
      SELECT id, name, description, price, category, image_url, created_at
      FROM products
      WHERE category = ?
      ORDER BY created_at DESC
    `;
    params = [category];
  } else {
    // If no category, return all products
    query = `
      SELECT id, name, description, price, category, image_url, created_at
      FROM products
      ORDER BY created_at DESC
    `;
  }

  try {
    const [products] = await db.execute(query, params);
    return products;
  } catch (error) {
    throw error;
  }
}

/**
 * Update a product by ID
 * Supports partial updates (name, description, price, category)
 * @param {number} id - Product ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} - Updated product or null if not found
 */
export async function updateProduct(id, updates) {
  const fields = [];
  const values = [];

  if (typeof updates.name === 'string') {
    fields.push('name = ?');
    values.push(updates.name);
  }

    if (typeof updates.slug === 'string') {
    fields.push('slug = ?');
    values.push(updates.slug);
  }

  if (typeof updates.description === 'string' || updates.description === null) {
    fields.push('description = ?');
    values.push(updates.description);
  }

  if (typeof updates.price === 'number') {
    fields.push('price = ?');
    values.push(updates.price);
  }

  if (typeof updates.image_url === 'string' || updates.image_url === null) {
    fields.push('image_url = ?');
    values.push(updates.image_url);
  }

  if (fields.length === 0) {
    // Nothing to update
    return null;
  }

  const query = `
    UPDATE products
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = ?
  `;

  values.push(id);

  try {
    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return null;
    }

    const [products] = await db.execute(
      'SELECT id, name, slug, description, price, image_url, created_at, updated_at FROM products WHERE id = ?',
      [id]
    );

    return products[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a product by ID
 * @param {number} id - Product ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export async function deleteProduct(id) {
  const query = 'DELETE FROM products WHERE id = ?';

  try {
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
}


