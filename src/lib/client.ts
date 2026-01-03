// src/lib/client.ts
import { QueryClient } from "@tanstack/solid-query";
import axios from "axios";

// 1. 创建 Axios 实例
export const api = axios.create({
  baseURL: "/api", // 配合 Vite proxy 使用，或者填写完整后端地址
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. 请求拦截器：注入 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. 响应拦截器：处理 401 (Token 过期)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 清除 Token 并跳转登录
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// 4. 创建 TanStack Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
