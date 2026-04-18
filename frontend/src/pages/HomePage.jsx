import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";

const PAGE_SIZE = 6;

const initialStats = {
  members: 0,
  posts: 0,
  categories: 0,
  comments: 0,
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(initialStats);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStaticData() {
      try {
        const [statsData, featuredData, categoryData] = await Promise.all([
          api.get("/stats/"),
          api.get("/posts/featured/"),
          api.get("/categories/"),
        ]);

        if (cancelled) {
          return;
        }

        setStats(statsData);
        setFeaturedPosts(featuredData || []);
        setCategories(categoryData || []);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error.message || "Could not load website metadata.");
        }
      }
    }

    loadStaticData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      setIsLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams();
      params.set("page", String(page));
      if (query.trim()) {
        params.set("q", query.trim());
      }
      if (category.trim()) {
        params.set("category", category.trim());
      }

      try {
        const postResponse = await api.get(`/posts/?${params.toString()}`);
        if (cancelled) {
          return;
        }

        setPosts(postResponse.results || []);
        setPagination({
          count: postResponse.count || 0,
          next: postResponse.next,
          previous: postResponse.previous,
        });
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error.message || "Could not load posts.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, [query, category, page]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((pagination.count || 0) / PAGE_SIZE));
  }, [pagination.count]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setQuery(searchInput);
  };

  const handleCategoryChange = (event) => {
    setPage(1);
    setCategory(event.target.value);
  };

  return (
    <div className="shell page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Modern publishing stack</p>
          <h1>Build, share, and grow your digital presence from one platform.</h1>
          <p>
            ModernHub includes user accounts, content publishing, search, comments,
            contact workflows, newsletter collection, and an API-first architecture.
          </p>
          <div className="hero-actions">
            <Link to="/create" className="cta-button">
              Create a Post
            </Link>
            <Link to="/contact" className="secondary-button">
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <article>
            <span>Members</span>
            <strong>{stats.members}</strong>
          </article>
          <article>
            <span>Posts</span>
            <strong>{stats.posts}</strong>
          </article>
          <article>
            <span>Categories</span>
            <strong>{stats.categories}</strong>
          </article>
          <article>
            <span>Comments</span>
            <strong>{stats.comments}</strong>
          </article>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Featured Stories</h2>
        </div>
        <div className="featured-grid">
          {featuredPosts.length === 0 && <p>No featured posts yet.</p>}
          {featuredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Latest Posts</h2>
        </div>

        <form className="filters-row" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search title, excerpt, or full text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <select value={category} onChange={handleCategoryChange}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <button type="submit">Search</button>
        </form>

        {isLoading && <Loader label="Loading posts..." />}
        {errorMessage && <p className="error-text">{errorMessage}</p>}

        {!isLoading && !errorMessage && posts.length === 0 && (
          <p className="empty-text">No posts match your current filters.</p>
        )}

        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="pagination-row">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={!pagination.previous}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={!pagination.next}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
