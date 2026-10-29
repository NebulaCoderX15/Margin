# Margin — Blog Frontend

A responsive Vite + React + Tailwind frontend designed for the public `NebulaCoderX15/blog_backend` Express/MongoDB API. It connects to the endpoints currently present in the repository and includes the client states expected from a real blog product: loading, empty feed, errors, sign up, sign in, create, edit, delete, search, pagination, and story detail pages.

## Run locally

Requirements: Node.js 20.19+ (or a Node version supported by Vite 7) and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

In Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Start your backend separately on `http://localhost:3000`. Vite proxies requests starting with `/api` to that backend, so local cookie authentication works without configuring browser CORS for development. Open `http://localhost:5173`.

## Features

- Editorial-style landing page with responsive navigation and feed.
- Blog feed from `GET /api/auth/getall?page=1&limit=9` with load-more pagination and client-side search.
- Public story detail view and reading-time estimate.
- Sign up via `POST /api/auth/register` and sign in via `POST /api/auth/login`.
- Create (`POST /api/auth/create`), edit (`PATCH /api/auth/updateblog/:id`) and delete (`DELETE /api/auth/deleteblog/:id`) stories.
- Ownership-aware edit/delete controls based on the blog's `author` ID and logged-in user's `id`.
- Cookie-aware requests (`credentials: include`), timeout handling with visitor-friendly messages, safe API error handling, loading skeletons, empty states, success/error notices, password visibility toggles, and client-side form validation.
- Responsive layouts, keyboard focus styling, semantic form labels, reduced-motion support, mobile navigation, and a `/` search keyboard shortcut (Escape clears the search).

## API contract used

All of the current routes are mounted below `/api/auth` in your backend:

| Frontend action | Method | Endpoint | Body |
|---|---|---|---|
| Register | POST | `/register` | `{ username, email, password }` |
| Sign in | POST | `/login` | `{ username, email, password }` |
| Sign out (optional backend enhancement) | POST | `/logout` | — |
| List stories | GET | `/getall?page=1&limit=9` | — |
| Story detail | GET | `/getblog/:id` | — |
| Create story | POST | `/create` | `{ title, content }` |
| Update story | PATCH | `/updateblog/:id` | `{ title, content }` |
| Delete story | DELETE | `/deleteblog/:id` | — |

Your current `getall` response is expected to include `{ blogs: [...] }`; the detail response `{ blog: ... }`; the login/register responses `{ user: { id, username, email, role } }`. Story content is rendered as plain text, not HTML/Markdown. Images, tags, comments, likes, saved stories, password reset, and admin screens are not included because the backend does not currently provide matching data fields or endpoints.

## Important backend integration notes before production

This frontend is wired to the current API, but the existing backend is still a learning project and needs a few server-side improvements before real users should rely on its authentication:

1. **Session restore and real logout.** The frontend tries `GET /me` on startup and `POST /logout` when signing out. If either optional endpoint is unavailable, the interface stays user-friendly; sign-out happens immediately in the current tab. Add both routes using the example in [`BACKEND_INTEGRATION.md`](./BACKEND_INTEGRATION.md) for reliable session restoration and cookie invalidation.
2. **Cookie security and JWT expiry.** The current register/login controllers call `res.cookie("token", token)` without explicit cookie options and sign tokens without an expiry. Configure an `httpOnly` cookie, matching clear-cookie options, and an explicit JWT expiry. See the integration guide.
3. **Error handling and validation.** Validate all inputs in the backend and wrap asynchronous controllers in `try/catch` or an Express async error handler. Do not depend on frontend validation for security.
4. **Browser deployment.** Local development uses Vite's proxy. For production, prefer serving the frontend and `/api` behind one HTTPS origin. If they must be on separate origins, configure Express CORS with the exact frontend origin and `credentials: true`; the fetch client already includes credentials. Cookie `SameSite`/`Secure` settings must match your deployment topology.
5. **Author display.** The current list endpoint doesn't populate the author document, so other users' stories show as “Community writer.” To display usernames, populate `author` in the list/detail queries or add author details to your API response.
6. **Pagination.** The current list endpoint doesn't return a total count or `hasMore` flag, so the frontend detects the end when a returned page has fewer than the requested page size. Adding `total` or `hasMore` to the API response is more robust.

## Environment variables

The default `.env.example` value is:

```env
VITE_API_BASE_URL=/api/auth
```

For a separately hosted API, set it to the full API prefix, for example `https://api.example.com/api/auth`, before running the production build. Vite exposes variables prefixed with `VITE_` to browser code, so **never** put `MONGO_URL`, `JWT_SECRET`, an ImageKit private key, or other server-only secrets in this frontend's `.env` file.

## Build and preview

```bash
npm run build
npm run preview
```

The deployable static output is written to `dist/`. Configure the correct public `VITE_API_BASE_URL` before building.
