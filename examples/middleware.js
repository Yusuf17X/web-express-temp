/**
 * Custom Middleware Examples for Express.js
 * 
 * Middleware functions have access to:
 * - req (request object)
 * - res (response object) 
 * - next (function to pass control to next middleware)
 */

// ============================================
// LOGGING MIDDLEWARE
// ============================================

/**
 * Simple request logger
 * Logs the HTTP method and URL of each request
 */
const simpleLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

/**
 * Detailed request logger
 * Logs method, URL, timestamp, and request duration
 */
const detailedLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

/**
 * Simple API key authentication middleware
 * Checks for API key in request headers
 */
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required'
    });
  }
  
  // In a real application, validate the API key against a database
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key'
    });
  }
  
  next();
};

/**
 * Simple JWT authentication middleware (example structure)
 * Note: Requires jsonwebtoken package
 */
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token is required'
    });
  }
  
  // In a real application, verify the JWT token
  // const jwt = require('jsonwebtoken');
  // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ success: false, error: 'Invalid token' });
  //   }
  //   req.user = user;
  //   next();
  // });
  
  next();
};

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

/**
 * Validate user creation request body
 */
const validateUserCreation = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid name is required'
    });
  }
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Valid email is required'
    });
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }
  
  next();
};

/**
 * Validate MongoDB ObjectId format
 * Useful when working with MongoDB
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // Basic ObjectId format check (24 hex characters)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    
    if (!objectIdRegex.test(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${paramName} format`
      });
    }
    
    next();
  };
};

// ============================================
// RATE LIMITING MIDDLEWARE
// ============================================

/**
 * Simple in-memory rate limiter
 * Limits requests per IP address
 */
const rateLimiter = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip);
    
    // Remove old requests outside the time window
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later'
      });
    }
    
    recentRequests.push(now);
    requests.set(ip, recentRequests);
    
    next();
  };
};

// ============================================
// CORS MIDDLEWARE (Custom Implementation)
// ============================================

/**
 * Custom CORS middleware
 * Alternative to using the 'cors' package
 */
const customCors = (options = {}) => {
  const {
    origin = '*',
    methods = 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders = 'Content-Type,Authorization'
  } = options;
  
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', methods);
    res.header('Access-Control-Allow-Headers', allowedHeaders);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    
    next();
  };
};

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found (404) handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

// ============================================
// RESPONSE FORMATTING MIDDLEWARE
// ============================================

/**
 * Add helper methods to response object
 */
const responseHelpers = (req, res, next) => {
  /**
   * Send success response
   */
  res.success = (data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  
  /**
   * Send error response
   */
  res.error = (message = 'Error', statusCode = 400) => {
    res.status(statusCode).json({
      success: false,
      error: message
    });
  };
  
  next();
};

// ============================================
// REQUEST PARSING MIDDLEWARE
// ============================================

/**
 * Parse pagination parameters from query string
 */
const parsePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  req.pagination = {
    page,
    limit,
    skip
  };
  
  next();
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Logging
  simpleLogger,
  detailedLogger,
  
  // Authentication
  requireApiKey,
  authenticateJWT,
  
  // Validation
  validateUserCreation,
  validateObjectId,
  
  // Rate Limiting
  rateLimiter,
  
  // CORS
  customCors,
  
  // Error Handling
  asyncHandler,
  notFoundHandler,
  errorHandler,
  
  // Response Helpers
  responseHelpers,
  
  // Request Parsing
  parsePagination
};
