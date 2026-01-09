/**
 * Express.js Learning Application
 * This is a comprehensive example for learning Express.js fundamentals
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE SECTION
// ============================================

/**
 * Body parser middleware - parses incoming JSON requests
 */
app.use(express.json());

/**
 * URL-encoded parser - for parsing form data
 */
app.use(express.urlencoded({ extended: true }));

/**
 * CORS - Enable Cross-Origin Resource Sharing
 * Allows frontend applications from different domains to access this API
 */
app.use(cors());

/**
 * Morgan - HTTP request logger middleware
 * Logs all incoming requests in 'dev' format
 */
app.use(morgan('dev'));

/**
 * Static files middleware - serves files from 'public' directory
 */
app.use(express.static('public'));

/**
 * Custom logging middleware example
 * This demonstrates how to create custom middleware
 */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES SECTION
// ============================================

/**
 * Root route - GET /
 * Returns a welcome message
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express.js Learning API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      health: '/health'
    }
  });
});

/**
 * Health check endpoint - GET /health
 * Used to verify the server is running
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// API ROUTES - Users
// ============================================

// In-memory data store for demonstration
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// ID counter to ensure unique IDs even after deletions
let nextUserId = 3;

/**
 * GET /api/users
 * Retrieve all users
 */
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

/**
 * GET /api/users/:id
 * Retrieve a specific user by ID
 */
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

/**
 * POST /api/users
 * Create a new user
 */
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  const newUser = {
    id: nextUserId++,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

/**
 * PUT /api/users/:id
 * Update an existing user
 */
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const { name, email } = req.body;
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

/**
 * DELETE /api/users/:id
 * Delete a user
 */
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  users.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// ============================================
// API ROUTES - Posts (Additional Examples)
// ============================================

let posts = [
  { id: 1, title: 'Getting Started with Express', content: 'Express is a minimal web framework...', userId: 1 },
  { id: 2, title: 'Understanding Middleware', content: 'Middleware functions have access to...', userId: 2 }
];

// ID counter to ensure unique IDs even after deletions
let nextPostId = 3;

/**
 * GET /api/posts
 * Retrieve all posts with optional filtering
 */
app.get('/api/posts', (req, res) => {
  const { userId } = req.query;
  
  let filteredPosts = posts;
  
  if (userId) {
    filteredPosts = posts.filter(p => p.userId === parseInt(userId));
  }
  
  res.json({
    success: true,
    count: filteredPosts.length,
    data: filteredPosts
  });
});

/**
 * GET /api/posts/:id
 * Retrieve a specific post by ID
 */
app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'Post not found'
    });
  }
  
  res.json({
    success: true,
    data: post
  });
});

/**
 * POST /api/posts
 * Create a new post
 */
app.post('/api/posts', (req, res) => {
  const { title, content, userId } = req.body;
  
  if (!title || !content || !userId) {
    return res.status(400).json({
      success: false,
      error: 'Title, content, and userId are required'
    });
  }
  
  const newPost = {
    id: nextPostId++,
    title,
    content,
    userId: parseInt(userId)
  };
  
  posts.push(newPost);
  
  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: newPost
  });
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * 404 handler - catches all undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

/**
 * Global error handler
 * This middleware catches all errors thrown in the application
 */
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// SERVER START
// ============================================

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   Express.js Learning Server                  ║
╚═══════════════════════════════════════════════╝
  
  🚀 Server is running on port ${PORT}
  📝 Environment: ${process.env.NODE_ENV || 'development'}
  🌐 Access at: http://localhost:${PORT}
  
  Available endpoints:
  ├─ GET    /                    - Welcome message
  ├─ GET    /health              - Health check
  ├─ GET    /api/users           - Get all users
  ├─ GET    /api/users/:id       - Get user by ID
  ├─ POST   /api/users           - Create user
  ├─ PUT    /api/users/:id       - Update user
  ├─ DELETE /api/users/:id       - Delete user
  ├─ GET    /api/posts           - Get all posts
  ├─ GET    /api/posts/:id       - Get post by ID
  └─ POST   /api/posts           - Create post
  `);
});

module.exports = app;
