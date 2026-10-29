import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'margin.currentUser';

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const setUser = useCallback((nextUser) => {
    setUserState(nextUser || null);
    try {
      if (nextUser) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Authentication still works for the active page if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.getCurrentUser().then((result) => {
      if (!cancelled) setUser(result?.user || null);
    }).catch((error) => {
      if (cancelled) return;
      if (error?.status === 401) setUser(null);
      // Older/current backend revisions have no /me route. In that case, keep the
      // tab's non-sensitive user display data and rely on protected API responses.
      if (error?.status !== 404 && error?.status !== 401 && !user) setUser(null);
    }).finally(() => {
      if (!cancelled) setIsCheckingSession(false);
    });
    return () => { cancelled = true; };
  // Run once when the app boots; setUser is stable by design.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser]);

  const signOut = useCallback(() => {
    // Sign out immediately in the interface. Cookie cleanup can finish in the background.
    setUser(null);
    api.logout().catch((error) => {
      // A failed server request should not block the reader from leaving their account view.
      console.warn('[Margin] Sign-out cleanup could not be completed:', error);
    });
  }, [setUser]);

  const value = useMemo(() => ({ user, setUser, signOut, isCheckingSession }), [user, setUser, signOut, isCheckingSession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
