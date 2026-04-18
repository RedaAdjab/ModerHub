import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../api/client";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";

export default function PostDetailPage() {
  const [post, setPost] = useState(null);
  const [commentBody, setCommentBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();

  const isAuthor = useMemo(() => {
    if (!user || !post) {
      return false;
    }
    return user.username === post.author_username;
  }, [user, post]);

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const postData = await api.get(`/posts/${slug}/`, token);
        if (!cancelled) {
          setPost(postData);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error.message || "Could not load post details.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      cancelled = true;
    };
  }, [slug, token]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage("You must be signed in to comment.");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    setIsSubmittingComment(true);

    try {
      await api.post(`/posts/${slug}/comments/`, { body: commentBody }, token);
      const refreshedPost = await api.get(`/posts/${slug}/`, token);
      setPost(refreshedPost);
      setCommentBody("");
      setStatusMessage("Comment posted successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Could not post your comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post? This action cannot be undone.")) {
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    setIsDeleting(true);

    try {
      await api.delete(`/posts/${slug}/`, token);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Could not delete this post.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="shell page-stack">
        <Loader label="Loading post details..." />
      </div>
    );
  }

  if (errorMessage && !post) {
    return (
      <div className="shell page-stack">
        <p className="error-text">{errorMessage}</p>
        <Link to="/" className="primary-link">
          Back Home
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="shell page-stack">
      <article className="panel article-layout">
        <div className="article-head">
          <p className="eyebrow">{post.category_name || "General"}</p>
          <h1>{post.title}</h1>
          <p className="article-meta">By {post.author_username}</p>
        </div>

        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} className="article-image" />
        )}

        <p className="lead-text">{post.excerpt}</p>
        <div className="article-body">{post.body}</div>

        {isAuthor && (
          <div className="inline-actions">
            <button type="button" className="danger-button" onClick={handleDeletePost} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Post"}
            </button>
          </div>
        )}
      </article>

      <section className="panel">
        <div className="section-head">
          <h2>Comments</h2>
        </div>

        {post.comments?.length === 0 && <p className="empty-text">No comments yet.</p>}

        <div className="comment-list">
          {post.comments?.map((comment) => (
            <article key={comment.id} className="comment-item">
              <strong>{comment.author_username}</strong>
              <p>{comment.body}</p>
            </article>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleCommentSubmit}>
          <label>
            Add a comment
            <textarea
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              rows={4}
              required
            />
          </label>
          <button type="submit" disabled={isSubmittingComment}>
            {isSubmittingComment ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {statusMessage && <p className="status-text">{statusMessage}</p>}
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </section>
    </div>
  );
}
