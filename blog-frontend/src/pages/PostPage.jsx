import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Clock3, Copy, Feather, PencilLine, Share2, Trash2 } from 'lucide-react';
import { api, formatDate, getAuthorId, getAuthorLabel, getBlogId, readingMinutes } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { ErrorState } from '../components/Primitives.jsx';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const flash = useFlash();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadBlog = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.getBlog(id);
      if (!result?.blog) throw new Error('This story may have been removed or the link may be incorrect.');
      setBlog(result.blog);
    } catch (requestError) {
      setError(requestError?.message || 'Could not load this story.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadBlog(); }, [loadBlog]);

  const isOwner = useMemo(() => Boolean(user?.id && blog && getAuthorId(blog) === String(user.id)), [user, blog]);

  async function handleDelete() {
    const confirmed = window.confirm('Delete this story? This cannot be undone.');
    if (!confirmed) return;
    setDeleting(true);
    try {
      await api.deleteBlog(id);
      flash('Your story has been deleted.', 'success');
      navigate('/', { replace: true });
    } catch (requestError) {
      flash(requestError?.message || 'Could not delete the story.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function shareStory() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash('Story link copied to your clipboard.', 'success');
    } catch {
      flash('Your browser blocked clipboard access. Copy the URL from the address bar instead.', 'info');
    }
  }

  if (loading) return <div className="content-wrap article-loading"><div className="skeleton skeleton-line short" /><div className="skeleton article-title-skeleton" /><div className="skeleton skeleton-line medium" /><div className="skeleton article-body-skeleton" /></div>;
  if (error) return <div className="content-wrap article-error"><Link to="/" className="back-link"><ArrowLeft size={15} /> Back to all stories</Link><ErrorState title="We couldn’t load this story" message={error} onRetry={loadBlog} /></div>;

  const content = String(blog?.content || '');
  const authorLabel = getAuthorLabel(blog, user);
  const title = blog?.title || 'Untitled story';

  return (
    <article className="article-page content-wrap">
      <div className="article-topline"><Link to="/" className="back-link"><ArrowLeft size={15} /> All stories</Link><button type="button" className="article-share-button" onClick={shareStory}><Share2 size={15} /> Share</button></div>
      <header className="article-header">
        <div className="article-label"><span className="label-dot" /> A MARGIN STORY</div>
        <h1>{title}</h1>
        <p className="article-deck">A thought shared with the Margin reading room.</p>
        <div className="article-byline"><span className="article-author-avatar">{authorLabel.slice(0, 1).toUpperCase()}</span><div className="article-byline-text"><strong>{authorLabel}</strong><span>Published {formatDate(blog?.createdAt || blog?.updatedAt)}</span></div><span className="byline-divider" /><span className="reading-time"><Clock3 size={14} /> {readingMinutes(content)} min read</span></div>
        {isOwner && <div className="article-owner-actions"><Link className="button button-outline" to={`/edit/${getBlogId(blog)}`}><PencilLine size={15} /> Edit story</Link><button type="button" className="button button-danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting…' : <><Trash2 size={15} /> Delete</>}</button></div>}
      </header>
      <div className="article-art"><div className="article-art-label"><span>MARGIN JOURNAL</span><span>VOL. 01 / FIELD NOTES</span></div><div className="article-art-heading">Thoughts<br />worth <em>keeping.</em></div><div className="article-art-symbol">✳</div><div className="article-art-foot"><span>READ WITH AN OPEN MIND</span><Feather size={16} /></div></div>
      <div className="article-layout"><aside className="article-side-note"><span className="side-note-rule" /><span>TAKE YOUR TIME</span><p>Some ideas need a moment to settle.</p><button type="button" className="icon-text-button" onClick={shareStory}><Copy size={14} /> Copy link</button></aside><div className="article-content"><div className="article-content-marker">THE STORY</div><div className="article-prose">{content.split(/\n{2,}/).map((paragraph, index) => paragraph.trim() ? <p key={index}>{paragraph}</p> : null)}</div><div className="article-end-mark"><span /><span>✳</span><span /></div><div className="article-end-note"><strong>Thanks for reading.</strong><p>Good thoughts are even better when they’re shared.</p><Link to="/" className="text-link">Keep exploring <ArrowUpRight size={15} /></Link></div></div></div>
      <div className="article-bottom-nav"><Link to="/" className="button button-outline"><ArrowLeft size={15} /> More stories</Link><span>END OF THIS CHAPTER</span><button type="button" className="button button-dark" onClick={shareStory}>Share this story <Share2 size={15} /></button></div>
    </article>
  );
}
