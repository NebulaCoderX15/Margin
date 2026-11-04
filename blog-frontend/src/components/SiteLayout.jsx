import { useState ,useEffect,useRef} from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookOpenText, ChevronDown, LogOut, Menu, PenLine, Sparkles, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { api } from '../api.js';

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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.profile-menu-wrap')) {
      setProfileMenuOpen(false);
    }
  };

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      setProfileMenuOpen(false);
    }
  };

  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);

  return () => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleEscape);
  };
}, []);

const profileRef = useRef(null);

useEffect(() => {
  function handleClickOutside(event) {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileMenuOpen(false);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  function handleSignOut() {
    signOut();
    setMobileOpen(false);
    setProfileMenuOpen(false);
    flash('You’ve signed out. See you again soon.', 'success');
    navigate('/');
  }

  async function handleDeleteAccount() {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await api.deleteAccount();
      signOut();
      setDeleteDialogOpen(false);
      setProfileMenuOpen(false);
      setMobileOpen(false);
      flash('Your account has been deleted.', 'success');
      navigate('/');
    } catch (error) {
      flash(error?.message || 'We couldn’t delete your account. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
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
                <div className="profile-menu-wrap"   ref={profileRef}>
                  <button type="button" className="user-chip" title={`Signed in as ${user.username || user.email}`} aria-haspopup="menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)}>
                    <span className="user-avatar">{(user.username || user.email || 'M').slice(0, 1).toUpperCase()}</span>
                    <span className="user-chip-name">{user.username || 'Your account'}</span>
                    <ChevronDown size={14} />
                  </button>
                  {profileMenuOpen && (
                    <>
                      <button type="button" className="profile-menu-backdrop" aria-label="Close account menu" onClick={() => setProfileMenuOpen(false)} />
                      <div className="profile-menu" role="menu">
                        <button type="button" role="menuitem" className="profile-menu-item profile-menu-danger" onClick={() => { setProfileMenuOpen(false); setDeleteDialogOpen(true); }}>
                          <Trash2 size={16} /> Delete account
                        </button>
                        <button type="button" role="menuitem" className="profile-menu-item" onClick={handleSignOut}>
                          <LogOut size={16} /> Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
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
      {deleteDialogOpen && (
        <div className="account-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isDeleting) setDeleteDialogOpen(false); }}>
          <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
            <div className="account-dialog-icon"><Trash2 size={21} /></div>
            <h2 id="delete-account-title">Delete your account?</h2>
            <p>This action can’t be undone. Your account will be permanently deleted.</p>
            <div className="account-dialog-actions">
              <button type="button" className="button button-quiet" disabled={isDeleting} onClick={() => setDeleteDialogOpen(false)}>Cancel</button>
              <button type="button" className="button button-danger" disabled={isDeleting} onClick={handleDeleteAccount}>
                {isDeleting ? 'Deleting…' : 'Delete account'}
              </button>
            </div>
          </section>
        </div>
      )}
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
