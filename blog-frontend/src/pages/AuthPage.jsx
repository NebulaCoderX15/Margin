import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpenText, Check, Eye, EyeOff, Fingerprint, Leaf, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { api, ApiError } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { ButtonSpinner, Eyebrow } from '../components/Primitives.jsx';

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const { user, setUser, isCheckingSession } = useAuth();
  const flash = useFlash();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';
  const [values, setValues] = useState({ username: '', email: '', identifier: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isCheckingSession && !user) return <div className="route-loading auth-route-loading"><span className="small-spinner" /> <span>Checking your session…</span></div>;
  if (user) return <Navigate to="/" replace />;

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (isRegister) {
      if (values.username.trim().length < 3) return setError('Your username needs at least 3 characters.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return setError('Enter a valid email address.');
      if (values.password.length < 8) return setError('Use at least 8 characters for your password.');
      if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) return setError('Add at least one letter and one number to your password.');
      if (values.password !== values.confirmPassword) return setError('Those passwords do not match yet.');
    } else {
      if (!values.identifier.trim() || !values.password) return setError('Enter your username or email and password.');
    }

    setLoading(true);
    try {
      const result = isRegister
        ? await api.register({ username: values.username.trim(), email: values.email.trim().toLowerCase(), password: values.password })
        : await api.login(values.identifier.trim(), values.password);
      if (!result?.user) throw new ApiError('We couldn’t complete that request just now. Please try again.');
      setUser(result.user);
      flash(isRegister ? `Welcome to Margin, ${result.user.username || 'writer'}. Your account is ready.` : `Welcome back, ${result.user.username || 'writer'}.`, 'success');
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page content-wrap">
      <section className="auth-story-panel">
        <Link to="/" className="auth-back"><ArrowLeft size={15} /> Back to the reading room</Link>
        <div className="auth-story-main">
          <div className="auth-brand-mark"><BookOpenText size={24} /></div>
          <Eyebrow>GOOD IDEAS LIVE HERE</Eyebrow>
          <h1>{isRegister ? <>Make room<br />for <em>your voice.</em></> : <>Good to have<br />you <em>back.</em></>}</h1>
          <p>{isRegister ? 'Join a thoughtful little community for stories, lessons, questions, and everything in between.' : 'Pick up where you left off. Your next good idea might be one page away.'}</p>
          <div className="auth-quote"><span className="quote-mark">“</span><p>We write to taste life twice, in the moment and in retrospect.</p><span className="quote-author">— ANAÏS NIN</span></div>
        </div>
        <div className="auth-story-footer"><span><Leaf size={14} /> A little more meaning.</span><span>EST. 2026</span></div>
        <span className="auth-art-shape auth-shape-one" aria-hidden="true">✳</span><span className="auth-art-shape auth-shape-two" aria-hidden="true">◌</span>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-content">
          <div className="auth-mobile-brand"><Link to="/" className="brand"><span className="brand-icon"><BookOpenText size={20} /></span><span>margin<span className="brand-dot">.</span></span></Link></div>
          <div className="auth-heading"><div className="auth-form-icon"><Fingerprint size={20} /></div><div className="section-eyebrow">{isRegister ? 'A FRESH BEGINNING' : 'YOUR SPACE AWAITS'}</div><h2>{isRegister ? 'Create your account' : 'Sign in to Margin'}</h2><p>{isRegister ? 'A few little details, then you’re in.' : 'Enter your details and step back into the story.'}</p></div>
          {error && <div className="form-error" role="alert"><span>!</span><p>{error}</p></div>}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister ? <>
              <div className="form-field"><label htmlFor="username">Username</label><div className="form-input-wrap"><UserRound size={17} /><input id="username" name="username" value={values.username} onChange={(e) => update('username', e.target.value)} autoComplete="username" minLength={3} maxLength={30} placeholder="How should we call you?" required /></div><small>At least 3 characters. This is how your writing will be credited.</small></div>
              <div className="form-field"><label htmlFor="email">Email address</label><div className="form-input-wrap"><Mail size={17} /><input id="email" name="email" type="email" value={values.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" placeholder="you@example.com" required /></div></div>
            </> : <div className="form-field"><label htmlFor="identifier">Username or email</label><div className="form-input-wrap"><Mail size={17} /><input id="identifier" name="identifier" value={values.identifier} onChange={(e) => update('identifier', e.target.value)} autoComplete="username" placeholder="Your username or email" required /></div></div>}
            <div className="form-field"><label htmlFor="password">Password</label><div className="form-input-wrap"><LockKeyhole size={17} /><input id="password" name="password" type={showPassword ? 'text' : 'password'} value={values.password} onChange={(e) => update('password', e.target.value)} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder={isRegister ? 'At least 8 characters' : 'Your password'} required /><button className="reveal-password" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{isRegister && <div className="password-hint"><span className={values.password.length >= 8 ? 'hint-good' : ''}><Check size={12} /> 8+ characters</span><span className={/\d/.test(values.password) ? 'hint-good' : ''}><Check size={12} /> A number</span></div>}</div>
            {isRegister && <div className="form-field"><label htmlFor="confirmPassword">Confirm password</label><div className="form-input-wrap"><LockKeyhole size={17} /><input id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={values.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} autoComplete="new-password" placeholder="Type your password again" required /><button className="reveal-password" type="button" onClick={() => setShowConfirm((value) => !value)} aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'}>{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{values.confirmPassword && <span className={`confirm-hint ${values.confirmPassword === values.password ? 'hint-good' : 'hint-bad'}`}>{values.confirmPassword === values.password ? 'Passwords match' : 'Passwords do not match yet'}</span>}</div>}
            <button type="submit" className="button button-dark auth-submit" disabled={loading}>{loading ? <><ButtonSpinner /> Working on it…</> : <>{isRegister ? 'Create my account' : 'Sign in'} <ArrowRight size={16} /></>}</button>
          </form>
          <div className="auth-switch">{isRegister ? 'Already part of Margin?' : 'New around here?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'} <ArrowRight size={14} /></Link></div>
          <div className="auth-secure-note"><span><Check size={13} /></span><p>For your security, choose a strong password you don’t use for another account.</p></div>
          <div className="auth-bottom-note"><Sparkles size={13} /> Come as you are. Leave with a thought.</div>
        </div>
      </section>
    </div>
  );
}
