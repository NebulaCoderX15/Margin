import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Feather, FileText, PenLine, Save, Sparkles } from 'lucide-react';
import { api, getAuthorId, getBlogId } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { ButtonSpinner, ErrorState } from '../components/Primitives.jsx';

export default function EditorPage({ mode = 'create' }) {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const flash = useFlash();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState(null);

  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);

  const loadBlog = useCallback(async () => {
    if (!isEdit) return;
    setLoading(true);
    setLoadError('');
    try {
      const result = await api.getBlog(id);
      const blog = result?.blog;
      if (!blog) throw new Error('This story could not be found.');
      if (getAuthorId(blog) !== String(user?.id || '')) throw new Error('You can only edit stories you wrote.');
      setTitle(blog.title || '');
      setContent(blog.content || '');
    } catch (requestError) {
      setLoadError(requestError?.message || 'Could not load this story.');
    } finally {
      setLoading(false);
    }
  }, [id, isEdit, user?.id]);

  useEffect(() => { loadBlog(); }, [loadBlog]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (title.trim().length < 3) return setError('Give your story a title with at least 3 characters.');
    if (!content.trim()) return setError('Your story needs a little content before it can be saved.');
    if (title.trim().length > 180) return setError('Keep your title under 180 characters.');

    setSaving(true);
    try {
      if (isEdit) {
        const result = await api.updateBlog(id, { title: title.trim(), content: content.trim() });
        const updated = result?.blog;
        const updatedId = getBlogId(updated) || id;
        flash('Your story has been updated.', 'success');
        navigate(`/post/${updatedId}`, { replace: true });
      } else {
        await api.createBlog({ title: title.trim(), content: content.trim() });
        flash('Your story is live in the reading room.', 'success');
        navigate('/', { replace: true });
      }
    } catch (requestError) {
      setError(requestError?.message || 'Could not save your story.');
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    navigate(isEdit && id ? `/post/${id}` : '/');
  }

  if (loading) return <div className="content-wrap editor-loading"><div className="skeleton skeleton-line short" /><div className="skeleton article-title-skeleton" /><div className="skeleton skeleton-line" /><div className="skeleton article-body-skeleton" /></div>;
  if (loadError) return <div className="content-wrap article-error"><Link to="/" className="back-link"><ArrowLeft size={15} /> Back to the reading room</Link><ErrorState title="We couldn’t open your story" message={loadError} onRetry={loadBlog} /></div>;

  return (
    <div className="editor-page content-wrap">
      <div className="editor-back-row"><Link to={isEdit ? `/post/${id}` : '/'} className="back-link"><ArrowLeft size={15} /> {isEdit ? 'Back to story' : 'Back to reading room'}</Link><div className="editor-status"><span className="editor-status-dot" /> {savedAt ? `Last saved ${savedAt}` : 'A quiet place to write'}</div></div>
      <div className="editor-layout">
        <section className="editor-main">
          <div className="editor-heading"><div className="editor-heading-symbol"><Feather size={21} /></div><div><div className="section-eyebrow"><Sparkles size={13} /> THE WRITING DESK</div><h1>{isEdit ? 'Shape your story.' : 'Start with a thought.'}</h1><p>{isEdit ? 'Make the words feel a little more like you.' : 'Don’t worry about making it perfect. Just begin.'}</p></div></div>
          {error && <div className="form-error editor-error" role="alert"><span>!</span><p>{error}</p></div>}
          <form className="story-editor-form" onSubmit={handleSubmit}>
            <div className="editor-field title-field"><label htmlFor="story-title">TITLE</label><input id="story-title" value={title} onChange={(event) => { setTitle(event.target.value); setSavedAt(null); setError(''); }} placeholder="Give your story a name…" maxLength={180} required /><span className="character-count">{title.length}/180</span></div>
            <div className="editor-field content-field"><label htmlFor="story-content">YOUR STORY <span>— take it from here</span></label><textarea id="story-content" value={content} onChange={(event) => { setContent(event.target.value); setSavedAt(null); setError(''); }} placeholder={'Start writing here…\n\nA thought, an experience, a question you can’t shake. Whatever it is, give it some room.'} rows={18} required /><div className="editor-writing-stats"><span><FileText size={13} /> {wordCount} {wordCount === 1 ? 'word' : 'words'}</span><span>~{Math.max(1, Math.ceil(wordCount / 220))} min read</span></div></div>
            <div className="editor-actions"><button type="button" className="button button-outline" onClick={cancel}>Cancel</button><button type="submit" className="button button-dark editor-save-button" disabled={saving}>{saving ? <><ButtonSpinner /> Saving…</> : <>{isEdit ? <Save size={16} /> : <PenLine size={16} />}{isEdit ? 'Save changes' : 'Publish story'} <ArrowIcon /></>}</button></div>
          </form>
        </section>
        <aside className="editor-sidebar"><div className="editor-side-card"><div className="side-card-icon"><Sparkles size={18} /></div><span className="section-eyebrow">A LITTLE REMINDER</span><h3>Write for one person.</h3><p>Not for the algorithm. Not for everybody. For the person who needs to read what you have to say.</p><div className="side-card-signoff">— THE MARGIN WAY</div></div><div className="editor-side-tip"><span><Check size={15} /></span><div><strong>Your voice, your words</strong><p>Stories are saved as plain text, so line breaks are preserved when published.</p></div></div><div className="editor-side-tip"><span><Check size={15} /></span><div><strong>Ready when you are</strong><p>Publishing makes your story visible in the public reading room.</p></div></div></aside>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}
