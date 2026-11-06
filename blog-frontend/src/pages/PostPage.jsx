
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Heart,
  MessageCircle,
  PencilLine,
  Share2,
  Trash2
} from 'lucide-react';

import {
  api,
  formatDate,
  getAuthorId,
  getAuthorLabel,
  getBlogId,
  readingMinutes
} from '../api.js';

import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';
import { ErrorState } from '../components/Primitives.jsx';

function currentUserId(user) {
  return String(user?._id || user?.id || '');
}

function commentUserId(comment) {
  const commentUser = comment?.user;

  if (commentUser && typeof commentUser === 'object') {
    return String(commentUser._id || commentUser.id || '');
  }

  return String(commentUser || '');
}

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const flash = useFlash();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState('');

  // Edit comment states
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);

  const loadBlog = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await api.getBlog(id);

      if (!result?.blog) {
        throw new Error(
          'This story may have been removed or the link may be incorrect.'
        );
      }

      setBlog(result.blog);
    } catch (requestError) {
      setError(requestError?.message || 'Could not load this story.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);

    try {
      const result = await api.getComments(id);

      setComments(
        Array.isArray(result?.comments) ? result.comments : []
      );
    } catch (requestError) {
      setComments([]);
      flash(requestError?.message || 'Could not load comments.', 'error');
    } finally {
      setCommentsLoading(false);
    }
  }, [id, flash]);

  useEffect(() => {
    loadBlog();
  }, [loadBlog]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const isOwner = useMemo(
    () =>
      Boolean(
        currentUserId(user) &&
        blog &&
        getAuthorId(blog) === currentUserId(user)
      ),
    [user, blog]
  );

  const userId = currentUserId(user);

  const likes = Array.isArray(blog?.likes) ? blog.likes : [];

  const isLiked = Boolean(
    userId &&
    likes.some((like) =>
      String(
        typeof like === 'object'
          ? like?._id || like?.id
          : like
      ) === userId
    )
  );

  // LIKE / UNLIKE
  async function handleToggleLike() {
    if (!user) {
      flash('Sign in to like this story.', 'info');
      navigate('/login');
      return;
    }

    if (liking) return;

    setLiking(true);

    try {
      const result = await api.toggleLike(id);

      setBlog((current) => {
        if (!current) return current;

        const currentLikes = Array.isArray(current.likes)
          ? current.likes
          : [];

        const nextLikes = result?.liked
          ? [
            ...currentLikes.filter(
              (like) =>
                String(
                  typeof like === 'object'
                    ? like?._id || like?.id
                    : like
                ) !== userId
            ),
            userId
          ]
          : currentLikes.filter(
            (like) =>
              String(
                typeof like === 'object'
                  ? like?._id || like?.id
                  : like
              ) !== userId
          );

        return {
          ...current,
          likes: nextLikes
        };
      });
    } catch (requestError) {
      flash(
        requestError?.message ||
        'Could not update your like. Please try again.',
        'error'
      );
    } finally {
      setLiking(false);
    }
  }

  // ADD COMMENT
  async function handleAddComment(event) {
    event.preventDefault();

    const content = commentText.trim();

    if (!user) {
      flash('Sign in to leave a comment.', 'info');
      navigate('/login');
      return;
    }

    if (!content || submittingComment) return;

    setSubmittingComment(true);

    try {
      await api.addComment(id, content);

      setCommentText('');

      await loadComments();

      flash('Your comment has been added.', 'success');
    } catch (requestError) {
      flash(
        requestError?.message || 'Could not add your comment.',
        'error'
      );
    } finally {
      setSubmittingComment(false);
    }
  }

  // DELETE COMMENT
  async function handleDeleteComment(commentId) {
    if (deletingCommentId) return;

    setDeletingCommentId(commentId);

    try {
      await api.deleteComment(commentId);

      setComments((current) =>
        current.filter(
          (comment) =>
            String(comment._id || comment.id) !== String(commentId)
        )
      );

      flash('Comment deleted.', 'success');
    } catch (requestError) {
      flash(
        requestError?.message || 'Could not delete this comment.',
        'error'
      );
    } finally {
      setDeletingCommentId('');
    }
  }

  // START EDITING COMMENT
  function handleEditComment(comment) {
    setEditingComment(String(comment._id || comment.id));
    setEditContent(comment.content || '');
  }

  // CANCEL EDITING
  function handleCancelEdit() {
    setEditingComment(null);
    setEditContent('');
  }

  // UPDATE COMMENT
  async function handleUpdateComment(commentId) {
    const content = editContent.trim();

    if (!content || isUpdatingComment) return;

    setIsUpdatingComment(true);

    try {
      await api.updateComment(commentId, content);

      setComments((previousComments) =>
        previousComments.map((comment) =>
          String(comment._id || comment.id) === String(commentId)
            ? { ...comment, content }
            : comment
        )
      );

      setEditingComment(null);
      setEditContent('');

      flash('Comment updated successfully.', 'success');
    } catch (requestError) {
      flash(
        requestError?.message || 'Could not update comment.',
        'error'
      );
    } finally {
      setIsUpdatingComment(false);
    }
  }

  // DELETE BLOG
  async function handleDelete() {
    const confirmed = window.confirm(
      'Delete this story? This cannot be undone.'
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      await api.deleteBlog(id);

      flash('Your story has been deleted.', 'success');

      navigate('/', { replace: true });
    } catch (requestError) {
      flash(
        requestError?.message || 'Could not delete the story.',
        'error'
      );
    } finally {
      setDeleting(false);
    }
  }

  // SHARE STORY
  async function shareStory() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      flash('Story link copied to your clipboard.', 'success');
    } catch {
      flash(
        'Your browser blocked clipboard access. Copy the URL from the address bar instead.',
        'info'
      );
    }
  }

  if (loading) {
    return (
      <div className="content-wrap article-loading">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton article-title-skeleton" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton article-body-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-wrap article-error">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Back to all stories
        </Link>

        <ErrorState
          title="We couldn’t load this story"
          message={error}
          onRetry={loadBlog}
        />
      </div>
    );
  }

  const content = String(blog?.content || '');
  const authorLabel = getAuthorLabel(blog, user);
  const title = blog?.title || 'Untitled story';

  return (
    <article className="article-page mx-auto w-[min(1160px,calc(100%-56px))] px-0 pb-12 pt-9 max-sm:w-[calc(100%-32px)]">

      {/* TOP BAR */}
      <div className="article-topline flex items-center justify-between gap-4">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> All stories
        </Link>

        <button
          type="button"
          className="article-share-button"
          onClick={shareStory}
        >
          <Share2 size={15} /> Share
        </button>
      </div>

      {/* ARTICLE HEADER */}
      <header className="article-header mx-auto mb-8 mt-14 max-w-[790px] text-center max-sm:mt-9">
        <div className="article-label">
          <span className="label-dot" /> A MARGIN STORY
        </div>

        <h1 className="my-5 break-words font-serif text-[clamp(2.375rem,5.4vw,4.125rem)] font-medium leading-[1.05] tracking-[-0.055em] text-ink">{title}</h1>

        <p className="article-deck">
          A thought shared with the Margin reading room.
        </p>

        <div className="article-byline mx-auto mt-7 flex flex-wrap items-center justify-center gap-3">
          <span className="article-author-avatar">
            {authorLabel.slice(0, 1).toUpperCase()}
          </span>

          <div className="article-byline-text">
            <strong>{authorLabel}</strong>
            <span>
              Published {formatDate(blog?.createdAt || blog?.updatedAt)}
            </span>
          </div>

          <span className="byline-divider" />

          <span className="reading-time">
            <Clock3 size={14} /> {readingMinutes(content)} min read
          </span>
        </div>

        {isOwner && (
          <div className="article-owner-actions">
            <Link
              className="button button-outline"
              to={`/edit/${getBlogId(blog)}`}
            >
              <PencilLine size={15} /> Edit story
            </Link>

            <button
              type="button"
              className="button button-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : (
                <>
                  <Trash2 size={15} /> Delete
                </>
              )}
            </button>
          </div>
        )}
      </header>

      {/* STORY CONTENT */}
      <div className="article-layout mx-auto block w-full max-w-[760px] py-2 pb-10">
        <div className="article-content w-full">
          <div className="article-prose mt-0 font-serif text-[17px] leading-[1.95] text-ink/85">
            {content.split(/\n{2,}/).map((paragraph, index) =>
              paragraph.trim() ? <p key={index}>{paragraph}</p> : null
            )}
          </div>

          <div className="article-end-mark">
            <span />
            <span>✳</span>
            <span />
          </div>

          <div className="article-end-note">
            <strong>Thanks for reading.</strong>
            <p>Good thoughts are even better when they’re shared.</p>
            <Link to="/" className="text-link">
              Keep exploring <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* LIKES AND COMMENTS */}
      <section className="engagement-section mx-auto mt-10 w-full max-w-[760px]" aria-label="Likes and comments">

        <div className="engagement-actions">
          <button
            type="button"
            className={`like-button ${isLiked ? 'is-liked' : ''}`}
            onClick={handleToggleLike}
            disabled={liking}
            aria-pressed={isLiked}
          >
            <Heart
              size={18}
              fill={isLiked ? 'currentColor' : 'none'}
            />

            {liking ? 'Updating…' : isLiked ? 'Liked' : 'Like'}

            <span>{likes.length}</span>
          </button>

          <span className="engagement-comment-count">
            <MessageCircle size={17} />
            {comments.length}{' '}
            {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        <div className="comments-panel mt-6 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7 dark:border-[#303b33] dark:bg-[#1b241e]">

          <div className="comments-heading">
            <div>
              <span className="section-eyebrow">
                JOIN THE CONVERSATION
              </span>

              <h2>
                Comments <span>({comments.length})</span>
              </h2>
            </div>
          </div>

          {/* ADD COMMENT FORM */}
          {user ? (
            <form className="comment-form mt-5 flex flex-col gap-3 rounded-xl border border-line bg-paper p-4 dark:border-[#3b493e] dark:bg-[#202a23]" onSubmit={handleAddComment}>
              <label className="sr-only" htmlFor="new-comment">
                Write a comment
              </label>

              <textarea
                id="new-comment"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Share what you think…"
                maxLength={2000}
                rows={3}
              />

              <div className="comment-form-footer">
                <span>{commentText.length}/2000</span>

                <button
                  type="submit"
                  className="button button-dark"
                  disabled={!commentText.trim() || submittingComment}
                >
                  {submittingComment ? 'Posting…' : 'Post comment'}
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </form>
          ) : (
            <div className="comment-signin-prompt">
              Want to join the conversation?{' '}
              <Link to="/login">Sign in</Link> to leave a comment.
            </div>
          )}

          {/* COMMENT LIST */}
          <div className="comment-list mt-6 divide-y divide-line dark:divide-[#303b33]">

            {commentsLoading ? (
              <p className="comments-status">Loading comments…</p>
            ) : comments.length ? (

              comments.map((comment) => {
                const commentId = String(
                  comment?._id || comment?.id || ''
                );

                const commentAuthor =
                  comment?.user?.username ||
                  comment?.user?.name ||
                  'Community member';

                const canDelete = Boolean(
                  userId && commentUserId(comment) === userId
                );

                const isEditing = editingComment === commentId;

                return (
                  <article className="comment-item flex items-start gap-3 py-5" key={commentId}>

                    <div className="comment-avatar">
                      {commentAuthor.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="comment-main">

                      <div className="comment-meta">
                        <strong>{commentAuthor}</strong>
                        <time>{formatDate(comment?.createdAt)}</time>
                      </div>

                      {/* EDIT MODE */}
                      {isEditing ? (
                        <div className="mt-3 flex w-full flex-col gap-3">

                          <textarea
                            value={editContent}
                            onChange={(event) => setEditContent(event.target.value)}
                            maxLength={2000}
                            rows={3}
                            autoFocus
                            className="w-full min-w-0 resize-y rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition-all placeholder:text-[var(--muted)] focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--ink)]/10"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-3">

                            <span className="text-xs text-[var(--muted)]">
                              {editContent.length}/2000
                            </span>

                            <div className="flex items-center gap-2">

                              <button
                                type="button"
                                className="button button-dark"
                                onClick={() => handleUpdateComment(commentId)}
                                disabled={!editContent.trim() || isUpdatingComment}
                              >
                                {isUpdatingComment ? 'Saving…' : 'Save changes'}
                              </button>

                              <button
                                type="button"
                                className="rounded-full px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                                onClick={handleCancelEdit}
                                disabled={isUpdatingComment}
                              >
                                Cancel
                              </button>

                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>{comment?.content}</p>
                      )}
                    </div>
                    {/* OWNER ACTIONS */}
                    {canDelete && !isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditComment(comment)}
                          aria-label="Edit comment"
                          title="Edit comment"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-transparent px-3 py-2 text-[13px] font-semibold text-[var(--muted)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                        >
                          <PencilLine size={14} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          className="comment-delete-button"
                          onClick={() => handleDeleteComment(commentId)}
                          disabled={deletingCommentId === commentId}
                          aria-label="Delete comment"
                          title="Delete comment"
                        >
                          <Trash2 size={15} />
                        </button>



                      </div>
                    )}

                  </article>
                );
              })

            ) : (
              <p className="comments-status">
                No comments yet. Be the first to share a thought.
              </p>
            )}

          </div>
        </div>
      </section>

      {/* BOTTOM NAVIGATION */}
      <div className="article-bottom-nav mx-auto mt-10 flex max-w-[760px] flex-wrap items-center justify-between gap-4 border-t border-line py-6 dark:border-[#303b33]">
        <Link to="/" className="button button-outline">
          <ArrowLeft size={15} /> More stories
        </Link>

        <span>END OF THIS CHAPTER</span>

        <button
          type="button"
          className="button button-dark"
          onClick={shareStory}
        >
          Share this story <Share2 size={15} />
        </button>
      </div>

    </article>
  );
}
