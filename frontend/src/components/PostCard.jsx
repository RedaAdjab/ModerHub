import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      {post.cover_image_url ? (
        <img src={post.cover_image_url} alt={post.title} className="post-card-image" />
      ) : (
        <div className="post-card-image placeholder" aria-hidden="true" />
      )}

      <div className="post-card-body">
        <div className="meta-row">
          <span>{post.category_name || "General"}</span>
          <span>{post.comments_count} comments</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="meta-row bottom">
          <span>By {post.author_username}</span>
          <Link to={`/posts/${post.slug}`}>Read</Link>
        </div>
      </div>
    </article>
  );
}
