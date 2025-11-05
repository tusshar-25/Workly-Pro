import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
// inside AuthProvider useEffect
useEffect(() => {
  try {
    const storedUser = localStorage.getItem("worklyUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Accept all logged-in users (admin, manager, employee)
      setUser(parsedUser);
    }
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
    localStorage.removeItem("worklyUser");
  } finally {
    setLoading(false);
  }
}, []);


  // Login function
const login = (userData) => {
  setUser(userData);
  localStorage.setItem("worklyUser", JSON.stringify(userData));
  if (userData.token) localStorage.setItem("token", userData.token);
};

  // Logout function
const logout = () => {
  setUser(null);
  localStorage.removeItem("worklyUser");
  localStorage.removeItem("token");
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => {
  return useContext(AuthContext);
};
