import { createProduct, getProductsByCategory, updateProduct, deleteProduct } from '../../model/product.model.js';
import { sendResponse, sendError } from '../../utils/response.js';
import { parseRequestBody } from '../../utils/requestParser.js';

/**
 * Product Controller - Business logic for product operations
 */

/**
 * Create product controller
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function createProductController(req, res) {
  try {
    // Parse request body
    const body = await parseRequestBody(req);
    const { name,slug, description, price } = body;

    // Basic validation
    if (!name || typeof name !== 'string' || !price) {
      return sendError(res, 400, 'Name and price are required');
    }

    if (name.trim().length < 2) {
      return sendError(res, 400, 'Product name must be at least 2 characters long');
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return sendError(res, 400, 'Price must be a positive number');
    }

    const productData = {
      name: name.trim(),
      slug: slug.trim(),
      description: typeof description === 'string' ? description.trim() : null,
      price: numericPrice
    };

    const newProduct = await createProduct(productData);

    // Success response
    sendResponse(res, 201, {
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);

    if (error.statusCode === 400 || error instanceof SyntaxError) {
      return sendError(res, 400, 'Invalid request body. Please send valid JSON.');
    }

    // Handle database errors (e.g., constraint violations)
    sendError(res, 500, 'Internal server error');
  }
}

/**
 * Get products by category controller
 * Expects: GET /api/products?category=SomeCategory
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function getProductsByCategoryController(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const category = url.searchParams.get('category');

    if (!category || !category.trim()) {
      return sendError(res, 400, 'Category is required');
    }

    const products = await getProductsByCategory(category.trim());

    sendResponse(res, 200, {
      category: category.trim(),
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    sendError(res, 500, 'Internal server error');
  }
}

/**
 * Update product controller
 * Expects: PUT /api/products/:id
 * Body: { name?, description?, price?, category? }
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function updateProductController(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean); // ["api", "products", ":id"]
    const idPart = pathParts[2];
    const id = Number(idPart);

    if (!id || Number.isNaN(id) || id <= 0) {
      return sendError(res, 400, 'Valid product ID is required in the URL');
    }

    const body = await parseRequestBody(req);
    const { name,slug, description, price } = body;

    // Validate fields if they are provided
    const updates = {};

    if (typeof name !== 'undefined') {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return sendError(res, 400, 'If provided, name must be a string of at least 2 characters');
      }
      updates.name = name.trim();
    }

    if (typeof description !== 'undefined') {
      if (description !== null && typeof description !== 'string') {
        return sendError(res, 400, 'Description must be a string or null');
      }
      updates.description = description === null ? null : description.trim();
    }

    if (typeof price !== 'undefined') {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice <= 0) {
        return sendError(res, 400, 'If provided, price must be a positive number');
      }
      updates.price = numericPrice;
    }

    updates.slug = slug.trim();

    const updatedProduct = await updateProduct(id, updates);

    if (!updatedProduct) {
      return sendError(res, 404, 'Product not found or nothing to update');
    }

    sendResponse(res, 200, {
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);

    if (error.statusCode === 400 || error instanceof SyntaxError) {
      return sendError(res, 400, 'Invalid request body. Please send valid JSON.');
    }

    sendError(res, 500, 'Internal server error');
  }
}


/**
 * Delete product controller
 * Expects: DELETE /api/products/:id
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function deleteProductController(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean); // ["api", "products", ":id"]
    const idPart = pathParts[2];
    const id = Number(idPart);

    if (!id || Number.isNaN(id) || id <= 0) {
      return sendError(res, 400, 'Valid product ID is required in the URL');
    }

    const deleted = await deleteProduct(id);

    if (!deleted) {
      return sendError(res, 404, 'Product not found');
    }

    sendResponse(res, 200, {
      message: 'Product deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Delete product error:', error);
    sendError(res, 500, 'Internal server error');
  }
}



