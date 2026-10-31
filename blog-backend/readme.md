# Blog Backend API

This is the backend of a blog website built using **Node.js, Express.js, and MongoDB**. It provides RESTful APIs for user authentication and blog management, allowing users to register, log in, create blog posts, retrieve posts, update their own posts, and delete them.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Backend framework for building REST APIs
- **MongoDB** — NoSQL database for storing users and blog posts
- **Mongoose** — MongoDB object modeling and schema validation
- **JWT (JSON Web Token)** — Token-based authentication
- **bcrypt** — Password hashing

## Features

- User registration and login
- Password hashing for secure credential storage
- JWT-based authentication using cookies
- Create, read, update, and delete blog posts (CRUD)
- User-specific blog ownership
- Request validation using Mongoose schemas
- Paginated blog retrieval
- Logout functionality
- Account deletion functionality

## API Endpoints

Base URL: `http://localhost:3000/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in a user |
| POST | `/logout` | Log out a user |
| GET | `/getall` | Retrieve blog posts |
| GET | `/getblog/:id` | Retrieve a blog by ID |
| POST | `/create` | Create a blog post |
| PATCH | `/updateblog/:id` | Update a blog post |
| DELETE | `/deleteblog/:id` | Delete a blog post |
| DELETE | `/delete` |Delete a user account |

### Pagination

The blog listing endpoint supports pagination through query parameters.

Example:

`GET /api/auth/getall?page=1&limit=9`

- `page` — Page number
- `limit` — Number of blog posts per page

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database, either local or hosted through MongoDB Atlas
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NebulaCoderX15/blog_backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd blog_backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root:

   ```env
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

5. Start the server using the script configured in `package.json`. For example:

   ```bash
   npm run dev
   ```

   Or, if your project does not have a development script:

   ```bash
   node server.js
   ```

The API should now be available at `http://localhost:3000`, assuming your server is configured to use port `3000`.

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. After successful login, the server issues a token through a cookie. Protected endpoints use this token to identify the authenticated user.

Passwords should be hashed before being stored in the database. Authentication and authorization checks should be enforced on the backend, especially for blog creation, updating, and deletion.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port on which the server runs |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `NODE_ENV` | Application environment |

**Security:** Never commit your `.env` file, database credentials, JWT secrets, or other private keys to GitHub. Add `.env` to `.gitignore` and provide a separate `.env.example` containing placeholder values.

## Frontend Integration

This backend can be connected to a frontend built with React, Vite, or any other framework that supports HTTP requests.

For local development, the frontend can send requests to the backend through a development proxy. Authentication requests using cookies must include credentials where required.

## Future Improvements

- Centralized error-handling middleware
- Stronger request validation and rate limiting
- Refresh-token or session management
- API documentation using Swagger
- Automated tests
- Improved pagination metadata
- Production logging and monitoring

## License

Add a license to this repository if you intend to distribute the project for reuse. Otherwise, specify the terms under which others may use the code.
