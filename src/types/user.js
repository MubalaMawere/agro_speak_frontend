// User model to match backend entity structure
// This is a reference for the expected API structure

/**
 * User entity structure
 * @typedef {Object} User
 * @property {number} [id] - User ID
 * @property {string} [fullName] - Full name
 * @property {string} email - Required - primary login field
 * @property {string} password - Required - will be hashed by backend
 * @property {string} [phone] - Optional phone number
 * @property {string} [role] - Set to "Farmer" by default in backend
 * @property {string} [createdAt] - Timestamp
 * @property {string} [updatedAt] - Timestamp
 */

/**
 * Registration request structure
 * @typedef {Object} RegisterRequest
 * @property {string} [fullName] - Full name
 * @property {string} email - Required email
 * @property {string} password - Required password
 * @property {string} [phone] - Optional phone number
 */

/**
 * Login request structure
 * @typedef {Object} LoginRequest
 * @property {string} email - Email address
 * @property {string} password - Password
 */

/**
 * Auth response structure
 * @typedef {Object} AuthResponse
 * @property {string} token - JWT token
 * @property {string} role - User role
 */

/**
 * Error response structure
 * @typedef {Object} ErrorResponse
 * @property {string} error - Error message
 */

// Export empty object since this is just for documentation
export default {};