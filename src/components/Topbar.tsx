// src/components/Topbar.tsx
import {
  ChevronLeft,
  LayoutGrid,
  List as ListIcon,
  LogOut,
  Search,
} from "lucide-solid";
import { Component, Show } from "solid-js";

import { authStore } from "../store/auth";

interface TopbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;

  // 新增：搜索相关 Props
  searchKeyword: string;
  onSearch: (keyword: string) => void;
}

const Topbar: Component<TopbarProps> = (props) => {
  // 生成面包屑数据
  const breadcrumbs = () => {
    const parts = props.currentPath.split("/").filter(Boolean);
    let pathAcc = "";
    return [
      { name: "Home", path: "/" },
      ...parts.map((part) => {
        pathAcc += `/${part}`;
        return { name: part, path: pathAcc };
      }),
    ];
  };

  const handleGoBack = () => {
    const parts = props.currentPath.split("/").filter(Boolean);
    parts.pop();
    const parentPath = "/" + parts.join("/");
    props.onNavigate(parentPath);
  };

  return (
    <header class="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20">
      {/* 左侧：面包屑导航 (macOS Finder Path Bar 风格) */}
      <div class="flex items-center gap-1 overflow-hidden text-sm">
        {/* 返回按钮 */}
        <Show when={breadcrumbs().length > 1}>
          <button
            onClick={handleGoBack}
            class="mr-2 p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            title="Go Back"
          >
            <ChevronLeft size={18} />
          </button>
        </Show>

        <div class="flex items-center text-gray-600">
          {breadcrumbs().map((crumb, index) => (
            <div class="flex items-center">
              {index > 0 && <span class="mx-1 text-gray-400">/</span>}
              <button
                onClick={() => props.onNavigate(crumb.path)}
                class={`px-2 py-1 rounded hover:bg-gray-100 transition-colors max-w-[150px] truncate ${
                  index === breadcrumbs().length - 1
                    ? "font-semibold text-gray-900 bg-gray-100"
                    : "hover:text-gray-900"
                }`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧：视图切换、搜索、用户 */}
      <div class="flex items-center gap-3">
        {/* 视图切换按钮组 */}
        <div class="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => props.setViewMode("grid")}
            class={`p-1.5 rounded-md transition-all ${
              props.viewMode === "grid"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => props.setViewMode("list")}
            class={`p-1.5 rounded-md transition-all ${
              props.viewMode === "list"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            title="List View"
          >
            <ListIcon size={16} />
          </button>
        </div>

        <div class="h-5 w-px bg-gray-300 mx-1"></div>

        {/* 搜索框 */}
        <div class="relative group">
          <Search
            class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search"
            class="bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/50 rounded-lg pl-9 pr-8 py-1.5 text-sm w-48 transition-all"
            value={props.searchKeyword}
            onInput={(e) => props.onSearch(e.currentTarget.value)}
          />
          <Show when={props.searchKeyword}>
            <button
              onClick={() => props.onSearch("")}
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <span class="text-xs">✕</span>
            </button>
          </Show>
        </div>

        {/* 用户头像 */}
        <div class="ml-2 flex items-center gap-2 cursor-pointer group relative">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {authStore.user()?.username?.[0]?.toUpperCase() || "U"}
          </div>
          {/* 下拉菜单模拟 */}
          <button
            onClick={() => authStore.logout()}
            class="absolute top-10 right-0 bg-white shadow-lg border border-gray-100 rounded-lg py-2 px-4 w-32 hidden group-hover:block hover:block z-50 text-sm text-red-600 hover:bg-red-50 transition-all animate-fade-in"
          >
            <div class="flex items-center gap-2">
              <LogOut size={14} /> Logout
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
