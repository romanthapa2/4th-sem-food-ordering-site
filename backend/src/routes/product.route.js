import { createProductController, getProductsByCategoryController, updateProductController, deleteProductController } from '../controllers/product.controller/product.controller.js';

/**
 * Product Routes - Handle product-related routes
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export function handleProductRoutes(req, res) {
  const { method, url } = req;

  // Create product: POST /api/products
  if (method === 'POST' && url === '/api/products') {
    createProductController(req, res);
    return true;
  }

  // Get products by category: GET /api/products?category=SomeCategory
  if (method === 'GET' && url.startsWith('/api/products')) {
    getProductsByCategoryController(req, res);
    return true;
  }

  // Update product: PUT /api/products/:id
  if (method === 'PUT' && url.startsWith('/api/products/')) {
    updateProductController(req, res);
    return true;
  }

  // Delete product: DELETE /api/products/:id
  if (method === 'DELETE' && url.startsWith('/api/products/')) {
    deleteProductController(req, res);
    return true;
  }

  // Route not found for products
  return false;
}


