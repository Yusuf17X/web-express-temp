/**
 * Express Router Example
 * Demonstrates how to organize routes using Express Router
 * 
 * This approach helps keep your code organized by separating routes
 * into different files based on resources or features.
 */

const express = require('express');
const router = express.Router();

// ============================================
// ROUTE ORGANIZATION PATTERNS
// ============================================

/**
 * Pattern 1: Simple Route Definitions
 * Direct route handlers in the router file
 */

// Sample data
let products = [
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 29, category: 'Electronics' },
  { id: 3, name: 'Desk', price: 299, category: 'Furniture' }
];

// ID counter to ensure unique IDs even after deletions
let nextProductId = 4;

/**
 * GET /api/products
 * Get all products with optional filtering
 */
router.get('/', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  
  let filteredProducts = products;
  
  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      p => p.price >= parseFloat(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      p => p.price <= parseFloat(maxPrice)
    );
  }
  
  res.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts
  });
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

/**
 * POST /api/products
 * Create a new product
 */
router.post('/', (req, res) => {
  const { name, price, category } = req.body;
  
  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      error: 'Name, price, and category are required'
    });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({
      success: false,
      error: 'Price must be a positive number'
    });
  }
  
  const newProduct = {
    id: nextProductId++,
    name,
    price,
    category
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

/**
 * PUT /api/products/:id
 * Update a product
 */
router.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  const { name, price, category } = req.body;
  
  if (name) products[productIndex].name = name;
  if (price !== undefined) products[productIndex].price = price;
  if (category) products[productIndex].category = category;
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex]
  });
});

/**
 * DELETE /api/products/:id
 * Delete a product
 */
router.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  products.splice(productIndex, 1);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// ============================================
// NESTED ROUTES EXAMPLE
// ============================================

/**
 * GET /api/products/:id/reviews
 * Get reviews for a specific product (nested resource example)
 */
router.get('/:id/reviews', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  // In a real app, this would fetch from a database
  const reviews = [
    { id: 1, productId, rating: 5, comment: 'Great product!' },
    { id: 2, productId, rating: 4, comment: 'Good value for money' }
  ];
  
  res.json({
    success: true,
    product: product.name,
    count: reviews.length,
    data: reviews
  });
});

// ============================================
// ROUTE CHAINING EXAMPLE
// ============================================

/**
 * Demonstrates route chaining for the same path
 * All HTTP methods for /api/products/search
 */
router.route('/search')
  .get((req, res) => {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const searchResults = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.category.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json({
      success: true,
      query: q,
      count: searchResults.length,
      data: searchResults
    });
  })
  .post((req, res) => {
    res.status(405).json({
      success: false,
      error: 'POST method not allowed for search'
    });
  });

// ============================================
// ROUTE WITH MULTIPLE MIDDLEWARE
// ============================================

/**
 * Example of applying multiple middleware to a route
 */
const validateProductId = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id < 1) {
    return res.status(400).json({
      success: false,
      error: 'Invalid product ID'
    });
  }
  
  next();
};

const checkProductExists = (req, res, next) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  // Attach product to request for use in handler
  req.product = product;
  next();
};

/**
 * GET /api/products/:id/details
 * Protected route with multiple middleware
 */
router.get('/:id/details', validateProductId, checkProductExists, (req, res) => {
  // Product is already validated and attached by middleware
  res.json({
    success: true,
    data: {
      ...req.product,
      details: 'Extended product information would go here',
      availability: 'In Stock'
    }
  });
});

// ============================================
// ROUTE PARAMETERS EXAMPLE
// ============================================

/**
 * Demonstrates using route parameters with regex constraints
 * Only matches numeric IDs
 */
router.get('/numeric/:id(\\d+)', (req, res) => {
  res.json({
    message: 'This route only accepts numeric IDs',
    id: req.params.id,
    type: typeof req.params.id
  });
});

/**
 * Optional parameters example
 */
router.get('/category/:category/:subcategory?', (req, res) => {
  const { category, subcategory } = req.params;
  
  res.json({
    message: 'Category route with optional subcategory',
    category,
    subcategory: subcategory || 'All'
  });
});

// ============================================
// HOW TO USE THIS ROUTER IN YOUR APP
// ============================================

/**
 * In your main app file (e.g., server.js):
 * 
 * const productRoutes = require('./examples/routes-example');
 * app.use('/api/products', productRoutes);
 * 
 * This will mount all routes defined here under /api/products
 * So router.get('/', ...) becomes accessible at /api/products/
 * And router.get('/:id', ...) becomes accessible at /api/products/:id
 */

module.exports = router;
