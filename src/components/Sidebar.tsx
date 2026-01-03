// src/components/Sidebar.tsx
import { A, useLocation } from "@solidjs/router";
import { Cloud, FolderOpen, Settings, Shield } from "lucide-solid";
import { Component } from "solid-js";

// 定义 Props
interface SidebarProps {
  storageUsed?: number; // 传入的是字节 (Bytes)
  storageTotal?: number; // 总容量字节
}

const Sidebar: Component<SidebarProps> = (props) => {
  const location = useLocation();

  const SidebarItem = (p: { href: string; icon: any; label: string }) => {
    const isActive = () =>
      p.href === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(p.href);

    return (
      <A
        href={p.href}
        class={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isActive()
            ? "bg-blue-500 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-200/50"
        }`}
      >
        <p.icon size={18} class={isActive() ? "text-white" : "text-gray-500"} />
        {p.label}
      </A>
    );
  };

  // 🟢 修复核心：智能单位转换函数
  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];

    // 计算它是哪个单位的级别 (0=B, 1=KB, 2=MB...)
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // 保留2位小数，防止过小的文件显示为0
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const used = props.storageUsed || 0;
  // 默认总容量 10GB
  const total = props.storageTotal || 2 * 1024 * 1024 * 1024;

  // 计算进度条百分比
  const percent = Math.min((used / total) * 100, 100);

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
        <SidebarItem href="/admin" icon={Shield} label="Admin" />
        <SidebarItem href="/settings" icon={Settings} label="Settings" />
      </nav>

      {/* 底部存储状态 */}
      <div class="px-5 mt-auto">
        <div class="bg-white/50 p-3 rounded-xl border border-gray-100 shadow-sm">
          <div class="text-xs font-medium text-gray-500 mb-2">Storage Used</div>

          {/* 进度条 */}
          <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* 🟢 显示具体的数值 */}
          <div class="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
            <span>{formatSize(used)}</span>
            <span class="text-gray-400">/ {formatSize(total)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
