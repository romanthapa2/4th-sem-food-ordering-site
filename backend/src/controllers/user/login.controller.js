
import { verifyPassword } from '../../utils/password.js';
import { sendResponse, sendError } from '../../utils/response.js';
import { parseRequestBody } from '../../utils/requestParser.js';
import { findUserByEmail } from '../../utils/findUserbyEmail.js';
import { isValidEmail } from '../../utils/validateEmail.js';



/**
 * Login controller
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function login(req, res) {
    try {
      const body = await parseRequestBody(req);
      const { email, password } = body;
  
      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }
  
      if (!isValidEmail(email)) {
        return sendError(res, 400, 'Invalid email format');
      }
  
      // Find user
      const user = await findUserByEmail(email.trim().toLowerCase());
      if (!user) {
        return sendError(res, 401, 'Invalid email or password');
      }
  
      // Verify password
      const isValidPassword = await verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return sendError(res, 401, 'Invalid email or password');
      }
  
      // Success
      sendResponse(res, 200, {
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Login error:', error);
  
      if (error.statusCode === 400 || error instanceof SyntaxError) {
        return sendError(res, 400, 'Invalid request body. Please send valid JSON.');
      }
  
      sendError(res, 500, 'Internal server error');
    }
  }