import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link to="/" className="brand-mark">
          ModernHub
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {isAuthenticated && <NavLink to="/create">Create</NavLink>}
          {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}
        </nav>

        <div className="auth-controls">
          {isAuthenticated ? (
            <>
              <span className="welcome-chip">{user?.username}</span>
              <button type="button" className="ghost-button" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link className="primary-link" to="/auth">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
