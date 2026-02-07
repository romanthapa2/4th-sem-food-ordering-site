import { db } from '../db.js';

/**
 * Order Model - Database operations for orders
 */

/**
 * Create a new order in the database
 * @param {Object} orderData - Order data object
 * @param {string} orderData.fullName - Customer full name
 * @param {string} orderData.email - Customer email
 * @param {string} orderData.phone - Customer phone number
 * @param {string} orderData.address - Delivery address
 * @param {string} orderData.city - Delivery city
 * @param {string} orderData.paymentMethod - Payment method (cash, card, online)
 * @param {string} [orderData.deliveryInstructions] - Delivery instructions (optional)
 * @param {number} orderData.totalAmount - Total order amount
 * @param {Array} orderData.items - Array of order items
 * @returns {Promise<Object>} - Created order object with items
 */
export async function createOrder(orderData) {
  const {
    fullName,
    email,
    phone,
    address,
    city,
    paymentMethod = 'cash',
    deliveryInstructions = null,
    totalAmount,
    items
  } = orderData;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insert order
    const orderQuery = `
      INSERT INTO orders (
        full_name, email, phone, address, city,
        payment_method, delivery_instructions, total_amount, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const orderValues = [
      fullName,
      email,
      phone,
      address,
      city,
      paymentMethod,
      deliveryInstructions,
      totalAmount
    ];

    const [orderResult] = await connection.execute(orderQuery, orderValues);
    const orderId = orderResult.insertId;

    // Insert order items
    const itemQuery = `
      INSERT INTO order_items (
        order_id, product_id, product_name, quantity, price, subtotal
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of items) {
      const itemValues = [
        orderId,
        item.product.id,
        item.product.name,
        item.quantity,
        item.product.price,
        item.product.price * item.quantity
      ];
      await connection.execute(itemQuery, itemValues);
    }

    await connection.commit();

    // Fetch the complete order with items
    const [orders] = await connection.execute(
      `SELECT 
        id, full_name, email, phone, address, city,
        payment_method, delivery_instructions, total_amount, status,
        created_at, updated_at
      FROM orders WHERE id = ?`,
      [orderId]
    );

    const [orderItems] = await connection.execute(
      `SELECT 
        id, product_id, product_name, quantity, price, subtotal
      FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return {
      ...orders[0],
      items: orderItems
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Get order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object|null>} - Order object with items or null if not found
 */
export async function getOrderById(orderId) {
  try {
    const [orders] = await db.execute(
      `SELECT 
        id, full_name, email, phone, address, city,
        payment_method, delivery_instructions, total_amount, status,
        created_at, updated_at
      FROM orders WHERE id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      return null;
    }

    const [orderItems] = await db.execute(
      `SELECT 
        id, product_id, product_name, quantity, price, subtotal
      FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return {
      ...orders[0],
      items: orderItems
    };
  } catch (error) {
    throw error;
  }
}

