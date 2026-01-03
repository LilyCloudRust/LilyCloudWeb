// src/pages/Login.tsx
import { useNavigate } from "@solidjs/router";
import { Component, createSignal, Show } from "solid-js";

import { api } from "../lib/client";
import { authStore } from "../store/auth";
import type { AuthResponse } from "../types/api";

const Login: Component = () => {
  const navigate = useNavigate();
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 构建表单数据 (OAuth2 规范通常使用 form-data)
    const formData = new FormData();
    formData.append("username", username());
    formData.append("password", password());

    try {
      // 1. 修改这里：构建普通的 JSON 对象
      const payload = {
        username: username(),
        password: password(),
      };

      // 2. 发送请求
      // 不需要手动设置 Content-Type，Axios 默认就是 application/json
      const res = await api.post<AuthResponse>("/auth/login", payload);

      // 🟢 修改这里：将 payload (包含明文密码) 传给 login 方法
      authStore.login(res.data, { user: username(), pass: password() });

      // 跳转回首页
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.detail
        ? JSON.stringify(err.response.data.detail)
        : "Login failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
          LilyCloud Login
        </h2>

        <Show when={error()}>
          <div class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error()}
          </div>
        </Show>

        <form onSubmit={handleLogin} class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username()}
              onInput={(e) => setUsername(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading()}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading() ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
