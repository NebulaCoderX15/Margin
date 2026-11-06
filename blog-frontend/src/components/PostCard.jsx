import { ArrowUpRight, Clock3, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, getAuthorLabel, getBlogId, readingMinutes } from '../api.js';

const covers = [
  'bg-[#e2ead7] text-[#294836] dark:bg-[#304034] dark:text-[#e0ead9]',
  'bg-[#f1e5c9] text-[#66502f] dark:bg-[#403827] dark:text-[#f1dfb9]',
  'bg-[#e9e1ed] text-[#55425f] dark:bg-[#392f40] dark:text-[#e6d8ed]',
  'bg-[#dce8ed] text-[#365463] dark:bg-[#293b43] dark:text-[#d4e8f0]',
  'bg-[#f2e0d6] text-[#704a3c] dark:bg-[#44332c] dark:text-[#f0d3c4]',
  'bg-[#e5e8d4] text-[#4c5939] dark:bg-[#353d2c] dark:text-[#e1e8c9]',
];
const motifs = ['◌', '✳', '⌁', '◈', '✺', '〰'];

export default function PostCard({ blog, index = 0, currentUser }) {
  const id = getBlogId(blog);
  const title = blog?.title || 'Untitled story';
  const content = String(blog?.content || '').trim();
  const excerpt = content.length > 166 ? `${content.slice(0, 166).trimEnd()}…` : content || 'This story has no preview yet.';
  const motifIndex = index % covers.length;

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-soft dark:border-[#303b33] dark:bg-[#1b241e]">
      <Link to={id ? `/post/${id}` : '/'} className={`relative flex h-52 flex-col justify-between overflow-hidden p-5 transition ${covers[motifIndex]}`} aria-label={`Read ${title}`}>
        <span className="flex items-center justify-between text-[8px] font-extrabold tracking-[.13em]">MARGIN JOURNAL <span>NO. {String(index + 1).padStart(2, '0')}</span></span>
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-[112px] opacity-20 transition duration-300 group-hover:scale-110" aria-hidden="true">{motifs[motifIndex]}</span>
        <span className="relative flex items-center gap-2 border-t border-current/15 pt-3 text-[9px] font-bold tracking-[.1em]"><Feather size={14} /> A story worth keeping <span className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-current/20 transition group-hover:-translate-y-1 group-hover:translate-x-1"><ArrowUpRight size={17} /></span></span>
      </Link>
      <div className="p-[18px]">
        <div className="flex items-center justify-between gap-3 text-[10px] text-muted dark:text-[#aeb9ad]"><span className="font-extrabold tracking-[.12em] text-[#839174]">FIELD NOTES</span><span>{formatDate(blog?.createdAt || blog?.updatedAt)}</span></div>
        <h2 className="mt-3 font-display text-xl font-semibold leading-tight tracking-tight text-ink dark:text-[#e1e9df]"><Link className="transition hover:text-forest dark:hover:text-[#c5e879]" to={id ? `/post/${id}` : '/'}>{title}</Link></h2>
        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-xs leading-6 text-muted dark:text-[#aeb9ad]">{excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 dark:border-[#303b33]">
          <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold text-ink dark:text-[#dce5da]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-moss text-[10px] text-forest dark:bg-[#344735] dark:text-[#d6e7cf]">{getAuthorLabel(blog, currentUser).slice(0, 1).toUpperCase()}</span><span className="truncate">{getAuthorLabel(blog, currentUser)}</span></div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] text-muted dark:text-[#aeb9ad]"><Clock3 size={13} /> {readingMinutes(content)} min</span>
        </div>
      </div>
    </article>
  );
}
