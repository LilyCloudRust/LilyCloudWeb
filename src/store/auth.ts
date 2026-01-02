// src/store/auth.ts
import { createSignal, createRoot } from "solid-js";
import { api } from "../lib/client";
import type { User, AuthResponse } from "../types/api";

function createAuthStore() {
  const [user, setUser] = createSignal<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = createSignal(
    !!localStorage.getItem("access_token"),
  );

  // 登录动作
  const login = (data: AuthResponse) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    setIsAuthenticated(true);
    fetchUserProfile();
  };

  // 登出动作
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  // 获取用户信息
  const fetchUserProfile = async () => {
    try {
      const res = await api.get<User>("/auth/whoami");
      setUser(res.data);
    } catch (e) {
      logout();
    }
  };

  // 初始化检查
  if (isAuthenticated()) {
    fetchUserProfile();
  }

  return { user, isAuthenticated, login, logout, fetchUserProfile };
}

export const authStore = createRoot(createAuthStore);
