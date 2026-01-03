// src/store/auth.ts
import { createSignal, createRoot } from "solid-js";
import { api } from "../lib/client";
import type { User, AuthResponse } from "../types/api";

function createAuthStore() {
  const [user, setUser] = createSignal<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = createSignal(
    !!localStorage.getItem("access_token"),
  );

  // 1. 新增：获取用于 WebDAV 的凭证
  const getWebDavCredentials = () => {
    return {
      username: sessionStorage.getItem("auth_username"),
      password: sessionStorage.getItem("auth_password"), // 注意：这是明文存储，仅用于演示环境或内网
    };
  };

  // 登录动作
  // 注意：这里我们需要接收 username 和 password 参数
  const login = (
    data: AuthResponse,
    loginParams: { user: string; pass: string },
  ) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    // 2. 保存凭证到 SessionStorage (关闭浏览器后自动清除)
    sessionStorage.setItem("auth_username", loginParams.user);
    sessionStorage.setItem("auth_password", loginParams.pass);

    setIsAuthenticated(true);
    fetchUserProfile();
  };

  // 登出动作
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // 3. 清除凭证
    sessionStorage.removeItem("auth_username");
    sessionStorage.removeItem("auth_password");

    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const fetchUserProfile = async () => {
    try {
      const res = await api.get<User>("/auth/whoami");
      setUser(res.data);
    } catch (e) {
      logout(); // Token 失效自动登出
    }
  };

  if (isAuthenticated()) {
    fetchUserProfile();
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    fetchUserProfile,
    getWebDavCredentials,
  };
}

export const authStore = createRoot(createAuthStore);
