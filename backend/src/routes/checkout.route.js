import { createOrderController } from '../controllers/checkout.controller/checkout.controller.js';

/**
 * Checkout Routes - Handle checkout-related routes
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export function handleCheckoutRoutes(req, res) {
  const { method, url } = req;

  // Create order: POST /api/checkout
  if (method === 'POST' && url === '/api/checkout') {
    createOrderController(req, res);
    return true;
  }

  // Route not found for checkout
  return false;
}

