"use client";

import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../redux/features/auth/authSlice";
import { URL } from "../_utils/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const login = async (userData) => {
    dispatch(setUser(userData));
  };

  const logout = async () => {
    try {
      await fetch(`${URL}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearUser());
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
