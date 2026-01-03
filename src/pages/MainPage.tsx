// src/pages/MainPage.tsx
import { FolderOpen, FolderPlus } from "lucide-solid";
import { Component, createSignal, Show } from "solid-js";
import { createMemo } from "solid-js"; // 引入 createMemo

import { ContextMenu } from "../components/ContextMenu";
import { FileGridView } from "../components/file-browser/FileGridView";
import { FileListView } from "../components/file-browser/FileListView";
// ... (Sidebar, Topbar imports)
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useFileOperations } from "../hooks/useFileOperations";
import { useFiles } from "../queries/files";
import { clipboardStore } from "../store/clipboard"; // 引入 Store

const MainPage: Component = () => {
  const [currentPath, setCurrentPath] = createSignal("/");
  const [viewMode, setViewMode] = createSignal<"list" | "grid">("grid");

  // 修改 ContextMenu 状态定义，支持 target 为 null
  const [contextMenu, setContextMenu] = createSignal<{
    x: number;
    y: number;
    target: any | null; // null 表示点击了背景
  } | null>(null);

  const fileQuery = useFiles(currentPath);
  const {
    uploadFile,
    deleteFile,
    createFolder,
    renameFile,
    downloadFile,
    pasteFiles,
  } = useFileOperations(currentPath);

  let fileInputRef: HTMLInputElement | undefined;

  // --- Handlers ---
  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) createFolder(name);
  };
  // 计算当前目录下文件的总大小
  const currentFolderSize = createMemo(() => {
    const items = fileQuery.data?.items || [];
    return items.reduce((acc, item) => acc + (item.size || 0), 0);
  });

  // 文件上的右键
  const handleFileContextMenu = (e: MouseEvent, file: any) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止冒泡到背景
    setContextMenu({ x: e.clientX, y: e.clientY, target: file });
  };

  // 背景上的右键
  const handleBackgroundContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    // 只有直接点在 main 上才触发，或者确保没有点在文件上
    setContextMenu({ x: e.clientX, y: e.clientY, target: null });
  };

  const handleRename = (file: any) => {
    const originalName = file.name;
    let nameWithoutExt = originalName;
    let extension = "";

    // 1. 如果是文件且不是以 . 开头（隐藏文件），则分离后缀
    if (file.type !== "directory" && originalName.lastIndexOf(".") > 0) {
      const lastDotIndex = originalName.lastIndexOf(".");
      nameWithoutExt = originalName.substring(0, lastDotIndex);
      extension = originalName.substring(lastDotIndex); // 包含 . (例如 .txt)
    }

    // 2. 弹出框只显示文件名部分
    const newBaseName = prompt("Rename to:", nameWithoutExt);

    // 3. 如果用户取消或没改名，直接返回
    if (!newBaseName || newBaseName === nameWithoutExt) return;

    // 4. 拼回后缀
    const finalName = newBaseName + extension;

    // 5. 再次确认没变（虽然上面判断过，但拼完可能一样）
    if (finalName !== originalName) {
      renameFile({ oldName: originalName, newName: finalName });
    }
  };

  // --- 剪贴板操作 ---
  const handleCopy = (file: any) => {
    clipboardStore.copy([file.name], currentPath());
  };

  const handleCut = (file: any) => {
    clipboardStore.cut([file.name], currentPath());
  };

  const handlePaste = () => {
    pasteFiles();
  };

  // 点击任意地方关闭菜单
  const handleClick = () => setContextMenu(null);

  return (
    <div
      class="flex h-screen bg-white text-gray-800 font-sans overflow-hidden"
      onClick={handleClick}
    >
      {/* 传入计算出的大小，假装总容量是 10GB (10 * 1024^3) */}
      <Sidebar
        storageUsed={currentFolderSize()}
        storageTotal={100 * 1024 * 1024}
      />

      <div class="flex-1 flex flex-col h-full relative">
        <Topbar
          currentPath={currentPath()}
          onNavigate={setCurrentPath}
          viewMode={viewMode()}
          setViewMode={setViewMode}
        />

        <div class="px-6 pt-6 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCreateFolder();
            }}
            class="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors"
          >
            <FolderPlus size={18} /> New Folder
          </button>
        </div>

        <main
          class="flex-1 overflow-y-auto p-6 bg-white"
          onContextMenu={handleBackgroundContextMenu} // 绑定背景右键
        >
          <Show
            when={!fileQuery.isLoading}
            fallback={
              <div class="p-10 text-center text-gray-400">Loading files...</div>
            }
          >
            <Show
              when={fileQuery.data?.items && fileQuery.data.items.length > 0}
              fallback={
                <div class="h-96 flex flex-col items-center justify-center text-gray-300">
                  <FolderOpen size={64} strokeWidth={1} />
                  <p class="mt-4 text-lg font-medium text-gray-400">
                    This folder is empty
                  </p>
                  <p class="text-xs mt-1 text-gray-400">
                    Right click here to Paste
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef?.click();
                    }}
                    class="mt-4 text-blue-500 hover:underline text-sm"
                  >
                    Upload your first file
                  </button>
                </div>
              }
            >
              <Show when={viewMode() === "grid"}>
                <FileGridView
                  files={fileQuery.data?.items || []}
                  onNavigate={(name) =>
                    setCurrentPath((path) =>
                      path === "/" ? `/${name}` : `${path}/${name}`,
                    )
                  }
                  onDelete={deleteFile}
                  onUploadClick={() => fileInputRef?.click()}
                  onContextMenu={handleFileContextMenu} // 绑定文件右键
                />
              </Show>

              <Show when={viewMode() === "list"}>
                <FileListView
                  files={fileQuery.data?.items || []}
                  onNavigate={(name) =>
                    setCurrentPath((path) =>
                      path === "/" ? `/${name}` : `${path}/${name}`,
                    )
                  }
                  onDelete={deleteFile}
                  // 注意：如果你之前的 FileListView 没有加 onContextMenu 属性，请去加一下，和 GridView 一样
                  // @ts-ignore
                  onContextMenu={handleFileContextMenu}
                />
              </Show>
            </Show>
          </Show>
        </main>

        {/* 统一的右键菜单 */}
        <Show when={contextMenu()}>
          <ContextMenu
            x={contextMenu()!.x}
            y={contextMenu()!.y}
            target={contextMenu()!.target}
            onClose={() => setContextMenu(null)}
            // File Actions
            onDownload={() => downloadFile(contextMenu()!.target.name)}
            onRename={() => handleRename(contextMenu()!.target)}
            onDelete={() => deleteFile(contextMenu()!.target.name)}
            onCopy={() => handleCopy(contextMenu()!.target)}
            onCut={() => handleCut(contextMenu()!.target)}
            // Background Actions
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
      </div>
    </div>
  );
};

export default MainPage;
