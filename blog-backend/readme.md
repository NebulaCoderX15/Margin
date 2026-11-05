# Blog Backend API

This is the backend of **Margin**, a blog application built using **Node.js, Express.js, and MongoDB**. It provides RESTful APIs for user authentication, blog management, likes, and comments.

The API allows users to register, log in, create and manage blog posts, interact with posts through likes and comments, and manage their accounts.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Backend framework for building REST APIs
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modeling and schema validation
- **JWT (JSON Web Token)** — Authentication
- **bcrypt** — Password hashing

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication using cookies
- Create, retrieve, update, and delete blog posts
- User-specific blog ownership
- Like and unlike blog posts
- Add, retrieve, update, and delete comments
- Paginated blog retrieval
- Retrieve authenticated user information
- Logout functionality
- Account deletion functionality

## API Endpoints

**Base URL:** `http://localhost:3000/api/auth`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in a user |
| GET | `/me` | Retrieve authenticated user information |
| POST | `/logout` | Log out a user |
| DELETE | `/delete` | Delete the authenticated user's account |

### Blog Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/getall` | Retrieve blog posts |
| GET | `/getblog/:id` | Retrieve a blog by ID |
| POST | `/create` | Create a blog post |
| PATCH | `/updateblog/:id` | Update a blog post |
| DELETE | `/deleteblog/:id` | Delete a blog post |

### Likes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/:id/like` | Like or unlike a blog post |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/:id/comments` | Retrieve comments for a blog |
| POST | `/:id/comments` | Add a comment |
| PATCH | `/comments/:commentId` | Update a comment |
| DELETE | `/comments/:commentId` | Delete a comment |

**Note:** Protected endpoints require valid authentication. Users can only modify or delete their own blog posts and comments.

## Pagination

The blog listing endpoint supports pagination through query parameters.

Example:

`GET /api/auth/getall?page=1&limit=9`

- `page` — Page number
- `limit` — Number of blog posts per page

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database (local installation or MongoDB Atlas)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NebulaCoderX15/blog_backend.git
   ```

2. Navigate to the backend directory:

   ```bash
   cd blog_backend/blog-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file inside the backend directory:

   ```env
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

5. Start the backend server using the script configured in `package.json`:

   ```bash
   npm run dev
   ```

   Alternatively, if there is no development script, use the actual server entry-point file:

   ```bash
   node server.js
   ```

The API should be available at:

`http://localhost:3000`

This assumes the server is configured to use port `3000`.

## Authentication

The API uses JSON Web Tokens (JWT) for authentication.

After a successful login, the server issues a JWT through a cookie. Protected endpoints use this token to identify the authenticated user.

Passwords are hashed before being stored in the database. Authentication and authorization checks are performed on the backend to protect user-specific operations.

For frontend requests that use cookie-based authentication, credentials must be included where required.

Example using Fetch:

```javascript
fetch(url, {
  credentials: 'include'
});
```

## Database Models

The application uses MongoDB collections managed through Mongoose.

### User

Stores user account information and authentication-related data.

### Blog

Stores blog post information, including:

- Title
- Content
- Author reference
- Likes
- Timestamps

### Comment

Stores comments associated with blog posts and users, including:

- Blog reference
- User reference
- Comment content
- Timestamps

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port on which the server runs |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `NODE_ENV` | Application environment |

**Security:** Never commit your `.env` file, database credentials, JWT secrets, or other private keys to GitHub.

Add `.env` to `.gitignore` and provide a separate `.env.example` file containing placeholder values.

## Frontend Integration

This backend can be connected to a frontend built using React, Vite, or any other framework that supports HTTP requests.

For local development, the frontend can communicate with the backend through a development proxy.

For cookie-based authentication, frontend requests must include credentials where required. The frontend and backend must also be configured appropriately for cross-origin requests when deployed on different origins.

## Future Improvements

- Centralized error-handling middleware
- Stronger request validation and rate limiting
- Refresh-token or session management
- API documentation using Swagger
- Automated testing
- Improved pagination metadata
- Production logging and monitoring

