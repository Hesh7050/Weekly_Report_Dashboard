import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("weekly_report_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("weekly_report_token");
  });

  const isAuthenticated = Boolean(user && token);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const loginUser = response.data.data.user;
    const loginToken = response.data.data.token;

    localStorage.setItem("weekly_report_user", JSON.stringify(loginUser));
    localStorage.setItem("weekly_report_token", loginToken);

    setUser(loginUser);
    setToken(loginToken);

    return loginUser;
  };

  const register = async (name, email, password, role) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });

    const registeredUser = response.data.data.user;
    const registeredToken = response.data.data.token;

    localStorage.setItem("weekly_report_user", JSON.stringify(registeredUser));
    localStorage.setItem("weekly_report_token", registeredToken);

    setUser(registeredUser);
    setToken(registeredToken);

    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem("weekly_report_user");
    localStorage.removeItem("weekly_report_token");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};