const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/auth')
  .trim()
  .replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function extractServerMessage(data) {
  if (typeof data?.message === 'string' && data.message.trim()) return data.message.trim();
  if (typeof data?.error === 'string' && data.error.trim()) return data.error.trim();
  if (typeof data?.meesage === 'string' && data.meesage.trim()) return data.meesage.trim();
  if (Array.isArray(data?.errors)) {
    const messages = data.errors
      .map((item) => typeof item === 'string' ? item : item?.message)
      .filter(Boolean);
    if (messages.length) return messages.join(' ');
  }
  return '';
}

// Backend internals belong in developer tools, not in messages shown to readers.
const TECHNICAL_MESSAGE = /mongoose|mongodb|validation failed|cast to|schema|stack trace|stack|\berror\b|\bexception\b|traceback|econnrefused|enotfound|jsonwebtoken|jwt|cannot find module|cannot\s+(?:get|post|put|patch|delete|options)\b|not defined|undefined|syntaxerror|referenceerror|typeerror|controller|middleware|express|api route|\/api\/|localhost|127\.0\.0\.1|port\s*\d+|http\s*\d{3}|status code|at\s+[\w.$]+\s*\(|duplicate key|write concern|bson|connection string|endpoint|check the .*controller|failed to fetch/i;

function fallbackMessage(status, path) {
  if (status === 401) {
    return path === '/login'
      ? 'Those sign-in details don’t match. Check your username or email and password, then try again.'
      : 'Please sign in to continue.';
  }
  if (status === 403) return 'You don’t have permission to do that.';
  if (status === 404) {
    return path.startsWith('/getblog/')
      ? 'We couldn’t find that story. It may have been removed.'
      : 'We couldn’t find what you were looking for. Please refresh and try again.';
  }
  if (status === 402 || status === 409) return 'Those details may already be in use. Please check them and try again.';
  if (status === 429) return 'You’re trying that a little too often. Please wait a moment and try again.';
  if (status >= 500) return 'Something went wrong on our side. Please try again in a moment.';
  if (status === 400 || status === 422) return 'Please check the information you entered and try again.';
  return 'Something didn’t go as expected. Please try again.';
}

function userFacingMessage(data, status, path) {
  // Server-side errors are intentionally hidden from the interface.
  if (status >= 500) return fallbackMessage(status, path);
  const message = extractServerMessage(data).replace(/[\r\n]+/g, ' ').trim();
  if (!message || TECHNICAL_MESSAGE.test(message) || message.length > 220) {
    return fallbackMessage(status, path);
  }
  // Avoid showing server-generated messages that look like dumps or code.
  if (/[{}<>]|\b(?:Error|Exception):\s/.test(message)) return fallbackMessage(status, path);
  return message;
}

async function request(path, { method = 'GET', body, signal, headers = {} } = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20000);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });
  } catch (error) {
    // Keep troubleshooting details available to the developer, without exposing them to visitors.
    console.warn('[Margin] Request could not be completed:', { path, method, error });
    if (error?.name === 'AbortError') {
      throw new ApiError('This is taking longer than expected. Please try again.');
    }
    throw new ApiError('We couldn’t connect right now. Please check your connection and try again.');
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener('abort', forwardAbort);
  }

  const contentType = response.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    try { data = await response.json(); } catch { data = null; }
  } else if (!response.ok) {
    try {
      const text = (await response.text()).slice(0, 240);
      data = /^\s*</.test(text) ? null : { message: text };
    } catch { data = null; }
  }

  if (!response.ok) {
    const message = userFacingMessage(data, response.status, path);
    // Raw details stay in developer tools and are never used as the visible message.
    console.warn('[Margin] API request returned an error:', {
      path,
      method,
      status: response.status,
      serverMessage: extractServerMessage(data) || undefined,
    });
    throw new ApiError(message, response.status, data);
  }
  return data;
}

export const api = {
  register: (payload, signal) => request('/register', { method: 'POST', body: payload, signal }),
  getCurrentUser: (signal) => request('/me', { signal }),
  login: (identifier, password, signal) => request('/login', {
    method: 'POST',
    body: { username: identifier, email: identifier, password },
    signal,
  }),
  getBlogs: ({ page = 1, limit = 9, signal } = {}) => request(`/getall?page=${page}&limit=${limit}`, { signal }),
  getBlog: (id, signal) => request(`/getblog/${encodeURIComponent(id)}`, { signal }),
  createBlog: (payload, signal) => request('/create', { method: 'POST', body: payload, signal }),
  updateBlog: (id, payload, signal) => request(`/updateblog/${encodeURIComponent(id)}`, { method: 'PATCH', body: payload, signal }),
  deleteBlog: (id, signal) => request(`/deleteblog/${encodeURIComponent(id)}`, { method: 'DELETE', signal }),
  logout: (signal) => request('/logout', { method: 'POST', signal }),
};

export function getBlogId(blog) {
  return blog?._id || blog?.id || blog?.blogId || '';
}

export function getAuthorId(blog) {
  const author = blog?.author;
  if (author && typeof author === 'object') return author._id || author.id || '';
  return author ? String(author) : '';
}

export function formatDate(dateValue) {
  if (!dateValue) return 'Recently';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export function readingMinutes(content = '') {
  const words = String(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function getAuthorLabel(blog, currentUser) {
  const author = blog?.author;
  if (author && typeof author === 'object') {
    if (author.username) return author.username;
    if (author.name) return author.name;
  }
  const authorId = getAuthorId(blog);
  if (currentUser?.id && authorId && String(currentUser.id) === authorId) return currentUser.username || 'You';
  // The current API returns an author ID instead of a populated author profile.
  return 'Community writer';
}
