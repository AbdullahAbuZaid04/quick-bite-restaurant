import { createContext, useContext, useState, useCallback, useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const saveUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return { success: true, user: userData };
  }, []);

  const login = useCallback(async (email, password) => {
    if (email === "admin@quickbit.com" && password === "admin123") {
      return saveUser({ name: "Admin", email, role: "admin" });
    } else if (email === "user@quickbit.com" && password === "user123") {
      return saveUser({ name: "User", email, role: "user" });
    } else {
      return { success: false, error: "Invalid credentials" };
    }
  }, [saveUser]);

  const register = useCallback(async (name, email, password) => {
    return saveUser({ name, email, password, role: "user" });
  }, [saveUser]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const value = useMemo(() => ({
    user,
    isLoggedIn: !!user,
    login,
    logout,
    register
  }), [user, login, logout, register]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
