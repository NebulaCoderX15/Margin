import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpenText, Feather, PenLine, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, getAuthorId, getBlogId } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import PostCard from '../components/PostCard.jsx';
import { EmptyState, ErrorState, LoadingGrid, SearchBox } from '../components/Primitives.jsx';
import { useFlash } from '../context/FlashContext.jsx';

const PAGE_SIZE = 9;

function newestFirst(posts) {
  return [...posts].sort((left, right) => {
    const leftTime = new Date(left?.createdAt || left?.updatedAt || 0).getTime() || 0;
    const rightTime = new Date(right?.createdAt || right?.updatedAt || 0).getTime() || 0;
    return rightTime - leftTime;
  });
}

export default function HomePage() {
  const { user } = useAuth();
  const flash = useFlash();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('all');
  const searchRef = useRef(null);

  useEffect(() => {
    function handleSearchShortcut(event) {
      const tag = event.target?.tagName;
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && !event.target?.isContentEditable) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape' && document.activeElement === searchRef.current) setQuery('');
    }
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.getBlogs({ page: 1, limit: PAGE_SIZE });
      const next = Array.isArray(result?.blogs) ? result.blogs : [];
      setBlogs(newestFirst(next));
      setPage(1);
      setHasMore(next.length === PAGE_SIZE);
    } catch (requestError) {
      setError(requestError?.message || 'Unable to fetch stories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFirstPage(); }, [loadFirstPage]);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await api.getBlogs({ page: nextPage, limit: PAGE_SIZE });
      const next = Array.isArray(result?.blogs) ? result.blogs : [];
      setBlogs((current) => {
        const seen = new Set(current.map(getBlogId));
        const unique = next.filter((post) => {
          const key = getBlogId(post);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        return newestFirst([...current, ...unique]);
      });
      setPage(nextPage);
      setHasMore(next.length === PAGE_SIZE);
      if (!next.length) flash('You’re all caught up. No more stories on this page.', 'info');
    } catch (requestError) {
      flash(requestError?.message || 'Could not load more stories.', 'error');
    } finally {
      setLoadingMore(false);
    }
  }

  const filteredBlogs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesView = view === 'all' || (user?.id && getAuthorId(blog) === String(user.id));
      const matchesQuery = !normalized || `${blog?.title || ''} ${blog?.content || ''}`.toLowerCase().includes(normalized);
      return matchesView && matchesQuery;
    });
  }, [blogs, query, view, user]);

  const featured = blogs[0];
  const showFeatured = Boolean(featured && !loading && !query && view === 'all' && blogs.length >= 4);
  const displayedBlogs = showFeatured ? filteredBlogs.filter((blog) => getBlogId(blog) !== getBlogId(featured)) : filteredBlogs;

  return (
    <div className="home-page">
      <section className="hero-section content-wrap">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span className="hero-eyebrow-dot" /> A JOURNAL FOR CURIOUS MINDS</div>
          <h1>Make space for<br />the <span>thoughtful</span><br />things.</h1>
          <p className="hero-description">A quieter corner of the internet for ideas, stories, and the things we learn along the way.</p>
          <div className="hero-actions">
            <a href="#latest" className="button button-dark button-large">Explore stories <ArrowDown size={17} /></a>
            <Link to={user ? '/write' : '/register'} className="button button-outline button-large"><Feather size={16} /> Write your first story</Link>
          </div>
          <div className="hero-note"><span className="hero-note-icon"><BookOpenText size={16} /></span><span><strong>Written by people,</strong> for people.</span><span className="hero-note-divider" /><span>No noise. Just ideas.</span></div>
        </div>
        <div className="hero-art" aria-label="Editorial illustration">
          <div className="hero-art-paper paper-back"><span>things<br />to keep</span><i>✳</i></div>
          <div className="hero-art-paper paper-front"><div className="paper-top"><span>MARGIN / VOL. 01</span><span>EST. 2026</span></div><div className="paper-title">A little<br />more <em>meaning.</em></div><div className="paper-lines"><i /><i /><i /></div><div className="paper-foot"><span>NOTES ON BEING HUMAN</span><span>01—09</span></div></div>
          <span className="hero-spark spark-a">✳</span><span className="hero-spark spark-b">✦</span><span className="hero-art-caption">GOOD THOUGHTS<br />TAKE THEIR TIME</span>
        </div>
        <div className="hero-bottom-line"><span>THOUGHTS THAT STICK AROUND</span><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span></div>
      </section>

      <section className="marquee-strip" aria-label="Our values"><div className="marquee-track"><span>Curiosity first</span><i>✳</i><span>Write what matters</span><i>✳</i><span>Stay a little longer</span><i>✳</i><span>Curiosity first</span><i>✳</i><span>Write what matters</span><i>✳</i><span>Stay a little longer</span></div></section>

      <section id="latest" className="latest-section content-wrap">
        <div className="section-heading-row">
          <div><div className="section-eyebrow"><Sparkles size={14} /> THE READING ROOM</div><h2>Fresh from the <em>margin.</em></h2><p className="section-subtitle">Thoughts in progress. Stories worth your time.</p></div>
          <div className="heading-side-note"><span className="note-line" /><span>Take what<br />resonates.</span></div>
        </div>

        {showFeatured && <div className="featured-strip">
          <div className="featured-index"><span>01</span><span>FEATURED STORY</span></div>
          <div className="featured-copy"><h3>{featured.title || 'Untitled story'}</h3><p>{String(featured.content || '').slice(0, 180)}{String(featured.content || '').length > 180 ? '…' : ''}</p></div>
          <Link to={`/post/${getBlogId(featured)}`} className="featured-link" aria-label="Read featured story"><ArrowUpRight size={22} /></Link>
          <div className="featured-decoration" aria-hidden="true">✳</div>
        </div>}

        <div className="feed-controls">
          <div className="feed-tabs" role="group" aria-label="Story filter">
            <button type="button" aria-pressed={view === 'all'} className={view === 'all' ? 'feed-tab active' : 'feed-tab'} onClick={() => setView('all')}>All stories <span>{blogs.length}</span></button>
            {user && <button type="button" aria-pressed={view === 'mine'} className={view === 'mine' ? 'feed-tab active' : 'feed-tab'} onClick={() => setView('mine')}>Your writing</button>}
          </div>
          <SearchBox value={query} onChange={setQuery} inputRef={searchRef} />
        </div>

        {loading ? <LoadingGrid count={6} /> : error ? <ErrorState message={error} onRetry={loadFirstPage} /> : displayedBlogs.length ? (
          <>
            <div className="post-grid">{displayedBlogs.map((blog, index) => <PostCard key={getBlogId(blog) || `${blog.title}-${index}`} blog={blog} index={index} currentUser={user} />)}</div>
            {!query && view === 'all' && hasMore && <div className="load-more-row"><button className="button button-outline button-large" type="button" onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading stories…' : 'Read a little further'} {loadingMore ? <span className="small-spinner" /> : <ArrowRight size={16} />}</button><span>There’s always more to discover.</span></div>}
          </>
        ) : (
          <EmptyState title={query ? 'No stories found' : view === 'mine' ? 'Your page is still blank' : 'The first page is waiting'} description={query ? 'Try a different word or search for a new idea.' : view === 'mine' ? 'The stories you publish will collect here. Start with one small thought.' : 'There are no posts in the feed yet. Be the first to put an idea into words.'} action={<Link to={user ? '/write' : '/register'} className="button button-dark">{user ? 'Write a story' : 'Join Margin'} <ArrowRight size={15} /></Link>} />
        )}
      </section>

      <section className="write-cta content-wrap">
        <div className="cta-symbol"><PenLine size={25} /></div>
        <div className="cta-copy"><span className="section-eyebrow">YOUR TURN</span><h2>Every good story starts <em>somewhere.</em></h2><p>It doesn’t need to be perfect. It just needs to be yours.</p></div>
        <Link to={user ? '/write' : '/register'} className="button button-lime button-large">Put it into words <ArrowUpRight size={17} /></Link>
        <span className="cta-star" aria-hidden="true">✳</span>
      </section>
    </div>
  );
}
