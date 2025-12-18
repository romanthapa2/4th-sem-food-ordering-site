import { signup } from '../controllers/user/signup.controller.js';
import { login } from '../controllers/user/login.controller.js';

/**
 * User Routes - Handle user-related routes
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export function handleUserRoutes(req, res) {
  const { method, url } = req;
  
  // Signup route: POST /api/users/signup
  if (method === 'POST' && url === '/api/users/signup') {
    signup(req, res);
    return true;
  }

  // Login route: POST /api/users/login
  if (method === 'POST' && url === '/api/users/login') {
    login(req, res);
    return true;
  }
  
  // Route not found
  return false;
}

