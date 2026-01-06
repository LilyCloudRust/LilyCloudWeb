import { Check, Copy, Globe, LogOut, Shield, User } from "lucide-solid";
import { Component, createMemo, createSignal, Show } from "solid-js";

import Sidebar from "../components/Sidebar";
import { authStore } from "../store/auth";

const Settings: Component = () => {
  const [copied, setCopied] = createSignal(false);

  // 动态计算 WebDAV 地址
  const webDavUrl = createMemo(() => {
    return `${window.location.protocol}//${window.location.hostname}:8000/webdav`;
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webDavUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
      <Sidebar />

      <main class="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div class="max-w-4xl mx-auto space-y-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

          {/* 1. 个人资料卡片 */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <User size={20} class="text-blue-500" /> Profile
            </h2>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {authStore.user()?.username.charAt(0).toUpperCase()}
              </div>
              <div class="flex-1">
                <p class="text-lg font-medium">{authStore.user()?.username}</p>
                <p class="text-sm text-gray-500">Administrator</p>
              </div>
              <button
                onClick={() => authStore.logout()}
                class="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* 2. WebDAV 连接信息卡片 */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Globe size={20} class="text-purple-500" /> WebDAV Access
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                  Connect third-party apps (Finder, Explorer, Cyberduck) to
                  manage your files.
                </p>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
              {/* URL */}
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Server Endpoint
                </label>
                <div class="flex shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={webDavUrl()}
                    class="flex-1 bg-white border border-gray-200 border-r-0 rounded-l-lg px-3 py-2 text-sm font-mono text-gray-600 focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    class="px-3 bg-white border border-gray-200 border-l-0 rounded-r-lg hover:bg-gray-50 transition-colors text-gray-500"
                  >
                    <Show when={copied()} fallback={<Copy size={16} />}>
                      <Check size={16} class="text-green-500" />
                    </Show>
                  </button>
                </div>
              </div>

              {/* Grid for User/Pass */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Username
                  </label>
                  <div class="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium text-gray-700">
                    {authStore.user()?.username}
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div class="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-400 italic">
                    Use your login password
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 关于信息 */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Shield size={20} class="text-green-500" /> About
            </h2>
            <div class="text-sm text-gray-600 space-y-2">
              <p>
                Version:{" "}
                <span class="font-mono text-gray-800">1.0.0 (Beta)</span>
              </p>
              <p>Powered by SolidJS & FastAPI</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
