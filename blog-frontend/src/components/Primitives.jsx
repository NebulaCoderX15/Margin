import { ArrowRight, BookOpen, LoaderCircle, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoadingGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading stories">
      {Array.from({ length: count }).map((_, i) => (
        <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-card dark:border-[#303b33] dark:bg-[#1b241e]" key={i} aria-hidden="true">
          <div className="h-52 animate-pulse bg-[#e9ecdf] dark:bg-[#29352c]" />
          <div className="space-y-4 p-5"><div className="h-3 w-1/3 animate-pulse rounded bg-[#e9ecdf] dark:bg-[#29352c]" /><div className="h-6 w-4/5 animate-pulse rounded bg-[#e9ecdf] dark:bg-[#29352c]" /><div className="h-3 w-full animate-pulse rounded bg-[#e9ecdf] dark:bg-[#29352c]" /><div className="h-3 w-2/3 animate-pulse rounded bg-[#e9ecdf] dark:bg-[#29352c]" /></div>
        </article>
      ))}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description = 'When a story is published, it will show up here.', action }) {
  return <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center"><span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#e8eedf] text-forest dark:bg-[#293a2e] dark:text-[#c5e879]"><BookOpen size={23} /></span><h3 className="font-display text-2xl font-semibold tracking-tight text-ink dark:text-[#e1e9df]">{title}</h3><p className="mt-2 text-sm leading-7 text-muted dark:text-[#aeb9ad]">{description}</p>{action && <div className="mt-6">{action}</div>}</div>;
}

export function SearchBox({ value, onChange, placeholder = 'Search ideas, stories, and people', inputRef }) {
  return <label className="flex min-h-11 w-full max-w-sm items-center gap-3 rounded-full border border-line bg-white/70 px-4 text-muted shadow-sm transition focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/10 dark:border-[#3b493e] dark:bg-[#1b241e]"><Search size={18} aria-hidden="true" /><input ref={inputRef} className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted dark:text-[#e1e9df]" type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label="Search stories" /><kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] dark:border-[#3b493e]">/</kbd></label>;
}

export function Eyebrow({ children, icon = true }) {
  return <div className="flex items-center gap-2 text-[9px] font-extrabold tracking-[.14em] text-[#839174]">{icon && <Sparkles size={13} aria-hidden="true" className="text-clay" />}{children}</div>;
}

export function InlineNotice({ title, message, action }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-white/70 p-4 dark:border-[#3b493e] dark:bg-[#1b241e]"><div><strong className="text-sm text-ink dark:text-[#e1e9df]">{title}</strong><p className="mt-1 text-sm text-muted dark:text-[#aeb9ad]">{message}</p></div>{action}</div>;
}

export function ErrorState({ title = 'We couldn’t load the stories', message, onRetry }) {
  return <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center"><span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#fae6df] text-lg font-bold text-[#a94e38] dark:bg-[#432b25] dark:text-[#f0a18b]">!</span><h3 className="font-display text-2xl font-medium tracking-tight text-ink dark:text-[#e1e9df]">{title}</h3><p className="mt-3 max-w-md text-xs leading-6 text-muted dark:text-[#aeb9ad]">{message || 'We couldn’t load this just now. Please check your connection and try again.'}</p>{onRetry && <button type="button" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-forest dark:bg-[#c5e879] dark:text-[#152018]" onClick={onRetry}>Try again <ArrowRight size={15} /></button>}</div>;
}

export function ButtonSpinner() { return <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />; }
export function ReadingLink({ to, children = 'Read story' }) { return <Link className="inline-flex items-center gap-2 text-sm font-semibold text-forest transition hover:gap-3 dark:text-[#c5e879]" to={to}>{children} <ArrowRight size={15} /></Link>; }
