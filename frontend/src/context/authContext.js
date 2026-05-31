import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { loginApi, registerApi } from "../api/authService";

const AuthContext = createContext();

const storage = sessionStorage;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(storage.getItem("user")));

  const login = useCallback(async (email, password) => {
    try {
      const result = await loginApi(email, password);

      if (result.success) {
        storage.setItem('token', result.data.token);
        setUser(result.data.user);
        storage.setItem("user", JSON.stringify(result.data.user));
        return { success: true, user: result.data.user };
      }
    } catch (error) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const result = await registerApi({ name, email, password });

      if (result.success) {
        storage.setItem('token', result.data.token);
        setUser(result.data.user);
        storage.setItem("user", JSON.stringify(result.data.user));
        return { success: true, user: result.data.user };
      }
    } catch (error) {
      console.error('Register error:', error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.removeItem("user");
    storage.removeItem("token");
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
