# Margin — Blog Frontend

A responsive Vite + React + Tailwind frontend for **Margin**, a blog application powered by the Express.js and MongoDB backend: [NebulaCoderX15/blog_backend](https://github.com/NebulaCoderX15/blog_backend).

The application provides a complete blogging experience with authentication, story creation and management, likes, comments, and an editorial-style reading interface.

## Run locally

**Requirements:** Node.js 20.19+ (or a Node version supported by Vite 7) and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

In Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Start your backend separately on `http://localhost:3000`.

Vite proxies requests starting with `/api` to the backend, allowing cookie-based authentication during local development.

Open `http://localhost:5173` in your browser.

## Features

### Authentication
- User registration and login.
- Cookie-based authentication.
- Session restoration through the `/me` endpoint.
- Logout functionality.
- Protected actions for authenticated users.

### Blog management
- Editorial-style landing page with responsive navigation.
- Blog feed with pagination and client-side search.
- Create, read, update, and delete blog posts.
- Ownership-aware editing and deletion.
- Public story detail pages.
- Reading-time estimates.
- Author information and publication dates.

### Likes
- Like and unlike blog posts.
- Dynamic like count.
- Visual indication when a user has liked a post.
- Authentication required for liking stories.

### Comments
- Add comments to blog posts.
- Display comments with author information and publication dates.
- Edit your own comments.
- Delete your own comments.
- Live frontend updates after adding, editing, or deleting comments.
- Character limit of 2,000 characters.
- Authentication and ownership checks for comment management.

### User experience
- Responsive layouts for desktop and mobile.
- Loading skeletons and empty states.
- Error and success notifications.
- Form validation.
- Password visibility toggles.
- Keyboard focus styling.
- Reduced-motion support.
- Mobile navigation.

## API contract used

All routes are mounted below `/api/auth` in the backend.

| Frontend action | Method | Endpoint | Body |
|---|---|---|---|
| Register | POST | `/register` | `{ username, email, password }` |
| Sign in | POST | `/login` | `{ username, email, password }` |
| Sign out | POST | `/logout` | — |
| List stories | GET | `/getall?page=1&limit=9` | — |
| Story detail | GET | `/getblog/:id` | — |
| Create story | POST | `/create` | `{ title, content }` |
| Update story | PATCH | `/updateblog/:id` | `{ title, content }` |
| Delete story | DELETE | `/deleteblog/:id` | — |
| Like / unlike story | POST | `/:id/like` | — |
| Get comments | GET | `/:id/comments` | — |
| Add comment | POST | `/:id/comments` | `{ content }` |
| Update comment | PATCH | `/comments/:commentId` | `{ content }` |
| Delete comment | DELETE | `/comments/:commentId` | — |



## Data models

### User
Handles user authentication and account information.

### Blog
Stores blog post information, including:
- Title
- Content
- Author reference
- Likes (array of User ObjectIds)
- Creation and update timestamps

### Comment
Comments are stored in a separate MongoDB collection and reference both the blog post and the user who created them.

Each comment contains:
- Blog reference
- User reference
- Comment content
- Creation and update timestamps

## Environment variables

The default `.env.example` value is:

```env
VITE_API_BASE_URL=/api/auth
```

For a separately hosted API, configure the full API prefix, for example:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/auth
```

Vite exposes variables prefixed with `VITE_` to browser code.

**Never put server-side secrets in the frontend environment file**, including:
- `MONGO_URL`
- `JWT_SECRET`
- ImageKit private keys
- Database credentials

## Important backend integration notes before production

The frontend is integrated with the backend API, but additional server-side improvements are recommended before using the application with real users.

1. **Authentication and sessions:** Implement reliable session restoration and logout. Configure JWT expiration and invalidate sessions appropriately.
2. **Cookie security:** Use `httpOnly`, `Secure` in production, and appropriate `SameSite` settings. Ensure cookie-clearing options match the login cookie configuration.
3. **Validation and authorization:** Validate all inputs on the backend. Verify ownership before allowing users to edit or delete blogs and comments.
4. **Comment and like consistency:** Remove a user's likes and comments when their account or associated blog is deleted, as appropriate.
5. **Author information:** Populate the author reference in blog queries so usernames are displayed instead of generic author labels.
6. **Pagination:** Return a total count or `hasMore` flag from the list endpoint for more reliable pagination.
7. **Error handling:** Use consistent API error responses and handle asynchronous controller errors.
8. **Deployment:** Prefer serving the frontend and backend API behind one HTTPS origin. If using separate origins, configure Express CORS with the exact frontend origin and `credentials: true`.

## Build and preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The deployable static output is generated in the `dist/` directory.

Configure the correct public `VITE_API_BASE_URL` before building for production.

---

**Margin** — A space for thoughts worth keeping.