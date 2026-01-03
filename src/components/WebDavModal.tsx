import { Check,Copy, Globe, X } from "lucide-solid";
import { Component, createMemo,Show } from "solid-js";
import { createSignal } from "solid-js";

import { authStore } from "../store/auth"; // 1. 引入 authStore

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WebDavModal: Component<Props> = (props) => {
  const [copied, setCopied] = createSignal(false);

  // 2. 动态计算 WebDAV URL
  // 假设后端运行在 8000 端口，且挂载点是 /webdav
  // 如果你的 WebDAV 也是走的 Vite 代理 (5173/api/webdav)，请相应修改这里
  const webDavUrl = createMemo(() => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // 这里假设直连后端 8000 端口，这样通常更稳定，避免 Vite 代理的一些兼容问题
    return `${protocol}//${hostname}:8000/webdav`;
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webDavUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative transform transition-all scale-100">
          <button
            onClick={props.onClose}
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div class="flex items-center gap-3 mb-4 text-blue-600">
            <Globe size={28} />
            <h2 class="text-xl font-bold">Connect via WebDAV</h2>
          </div>

          <p class="text-gray-600 text-sm mb-6 leading-relaxed">
            Access your files directly from your computer's file explorer
            (Finder, Windows Explorer) or apps like Cyberduck.
          </p>

          <div class="space-y-5">
            {/* Server URL */}
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Server URL
              </label>
              <div class="flex mt-1.5 shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={webDavUrl()}
                  class="flex-1 bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg px-3 py-2.5 text-sm text-gray-700 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={copyToClipboard}
                  class={`px-4 rounded-r-lg border border-l-0 transition-all flex items-center justify-center min-w-[60px] ${
                    copied()
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Show when={copied()} fallback={<Copy size={16} />}>
                    <Check size={16} />
                  </Show>
                </button>
              </div>
            </div>

            {/* Credentials Grid */}
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Username
                </label>
                <div class="mt-1.5 px-3 py-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-800 font-medium truncate">
                  {/* 3. 显示真实用户名 */}
                  {authStore.user()?.username || "Loading..."}
                </div>
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <div class="mt-1.5 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 italic">
                  {/* 4. 提示用户使用登录密码 */}
                  Use your login password
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-4 border-t border-gray-100 text-center">
            <a
              href="https://www.google.com/search?q=how+to+map+webdav+drive"
              target="_blank"
              class="text-xs text-blue-500 hover:text-blue-700 hover:underline font-medium flex items-center justify-center gap-1"
            >
              How to connect on Windows/Mac? ↗
            </a>
          </div>
        </div>
      </div>
    </Show>
  );
};
