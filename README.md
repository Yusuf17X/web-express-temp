# Express.js Learning Repository 🚀

A comprehensive Express.js learning repository designed to help developers understand Express.js fundamentals with clear examples and patterns. This repository is optimized for use with GitHub Copilot to provide context-aware code suggestions.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Learning Resources](#learning-resources)
- [Key Concepts](#key-concepts)

## ✨ Features

- **RESTful API Examples** - Complete CRUD operations for users and posts
- **Middleware Demonstrations** - Custom and third-party middleware examples
- **Error Handling** - Global error handler and 404 handling
- **Static File Serving** - Serving HTML/CSS/JS files from public directory
- **Environment Configuration** - Using dotenv for configuration
- **Request Logging** - Morgan middleware for HTTP request logging
- **CORS Support** - Cross-Origin Resource Sharing enabled
- **Well Documented** - Extensive comments and JSDoc for GitHub Copilot

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/Yusuf17X/web-express-temp.git
cd web-express-temp
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

## 🏃 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## 🌐 API Endpoints

### General Endpoints
- `GET /` - Welcome message with API overview
- `GET /health` - Health check endpoint

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user by ID
- `POST /api/users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `PUT /api/users/:id` - Update an existing user
- `DELETE /api/users/:id` - Delete a user

### Post Endpoints
- `GET /api/posts` - Get all posts (supports `?userId=<id>` query parameter)
- `GET /api/posts/:id` - Get a specific post by ID
- `POST /api/posts` - Create a new post
  ```json
  {
    "title": "My Post Title",
    "content": "Post content here",
    "userId": 1
  }
  ```

## 📁 Project Structure

```
web-express-temp/
├── public/              # Static files (HTML, CSS, JS)
│   └── index.html      # API documentation page
├── server.js           # Main Express application
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies and scripts
└── README.md          # Project documentation
```

## 📚 Learning Resources

### Express.js Core Concepts

1. **Middleware** - Functions that have access to request and response objects
   - Body parsers (JSON, URL-encoded)
   - Static file serving
   - Custom logging middleware
   - Third-party middleware (CORS, Morgan)

2. **Routing** - Handling different HTTP methods and paths
   - GET requests for reading data
   - POST requests for creating data
   - PUT requests for updating data
   - DELETE requests for removing data
   - Route parameters (`:id`)
   - Query parameters (`?userId=1`)

3. **Error Handling** - Managing errors gracefully
   - 404 Not Found handler
   - Global error handler
   - Custom error responses

4. **Request/Response** - Working with HTTP
   - Reading request body, params, and query
   - Sending JSON responses
   - Setting status codes
   - Response formatting

## 🎯 Key Concepts

### Middleware Order
Middleware executes in the order it's defined. In this project:
1. Body parsers (JSON, URL-encoded)
2. CORS
3. Morgan (logging)
4. Static files
5. Custom middleware
6. Routes
7. 404 handler
8. Error handler

### REST API Best Practices
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Return consistent JSON response formats
- Use proper status codes (200, 201, 400, 404, 500)
- Include success/error indicators in responses
- Validate input data

### Environment Variables
Use `.env` file for configuration:
- Port numbers
- Database credentials
- API keys
- Environment-specific settings

## 🤝 Contributing

This is a learning repository. Feel free to:
- Fork the project
- Create feature branches
- Add more examples
- Improve documentation
- Submit pull requests

## 📝 License

ISC

## 🎓 Next Steps

After understanding this basic setup, consider exploring:
- Database integration (MongoDB, PostgreSQL)
- Authentication & Authorization (JWT, sessions)
- Input validation (express-validator, Joi)
- Testing (Jest, Supertest)
- API documentation (Swagger/OpenAPI)
- Template engines (EJS, Pug)
- WebSocket support (Socket.io)

## 💡 Tips for Using with GitHub Copilot

1. **Read the comments** - Detailed comments help Copilot understand context
2. **Follow patterns** - Consistent code patterns improve suggestions
3. **Use descriptive names** - Clear variable and function names help Copilot
4. **Start with comments** - Describe what you want before writing code
5. **Review suggestions** - Always review and test Copilot's suggestions

---

Happy Learning! 🎉