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
}

const Topbar: Component<TopbarProps> = (props) => {
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

  return (
    <header class="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20">
      {/* 左侧：面包屑导航 (macOS Finder Path Bar 风格) */}
      <div class="flex items-center gap-1 overflow-hidden text-sm">
        <Show when={breadcrumbs().length > 1}>
          <button
            onClick={() => {
              const parts = props.currentPath.split("/").filter(Boolean);
              parts.pop();
              const parentPath = "/" + parts.join("/");
              props.onNavigate(parentPath);
            }}
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
                class={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${
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

      {/* 右侧：视图切换与用户 */}
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
          >
            <ListIcon size={16} />
          </button>
        </div>

        <div class="h-5 w-px bg-gray-300 mx-1"></div>

        {/* 搜索 */}
        <div class="relative group">
          <Search
            class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search"
            class="bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/50 rounded-lg pl-9 pr-3 py-1.5 text-sm w-48 transition-all"
          />
        </div>

        {/* 用户头像 */}
        <div class="ml-2 flex items-center gap-2 cursor-pointer group relative">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {authStore.user()?.username?.[0]?.toUpperCase() || "U"}
          </div>
          {/* 下拉菜单模拟 */}
          <button
            onClick={() => authStore.logout()}
            class="absolute top-10 right-0 bg-white shadow-lg border border-gray-100 rounded-lg py-2 px-4 w-32 hidden group-hover:block hover:block z-50 text-sm text-red-600 hover:bg-red-50"
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
