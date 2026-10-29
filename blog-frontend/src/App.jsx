import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { LoaderCircle } from 'lucide-react';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import PostPage from './pages/PostPage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { user, isCheckingSession } = useAuth();
  const location = useLocation();
  if (isCheckingSession && !user) return <div className="route-loading flex min-h-screen items-center justify-center"><LoaderCircle size={23} className="spin" /><span>Checking your session…</span></div>;
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/write" element={<ProtectedRoute><EditorPage mode="create" /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditorPage mode="edit" /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
