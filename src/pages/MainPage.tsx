// src/pages/MainPage.tsx
import { Component, createSignal, Show } from "solid-js";
import { useFiles } from "../queries/files";
import { useFileOperations } from "../hooks/useFileOperations";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { FileGridView } from "../components/file-browser/FileGridView";
import { FileListView } from "../components/file-browser/FileListView";
import { FolderOpen } from "lucide-solid";

const MainPage: Component = () => {
  // 1. 状态管理
  const [currentPath, setCurrentPath] = createSignal("/");
  const [viewMode, setViewMode] = createSignal<"list" | "grid">("grid");
  let fileInputRef: HTMLInputElement | undefined;

  // 2. 数据与逻辑 Hooks
  const fileQuery = useFiles(currentPath);
  const { uploadFile, deleteFile, isUploading } =
    useFileOperations(currentPath);

  // 3. 事件处理 Handlers
  const handleNavigate = (path: string) => setCurrentPath(path);

  const handleEnterFolder = (name: string) => {
    const newPath =
      currentPath() === "/" ? `/${name}` : `${currentPath()}/${name}`;
    setCurrentPath(newPath);
  };

  const handleDelete = (name: string) => {
    if (confirm(`Delete ${name}?`)) deleteFile(name);
  };

  const handleUploadSelect = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    if (input.files?.[0]) uploadFile(input.files[0]);
  };

  return (
    <div class="flex h-screen bg-white text-gray-800 font-sans overflow-hidden selection:bg-blue-100">
      <Sidebar />

      <div class="flex-1 flex flex-col h-full relative">
        <Topbar
          currentPath={currentPath()}
          onNavigate={handleNavigate}
          viewMode={viewMode()}
          setViewMode={setViewMode}
        />

        <main
          class="flex-1 overflow-y-auto p-4"
          onContextMenu={(e) => e.preventDefault()}
        >
          <Show
            when={!fileQuery.isLoading}
            fallback={
              <div class="flex justify-center mt-20 text-gray-400">
                Loading...
              </div>
            }
          >
            <Show
              when={fileQuery.data?.items.length !== 0}
              fallback={
                // 空文件夹状态
                <div class="h-64 flex flex-col items-center justify-center text-gray-300">
                  <FolderOpen size={64} strokeWidth={1} />
                  <p class="mt-4 text-sm font-medium">This folder is empty</p>
                  <button
                    onClick={() => fileInputRef?.click()}
                    class="mt-4 text-blue-500 hover:underline text-sm"
                  >
                    Upload a file
                  </button>
                </div>
              }
            >
              {/* 视图切换 */}
              <Show when={viewMode() === "grid"}>
                <FileGridView
                  files={fileQuery.data?.items || []}
                  onNavigate={handleEnterFolder}
                  onDelete={handleDelete}
                  onUploadClick={() => fileInputRef?.click()}
                />
              </Show>

              <Show when={viewMode() === "list"}>
                <FileListView
                  files={fileQuery.data?.items || []}
                  onNavigate={handleEnterFolder}
                  onDelete={handleDelete}
                />
              </Show>
            </Show>
          </Show>
        </main>

        {/* 隐藏的上传 Input */}
        <input
          type="file"
          ref={fileInputRef}
          class="hidden"
          onChange={handleUploadSelect}
        />

        {/* 上传 loading 提示 (可选) */}
        <Show when={isUploading}>
          <div class="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-pulse">
            Uploading...
          </div>
        </Show>
      </div>
    </div>
  );
};

export default MainPage;
