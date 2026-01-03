// src/components/Sidebar.tsx
import { A, useLocation } from "@solidjs/router";
import { Cloud,FolderOpen, Settings, Shield } from "lucide-solid";
import { Component } from "solid-js";

const Sidebar: Component = () => {
  const location = useLocation();

  const SidebarItem = (props: { href: string; icon: any; label: string }) => {
    const isActive = () =>
      props.href === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(props.href);

    return (
      <A
        href={props.href}
        class={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isActive()
            ? "bg-blue-500 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-200/50"
        }`}
      >
        <props.icon
          size={18}
          class={isActive() ? "text-white" : "text-gray-500"}
        />
        {props.label}
      </A>
    );
  };

  return (
    <aside class="w-60 bg-[#F3F4F6] border-r border-gray-200 flex flex-col h-full pt-4 pb-4 backdrop-blur-xl z-20">
      <div class="px-5 mb-6 flex items-center gap-2 text-gray-700">
        <Cloud class="text-blue-600" size={24} />
        <span class="text-lg font-bold tracking-tight">LilyCloud</span>
      </div>

      <nav class="flex-1 px-3 space-y-1">
        <div class="px-3 text-xs font-semibold text-gray-400 uppercase mb-2 mt-2">
          Locations
        </div>
        <SidebarItem href="/" icon={FolderOpen} label="My Files" />

        <div class="px-3 text-xs font-semibold text-gray-400 uppercase mb-2 mt-6">
          System
        </div>
        {/* Admin 页面你可以后续开发，或者先隐藏 */}
        <SidebarItem href="/admin" icon={Shield} label="Admin" />
        {/* 重点是这个 Settings */}
        <SidebarItem href="/settings" icon={Settings} label="Settings" />
      </nav>

      {/* 底部存储状态 */}
      <div class="px-5 mt-auto">
        <div class="bg-white/50 p-3 rounded-xl border border-gray-100 shadow-sm">
          <div class="text-xs font-medium text-gray-500 mb-2">Storage Used</div>
          <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 w-[75%] rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
