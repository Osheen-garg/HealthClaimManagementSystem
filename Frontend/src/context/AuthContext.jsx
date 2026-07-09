import { createContext, useContext, useEffect, useState } from "react";

import { loginUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (data) => {
    const response = await loginUser(data);

    if (response.success) {
      localStorage.setItem("token", response.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      setToken(response.token);

      setUser(response.user);
    }

    return response;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken("");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};