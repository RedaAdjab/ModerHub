import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const initialLogin = {
  username: "",
  password: "",
};

const initialRegister = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
};

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      await login(loginForm);
      navigate("/");
    } catch (error) {
      setStatusMessage(error.message || "Could not log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      await register(registerForm);
      navigate("/");
    } catch (error) {
      setStatusMessage(error.message || "Could not create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shell auth-wrap">
      <section className="auth-card">
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Create Account
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label>
              Username
              <input
                type="text"
                value={loginForm.username}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, username: event.target.value }))
                }
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
                required
              />
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <label>
              Username
              <input
                type="text"
                value={registerForm.username}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, username: event.target.value }))
                }
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                }
                required
              />
            </label>

            <label>
              First Name
              <input
                type="text"
                value={registerForm.first_name}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, first_name: event.target.value }))
                }
              />
            </label>

            <label>
              Last Name
              <input
                type="text"
                value={registerForm.last_name}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, last_name: event.target.value }))
                }
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                }
                required
              />
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        {statusMessage && <p className="error-text">{statusMessage}</p>}
      </section>
    </div>
  );
}
