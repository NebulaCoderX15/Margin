import { ArrowUpRight, Clock3, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, getAuthorLabel, getBlogId, readingMinutes } from '../api.js';

const covers = ['cover-sage', 'cover-sun', 'cover-lilac', 'cover-blue', 'cover-peach', 'cover-olive'];
const motifs = ['◌', '✳', '⌁', '◈', '✺', '〰'];

export default function PostCard({ blog, index = 0, currentUser }) {
  const id = getBlogId(blog);
  const title = blog?.title || 'Untitled story';
  const content = String(blog?.content || '').trim();
  const excerpt = content.length > 166 ? `${content.slice(0, 166).trimEnd()}…` : content || 'This story has no preview yet.';
  const motifIndex = index % covers.length;

  return (
    <article className="post-card">
      <Link to={id ? `/post/${id}` : '/'} className={`post-cover ${covers[motifIndex]}`} aria-label={`Read ${title}`}>
        <span className="cover-kicker">MARGIN JOURNAL <span>NO. {String(index + 1).padStart(2, '0')}</span></span>
        <span className="cover-motif" aria-hidden="true">{motifs[motifIndex]}</span>
        <span className="cover-bottom"><Feather size={14} /> A story worth keeping</span>
        <span className="cover-open"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="post-card-body">
        <div className="post-meta"><span className="post-label">FIELD NOTES</span><span>{formatDate(blog?.createdAt || blog?.updatedAt)}</span></div>
        <h2><Link to={id ? `/post/${id}` : '/'}>{title}</Link></h2>
        <p className="post-excerpt">{excerpt}</p>
        <div className="post-card-bottom">
          <div className="author-mini"><span className="author-avatar">{getAuthorLabel(blog, currentUser).slice(0, 1).toUpperCase()}</span><span>{getAuthorLabel(blog, currentUser)}</span></div>
          <span className="reading-time"><Clock3 size={13} /> {readingMinutes(content)} min</span>
        </div>
      </div>
    </article>
  );
}
