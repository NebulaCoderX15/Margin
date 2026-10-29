import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookOpenText, Menu, PenLine, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';

function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Margin home">
      <span className="brand-icon"><BookOpenText size={20} strokeWidth={2.1} /></span>
      <span>margin<span className="brand-dot">.</span></span>
    </Link>
  );
}

export default function SiteLayout() {
  const { user, signOut } = useAuth();
  const flash = useFlash();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSignOut() {
    signOut();
    setMobileOpen(false);
    flash('You’ve signed out. See you again soon.', 'success');
    navigate('/');
  }

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="site-shell min-h-screen bg-paper text-ink">
      <div className="announcement-bar">
        <span><Sparkles size={13} /> A small corner for big thoughts</span>
        <span className="announcement-right">Read slowly. Think deeply. <ArrowUpRight size={13} /></span>
      </div>
      <header className="site-header sticky top-0 z-20 border-b">
        <div className="site-header-inner mx-auto flex w-full items-center justify-between">
          <Brand />
          <nav className={`main-nav ${mobileOpen ? 'main-nav-open' : ''}`} aria-label="Main navigation">
            <NavLink to="/" end onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Discover</NavLink>
            <a href="/#latest" onClick={closeMobile} className="nav-link">Latest stories</a>
            {user && <NavLink to="/write" onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>Write a story</NavLink>}
            <div className="mobile-nav-actions">
              {user ? (
                <button className="button button-quiet" type="button" onClick={handleSignOut}>Sign out</button>
              ) : (
                <><Link to="/login" onClick={closeMobile} className="button button-quiet">Sign in</Link><Link to="/register" onClick={closeMobile} className="button button-dark">Get started <ArrowUpRight size={15} /></Link></>
              )}
            </div>
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <Link to="/write" className="button button-write"><PenLine size={15} /> Write</Link>
                <button type="button" className="user-chip" title={`Signed in as ${user.username || user.email}`} onClick={handleSignOut}>
                  <span className="user-avatar">{(user.username || user.email || 'M').slice(0, 1).toUpperCase()}</span>
                  <span className="user-chip-name">{user.username || 'Your account'}</span>
                </button>
              </>
            ) : (
              <><Link to="/login" className="button button-quiet header-signin">Sign in</Link><Link to="/register" className="button button-dark header-join">Get started <ArrowUpRight size={15} /></Link></>
            )}
          </div>
          <button className="mobile-menu-button" type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <main className="site-main min-h-[65vh]"><Outlet /></main>
      <footer className="site-footer border-t">
        <div className="footer-inner">
          <Brand />
          <p>Good ideas deserve a little room.</p>
          <span>© {new Date().getFullYear()} Margin Journal</span>
        </div>
      </footer>
    </div>
  );
}
