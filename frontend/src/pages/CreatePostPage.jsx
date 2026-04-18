import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

const initialForm = {
  title: "",
  excerpt: "",
  body: "",
  cover_image_url: "",
  category: "",
  is_published: true,
};

export default function CreatePostPage() {
  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const categoryData = await api.get("/categories/");
        if (!cancelled) {
          setCategories(categoryData || []);
        }
      } catch {
        if (!cancelled) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        category: formData.category || null,
      };

      const createdPost = await api.post("/posts/", payload, token);
      navigate(`/posts/${createdPost.slug}`);
    } catch (error) {
      setStatusMessage(error.message || "Could not create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shell page-stack">
      <section className="panel">
        <div className="section-head">
          <h1>Create a New Post</h1>
          <p>Publish immediately or save as a draft for later editing.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={180}
              required
            />
          </label>

          <label>
            Excerpt
            <input
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              maxLength={280}
              required
            />
          </label>

          <label>
            Cover Image URL
            <input
              name="cover_image_url"
              type="url"
              value={formData.cover_image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </label>

          <label>
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">No category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Body
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={10}
              required
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
            />
            Publish immediately
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </button>
          {statusMessage && <p className="error-text">{statusMessage}</p>}
        </form>
      </section>
    </div>
  );
}
