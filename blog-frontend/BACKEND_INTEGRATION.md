# Backend integration hardening for Margin

The frontend works with the current public blog API, but real logout and server-backed session restoration need two small endpoints. These changes also show how to set a safer cookie and align its lifetime with the JWT. Review these with your existing route/controller code before deploying.

## 1. Add a current-user and logout controller

Create `src/controllers/session.controller.js`:

```js
import User from '../models/auth.model.js';

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select('_id username email role');
    if (!user) {
      return res.status(401).json({ message: 'Session user no longer exists' });
    }

    return res.status(200).json({
      user: {
        id: String(user._id),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('getCurrentUser failed:', error);
    return res.status(500).json({ message: 'Could not validate the current session' });
  }
}

export function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.status(200).json({ message: 'Signed out successfully' });
}
```

Create `src/routes/session.route.js`:

```js
import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getCurrentUser, logout } from '../controllers/session.controller.js';

const router = express.Router();
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', logout);

export default router;
```

Then in `src/app.js`, add the import and mount it alongside the existing routers:

```js
import sessionRouter from './routes/session.route.js';
// Existing app setup and existing route mounts stay in place.
app.use('/api/auth', sessionRouter);
```

The logout route is intentionally not protected by `authMiddleware`: it must be able to clear an expired or invalid cookie too.

## 2. Set a secure cookie and a token expiry

In both `src/controllers/auth.controller.js` and `src/controllers/login.controller.js`, sign the JWT with an expiry:

```js
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

Set the cookie using options whose lifetime matches that expiry:

```js
const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

res.cookie('token', token, authCookieOptions);
```

Define the `authCookieOptions` in both controllers or move it to a shared helper and import it. The `clearCookie` options should match the cookie's path and security attributes. HTTPS is required in production.

## 3. If frontend and backend use different origins

The included Vite proxy avoids CORS for local development. If the deployed frontend calls a separate API origin directly, install `cors` in the backend and configure an exact trusted origin with credentials. For example:

```js
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
```

Set `FRONTEND_ORIGIN` to the deployed frontend origin, without a trailing path. Do not combine credentialed cookies with `Access-Control-Allow-Origin: *`. Cross-site cookie deployments may require `sameSite: 'none'` and `secure: true`; prefer a same-site HTTPS deployment where possible.

## 4. A few worthwhile backend follow-ups

- Return `409 Conflict` for duplicate username/email instead of `402` in registration.
- Validate required fields and sensible length limits server-side.
- Wrap register/create/update controllers in reliable error handling so unexpected database errors become JSON responses.
- Return a populated author profile in `getall`/`getblog` if the UI should display usernames rather than “Community writer.”
- Return `{ blogs, page, limit, total, hasMore }` from `getall` for reliable pagination.
- Keep `JWT_SECRET` and `MONGO_URL` only in backend `.env`; never publish them to the Vite app.
