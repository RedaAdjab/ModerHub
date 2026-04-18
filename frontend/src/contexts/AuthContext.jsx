import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api } from "../api/client";

const TOKEN_STORAGE_KEY = "modernhub_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  useEffect(() => {
    if (!token) {
      setLoadingAuth(false);
      return;
    }

    let cancelled = false;

    async function fetchCurrentUser() {
      try {
        const currentUser = await api.get("/auth/me/", token);
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          clearAuthState();
        }
      } finally {
        if (!cancelled) {
          setLoadingAuth(false);
        }
      }
    }

    fetchCurrentUser();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (credentials) => {
    const response = await api.post("/auth/login/", credentials);
    setToken(response.token);
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setUser(response.user);
    return response.user;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register/", payload);
    setToken(response.token);
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    if (token) {
      try {
        await api.post("/auth/logout/", {}, token);
      } catch {
        // Logout should still clear local state even if request fails.
      }
    }

    clearAuthState();
  };

  const refreshUser = async () => {
    if (!token) {
      return null;
    }

    const freshUser = await api.get("/auth/me/", token);
    setUser(freshUser);
    return freshUser;
  };

  const updateProfile = async (payload) => {
    if (!token) {
      throw new Error("You must be logged in to update profile.");
    }

    const updatedUser = await api.patch("/auth/me/", payload, token);
    setUser(updatedUser);
    return updatedUser;
  };

  const contextValue = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loadingAuth,
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
    }),
    [token, user, loadingAuth]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
