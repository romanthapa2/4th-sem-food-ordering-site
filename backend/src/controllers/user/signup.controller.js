import { createUser } from '../../model/user.model.js';
import { isValidEmail } from '../../utils/validateEmail.js';
import { sendResponse, sendError } from '../../utils/response.js';
import { parseRequestBody } from '../../utils/requestParser.js';
import { findUserByEmail } from '../../utils/findUserbyEmail.js';

/**
 * User Controller - Business logic for user operations
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */


/**
 * Validate phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
// function isValidPhone(phone) {
//   if (!phone) return true; // Phone is optional
//   const phoneRegex = /^[0-9]{10,15}$/;
//   return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
// }

/**
 * Signup controller
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function signup(req, res) {
  try {
    // Parse request body
    const body = await parseRequestBody(req);
    const { name, email, password } = body;
    
    // Validation
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }
    
    if (name.trim().length < 2) {
      return sendError(res, 400, 'Name must be at least 2 characters long');
    }
    
    if (!isValidEmail(email)) {
      return sendError(res, 400, 'Invalid email format');
    }
    
    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters long');
    }
    
    // if (phone && !isValidPhone(phone)) {
    //   return sendError(res, 400, 'Invalid phone number format');
    // }
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 409, 'User with this email already exists');
    }
        
    // Create user (password will be hashed in the model)
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };
    
    const newUser = await createUser(userData);
    
    // Return success response (don't include password)
    sendResponse(res, 201, {
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.statusCode === 400 || error instanceof SyntaxError) {
      return sendError(res, 400, 'Invalid request body. Please send valid JSON.');
    }
    
    // Handle database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return sendError(res, 409, 'User with this email already exists');
    }
    
    sendError(res, 500, 'Internal server error');
  }
}



