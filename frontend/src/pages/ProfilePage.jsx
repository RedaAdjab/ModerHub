import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";

const emptyForm = {
  email: "",
  first_name: "",
  last_name: "",
  profile: {
    headline: "",
    bio: "",
    avatar_url: "",
    website: "",
  },
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      profile: {
        headline: user.profile?.headline || "",
        bio: user.profile?.bio || "",
        avatar_url: user.profile?.avatar_url || "",
        website: user.profile?.website || "",
      },
    });
  }, [user]);

  const handleTopLevelChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      setStatusMessage("Profile updated successfully.");
    } catch (error) {
      setStatusMessage(error.message || "Could not update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shell page-stack">
      <section className="panel profile-layout">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>Manage your account details.</h1>
          <p>
            Update your contact info and public author profile shown on your content.
          </p>

          {formData.profile.avatar_url && (
            <img
              src={formData.profile.avatar_url}
              alt="Avatar preview"
              className="avatar-preview"
            />
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleTopLevelChange}
            />
          </label>
          <label>
            First Name
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleTopLevelChange}
            />
          </label>
          <label>
            Last Name
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleTopLevelChange}
            />
          </label>
          <label>
            Headline
            <input
              name="headline"
              value={formData.profile.headline}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Bio
            <textarea
              name="bio"
              rows={4}
              value={formData.profile.bio}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Avatar URL
            <input
              name="avatar_url"
              type="url"
              value={formData.profile.avatar_url}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Website
            <input
              name="website"
              type="url"
              value={formData.profile.website}
              onChange={handleProfileChange}
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          {statusMessage && <p className="status-text">{statusMessage}</p>}
        </form>
      </section>
    </div>
  );
}
