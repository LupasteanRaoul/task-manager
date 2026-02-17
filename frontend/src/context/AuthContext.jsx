import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("tf_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      const { user: userData, token } = res.data;
      setUser(userData);
      localStorage.setItem("tf_user", JSON.stringify(userData));
      localStorage.setItem("tf_token", token);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err.response?.data?.detail || "Eroare la autentificare" };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      const { user: userData, token } = res.data;
      setUser(userData);
      localStorage.setItem("tf_user", JSON.stringify(userData));
      localStorage.setItem("tf_token", token);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err.response?.data?.detail || "Eroare la inregistrare" };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("tf_user");
    localStorage.removeItem("tf_token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
