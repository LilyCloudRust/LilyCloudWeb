// src/App.tsx
import { type Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient } from "./lib/client";
import { authStore } from "./store/auth";

// 懒加载页面
import MainPage from "./pages/MainPage";
import Login from "./pages/Login"; // 假设你已创建
// import AdminPage from './pages/AdminPage';

const App: Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* 简单的路由守卫逻辑可以在组件内部实现，或使用包装组件 */}
        <Route path="/login" component={Login} />

        {/* 受保护的路由 */}
        <Route
          path="/"
          component={() => {
            // 简单的重定向保护
            if (!authStore.isAuthenticated()) {
              window.location.href = "/login";
              return null;
            }
            return <MainPage />;
          }}
        />

        {/* 更多路由... */}
      </Router>
    </QueryClientProvider>
  );
};

export default App;
