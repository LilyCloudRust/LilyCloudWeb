// src/pages/MainPage.tsx
import { useNavigate } from "@solidjs/router";
import { Download, FolderOpen, FolderPlus, Trash2, X } from "lucide-solid";
import { Component, createMemo, createSignal, Show } from "solid-js";

import { ContextMenu } from "../components/ContextMenu";
import { FileGridView } from "../components/file-browser/FileGridView";
import { FileListView } from "../components/file-browser/FileListView";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useFileOperations } from "../hooks/useFileOperations";
import { useFiles, useSearchFiles } from "../queries/files"; // 引入搜索 Hook
import { clipboardStore } from "../store/clipboard";

const MainPage: Component = () => {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = createSignal("/");
  const [viewMode, setViewMode] = createSignal<"list" | "grid">("grid");

  // 1. 搜索状态
  const [searchKeyword, setSearchKeyword] = createSignal("");

  // 2. 多选状态
  const [selectedFiles, setSelectedFiles] = createSignal<Set<string>>(
    new Set(),
  );

  // ContextMenu 状态
  const [contextMenu, setContextMenu] = createSignal<{
    x: number;
    y: number;
    target: any | null;
  } | null>(null);

  // --- Queries ---

  // 普通文件列表 Query
  const fileQuery = useFiles(() => ({
    path: currentPath(),
    // 可以在此添加排序参数
  }));

  // 搜索结果 Query
  const searchQuery = useSearchFiles(() => ({
    keyword: searchKeyword(),
    path: currentPath(), // 在当前路径下递归搜索
    recursive: true,
  }));

  // 3. 计算最终显示的数据 (Memo)
  // 如果有搜索关键词，显示搜索结果；否则显示普通列表
  const displayItems = createMemo(() => {
    if (searchKeyword().trim()) {
      return searchQuery.data?.items || [];
    }
    return fileQuery.data?.items || [];
  });

  const isLoading = createMemo(() => {
    if (searchKeyword().trim()) return searchQuery.isLoading;
    return fileQuery.isLoading;
  });

  // --- Hooks ---
  const {
    uploadFile,
    trashFile,
    createFolder,
    downloadFile,
    pasteFiles,
    batchDownload,
    isBatchDownloading,
    isUploading,
  } = useFileOperations(currentPath);

  let fileInputRef: HTMLInputElement | undefined;

  // --- Handlers ---

  // 多选逻辑
  const handleToggleSelect = (name: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) newSet.delete(name);
      else newSet.add(name);
      return newSet;
    });
  };

  const clearSelection = () => setSelectedFiles(new Set<string>());

  // 批量下载逻辑
  const handleBatchDownload = () => {
    const files = Array.from(selectedFiles());
    if (files.length === 0) return;

    // 调用 Hook
    batchDownload(files, {
      onSuccess: () => clearSelection(),
    });
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) createFolder(name);
  };

  // 仅供 Sidebar 展示容量条使用
  const currentFolderSize = createMemo(() => {
    const items = fileQuery.data?.items || [];
    return items.reduce((acc, item) => acc + (item.size || 0), 0);
  });

  // 导航逻辑
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSearchKeyword(""); // 导航时清空搜索
    clearSelection(); // 导航时清空选中
  };

  const enterFolder = (name: string) => {
    // 如果是在搜索结果中点击文件夹，通常建议跳转到该文件夹
    // 这里的 name 可能是文件名，如果搜索结果返回 full path，逻辑需要调整
    // 假设 API search 返回的 items path 属性是完整路径，name 是文件夹名
    // 简单起见，这里假设在当前视图下进入子文件夹
    handleNavigate(
      currentPath() === "/" ? `/${name}` : `${currentPath()}/${name}`,
    );
  };

  // 右键菜单
  const handleFileContextMenu = (e: MouseEvent, file: any) => {
    e.preventDefault();
    e.stopPropagation();
    // 如果右键的文件没被选中，且当前不是多选模式，可以视作单选
    if (!selectedFiles().has(file.name) && selectedFiles().size === 0) {
      // do nothing or select it
    }
    setContextMenu({ x: e.clientX, y: e.clientY, target: file });
  };

  const handleBackgroundContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    // 只有在没点击到文件时触发
    if (e.target === e.currentTarget) {
      setContextMenu({ x: e.clientX, y: e.clientY, target: null });
    }
  };

  const handleRename = (file: any) => {
    const originalName = file.name;
    const newName = prompt("Rename to:", originalName);
    // if (newName && newName !== originalName) {
    //   renameFile({ oldName: originalName, newName });
    // }
  };

  const handleCopy = (file: any) => {
    clipboardStore.copy([file.name], currentPath());
    setContextMenu(null);
    clearSelection();
  };

  const handleCut = (file: any) => {
    clipboardStore.cut([file.name], currentPath());
    setContextMenu(null);
    clearSelection();
  };

  const handlePaste = () => {
    pasteFiles();
    setContextMenu(null);
  };

  const handleMoveToTrash = (name: string) => {
    if (confirm(`Move "${name}" to trash?`)) {
      trashFile(name);
    }
    setContextMenu(null);
    if (selectedFiles().has(name)) handleToggleSelect(name);
  };

  const handleClick = () => setContextMenu(null);

  return (
    <div
      class="flex h-screen bg-white text-gray-800 font-sans overflow-hidden"
      onClick={handleClick}
    >
      <Sidebar
        storageUsed={currentFolderSize()}
        storageTotal={100 * 1024 * 1024}
      />

      <div class="flex-1 flex flex-col h-full relative">
        <Topbar
          currentPath={currentPath()}
          onNavigate={handleNavigate}
          viewMode={viewMode()}
          setViewMode={setViewMode}
          // 传递搜索状态
          searchKeyword={searchKeyword()}
          onSearch={setSearchKeyword}
        />

        {/* 工具栏区域 */}
        <div class="px-6 pt-6 flex items-center justify-between h-16 shrink-0">
          <Show
            when={selectedFiles().size > 0}
            fallback={
              // 默认工具栏
              <div class="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateFolder();
                  }}
                  class="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                >
                  <FolderPlus size={18} /> New Folder
                </button>

                <button
                  onClick={() => navigate("/trash")}
                  class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors text-sm font-medium border border-gray-200"
                >
                  <Trash2 size={16} />
                  <span>Trash Bin</span>
                </button>
              </div>
            }
          >
            {/* 选中操作工具栏 */}
            <div class="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg w-full animate-fade-in border border-blue-100">
              <button
                onClick={clearSelection}
                class="text-blue-600 hover:bg-blue-100 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
              <span class="text-sm font-medium text-blue-800">
                {selectedFiles().size} selected
              </span>

              <div class="h-4 w-px bg-blue-200 mx-2"></div>

              <button
                onClick={handleBatchDownload}
                disabled={isBatchDownloading}
                class="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium disabled:opacity-50 transition-colors"
              >
                <Download size={18} />
                {isBatchDownloading ? "Zipping..." : "Download Zip"}
              </button>

              {/* 也可以在这里加批量删除 */}
              {/* <button onClick={...} class="text-red-600 ..."><Trash2 size={18} /></button> */}
            </div>
          </Show>
        </div>

        <main
          class="flex-1 overflow-y-auto p-6 bg-white"
          onContextMenu={handleBackgroundContextMenu}
        >
          <Show
            when={!isLoading()}
            fallback={
              <div class="p-10 text-center text-gray-400">Loading...</div>
            }
          >
            <Show
              when={displayItems().length > 0}
              fallback={
                <div class="h-96 flex flex-col items-center justify-center text-gray-300">
                  <FolderOpen size={64} strokeWidth={1} />
                  <p class="mt-4 text-lg font-medium text-gray-400">
                    {searchKeyword()
                      ? "No results found"
                      : "This folder is empty"}
                  </p>
                  <p class="text-xs mt-1 text-gray-400">
                    {searchKeyword()
                      ? "Try different keywords"
                      : "Right click here to Paste or New Folder"}
                  </p>

                  <Show when={!searchKeyword()}>
                    <div class="flex gap-4 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef?.click();
                        }}
                        class="text-blue-500 hover:underline text-sm"
                      >
                        Upload file
                      </button>
                      <button
                        onClick={() => navigate("/trash")}
                        class="text-gray-400 hover:text-gray-600 hover:underline text-sm"
                      >
                        Check Trash
                      </button>
                    </div>
                  </Show>
                </div>
              }
            >
              <Show when={viewMode() === "grid"}>
                <FileGridView
                  files={displayItems()}
                  onNavigate={enterFolder}
                  onDelete={handleMoveToTrash}
                  onUploadClick={() => fileInputRef?.click()}
                  onContextMenu={handleFileContextMenu}
                  selectedFiles={selectedFiles()}
                  onToggleSelect={handleToggleSelect}
                />
              </Show>

              <Show when={viewMode() === "list"}>
                <FileListView
                  files={displayItems()}
                  onNavigate={enterFolder}
                  onDelete={handleMoveToTrash}
                  // @ts-ignore
                  onContextMenu={handleFileContextMenu}
                  selectedFiles={selectedFiles()}
                  onToggleSelect={handleToggleSelect}
                />
              </Show>
            </Show>
          </Show>
        </main>

        <Show when={contextMenu()}>
          <ContextMenu
            x={contextMenu()!.x}
            y={contextMenu()!.y}
            target={contextMenu()!.target}
            onClose={() => setContextMenu(null)}
            onDownload={() => downloadFile(contextMenu()!.target.name)}
            onRename={() => handleRename(contextMenu()!.target)}
            onDelete={() => handleMoveToTrash(contextMenu()!.target.name)}
            onCopy={() => handleCopy(contextMenu()!.target)}
            onCut={() => handleCut(contextMenu()!.target)}
            onPaste={handlePaste}
            onNewFolder={handleCreateFolder}
          />
        </Show>

        <input
          type="file"
          ref={fileInputRef}
          class="hidden"
          onChange={(e) => {
            if (e.currentTarget.files?.[0])
              uploadFile(e.currentTarget.files[0]);
          }}
        />

        <Show when={isUploading}>
          <div class="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-pulse z-50">
            Uploading...
          </div>
        </Show>
      </div>
    </div>
  );
};

export default MainPage;
