# Margin — Full-Stack Blog Application

Margin is a full-stack blog application that allows users to discover, read, create, edit, and delete blog posts.

This project combines a backend developed by me with a responsive frontend created with the assistance of ChatGPT.

## Project Structure

```text
blog_backend/
├── blog-backend/       # Backend developed by me
├── blog-frontend/      # Frontend created with ChatGPT
└── README.md           # Project overview and setup
```

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- REST API

**Frontend**
- React
- Vite
- Tailwind CSS
- JavaScript

## Features

- User registration and login
- Cookie-based authentication
- Create, read, update, and delete blog posts
- Search and pagination
- Responsive user interface
- Backend and frontend integration through REST APIs

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NebulaCoderX15/blog_backend.git
cd blog_backend
```

### 2. Start the backend

Open a terminal in the backend directory:

```bash
cd blog-backend
npm install
```

Configure the required environment variables in a `.env` file, then start the server using the script defined in `package.json`. For example:

```bash
npm run dev
```

### 3. Start the frontend

Open another terminal:

```bash
cd blog-frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

The frontend uses a Vite development proxy to communicate with the backend at `http://localhost:3000`. Ensure the backend is running on the configured port.

## What I Learned

Developing this project helped me understand backend development, REST API design, database integration with MongoDB, authentication, CRUD operations, and connecting a frontend to a backend.

It also gave me practical experience integrating independently developed application components into a working full-stack project.

## Acknowledgements

- **Backend:** Designed and developed by me.
- **Frontend:** Created with assistance from ChatGPT.
