import { createOrder } from '../../model/order.model.js';
import { sendResponse, sendError } from '../../utils/response.js';
import { parseRequestBody } from '../../utils/requestParser.js';

/**
 * Checkout Controller - Business logic for checkout operations
 */

/**
 * Create order controller
 * Expects: POST /api/checkout
 * Body: {
 *   fullName: string,
 *   email: string,
 *   phone: string,
 *   address: string,
 *   city: string,
 *   paymentMethod: 'cash' | 'card' | 'online',
 *   deliveryInstructions?: string,
 *   items: Array<{ product: { id: number, name: string, price: number }, quantity: number }>,
 *   totalAmount: number
 * }
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function createOrderController(req, res) {
  try {
    // Parse request body
    const body = await parseRequestBody(req);
    const {
      fullName,
      email,
      phone,
      address,
      city,
      paymentMethod = 'cash',
      deliveryInstructions = null,
      items,
      totalAmount
    } = body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return sendError(res, 400, 'Full name is required');
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return sendError(res, 400, 'Email is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, 'Please enter a valid email address');
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return sendError(res, 400, 'Phone number is required');
    }

    // Basic phone validation (10 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return sendError(res, 400, 'Please enter a valid phone number');
    }

    if (!address || typeof address !== 'string' || !address.trim()) {
      return sendError(res, 400, 'Address is required');
    }

    if (!city || typeof city !== 'string' || !city.trim()) {
      return sendError(res, 400, 'City is required');
    }

    // Validate payment method
    const validPaymentMethods = ['cash', 'card', 'online'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return sendError(res, 400, 'Invalid payment method. Must be one of: cash, card, online');
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'Order must contain at least one item');
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item.product || typeof item.product !== 'object') {
        return sendError(res, 400, `Item ${i + 1}: Product information is required`);
      }

      if (!item.product.id || typeof item.product.id !== 'number' || item.product.id <= 0) {
        return sendError(res, 400, `Item ${i + 1}: Valid product ID is required`);
      }

      if (!item.product.name || typeof item.product.name !== 'string') {
        return sendError(res, 400, `Item ${i + 1}: Product name is required`);
      }

      if (!item.product.price || typeof item.product.price !== 'number' || item.product.price <= 0) {
        return sendError(res, 400, `Item ${i + 1}: Valid product price is required`);
      }

      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return sendError(res, 400, `Item ${i + 1}: Valid quantity is required`);
      }
    }

    // Validate total amount
    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return sendError(res, 400, 'Valid total amount is required');
    }

    // Calculate expected total from items
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Allow small floating point differences (0.01)
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return sendError(res, 400, 'Total amount does not match the sum of items');
    }

    // Prepare order data
    const orderData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      paymentMethod,
      deliveryInstructions: deliveryInstructions ? deliveryInstructions.trim() : null,
      totalAmount: calculatedTotal,
      items
    };

    // Create order
    const newOrder = await createOrder(orderData);

    // Success response
    sendResponse(res, 201, {
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);

    if (error.statusCode === 400 || error instanceof SyntaxError) {
      return sendError(res, 400, 'Invalid request body. Please send valid JSON.');
    }

    // Handle database errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return sendError(res, 500, 'Database tables not found. Please run the schema migration.');
    }

    sendError(res, 500, 'Internal server error');
  }
}

