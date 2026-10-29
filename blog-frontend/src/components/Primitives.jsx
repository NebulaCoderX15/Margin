import { ArrowRight, BookOpen, LoaderCircle, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoadingGrid({ count = 6 }) {
  return <div className="post-grid">{Array.from({ length: count }).map((_, i) => <article className="post-card skeleton-card" key={i} aria-hidden="true"><div className="skeleton skeleton-cover" /><div className="post-card-body"><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-line title-line" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line medium" /></div></article>)}</div>;
}

export function EmptyState({ title = 'Nothing here yet', description = 'When a story is published, it will show up here.', action }) {
  return <div className="empty-state"><div className="empty-state-icon"><BookOpen size={23} /></div><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function SearchBox({ value, onChange, placeholder = 'Search ideas, stories, and people', inputRef }) {
  return <label className="search-box"><Search size={18} aria-hidden="true" /><input ref={inputRef} type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label="Search stories" /><kbd>/</kbd></label>;
}

export function Eyebrow({ children, icon = true }) {
  return <div className="eyebrow">{icon && <Sparkles size={13} aria-hidden="true" />}{children}</div>;
}

export function InlineNotice({ title, message, action }) {
  return <div className="inline-notice"><div><strong>{title}</strong><p>{message}</p></div>{action}</div>;
}

export function ErrorState({ title = 'We couldn’t load the stories', message, onRetry }) {
  return <div className="error-state"><div className="error-state-icon">!</div><h3>{title}</h3><p>{message || 'We couldn’t load this just now. Please check your connection and try again.'}</p>{onRetry && <button type="button" className="button button-dark" onClick={onRetry}>Try again <ArrowRight size={15} /></button>}</div>;
}

export function ButtonSpinner() {
  return <LoaderCircle size={17} className="spin" aria-hidden="true" />;
}

export function ReadingLink({ to, children = 'Read story' }) {
  return <Link className="text-link" to={to}>{children} <ArrowRight size={15} /></Link>;
}
