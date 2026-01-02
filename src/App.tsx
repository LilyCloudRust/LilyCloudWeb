// src/App.tsx
import { Route,Router } from "@solidjs/router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { type Component } from "solid-js";

import { queryClient } from "./lib/client";
import Login from "./pages/Login"; // 假设你已创建
// 懒加载页面
import MainPage from "./pages/MainPage";
import { authStore } from "./store/auth";
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
