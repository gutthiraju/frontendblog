import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (err) {
        console.error("Session corrupted, clearing storage:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // 1. Enhanced Logout: Clear everything
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    // Optional: Redirect to login or home
    window.location.href = "/login"; 
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      token, 
      setToken, 
      loading, 
      logout,
      authenticated: !!token // Quick helper to check if logged in
    }}>
      {/* 2. Important: Don't render the app until we know if a user is logged in */}
      {!loading && children}
    </UserContext.Provider>
  );
};