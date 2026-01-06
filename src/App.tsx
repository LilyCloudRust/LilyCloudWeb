// src/App.tsx
// src/App.tsx
import { Route, Router } from "@solidjs/router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { lazy } from "solid-js";
import { type Component } from "solid-js";

import { queryClient } from "./lib/client";
import Admin from "./pages/Admin";
import Login from "./pages/Login"; // 假设你已创建
// 懒加载页面
import MainPage from "./pages/MainPage";
import Settings from "./pages/Settings"; // 1. 引入 Settings
import { authStore } from "./store/auth";

const TrashPage = lazy(() => import("./pages/TrashPage"));
const StoragePage = lazy(() => import("./pages/StoragePage"));
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
        {/* 2. 注册 Settings 路由 */}
        <Route
          path="/settings"
          component={() => {
            if (!authStore.isAuthenticated()) {
              window.location.href = "/login";
              return null;
            }
            return <Settings />;
          }}
        />
        <Route path="/admin" component={Admin} />;
        <Route path="/trash" component={TrashPage} />
        {/* 更多路由... */}
        <Route path="/storages" component={StoragePage} />
        <Route
          path="*404"
          component={() => (
            <div class="p-10 text-center">404: Page Not Found</div>
          )}
        />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
