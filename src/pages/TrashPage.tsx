// src/pages/TrashPage.tsx
import { AlertTriangle, RotateCcw, Trash2 } from "lucide-solid";
import { Component, createSignal, For, Show } from "solid-js";

import { FileIcon } from "../components/file-browser/FileIcon";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  useTrashDelete,
  useTrashList,
  useTrashRestore,
} from "../queries/trash";
import { SortBy, SortOrder } from "../types";

const TrashPage: Component = () => {
  // 1. 状态
  const [params] = createSignal({
    sort_by: SortBy.DELETED,
    sort_order: SortOrder.DESC,
    dir_first: true,
  });

  // 2. 数据与操作
  const trashQuery = useTrashList(params);
  const restoreMutation = useTrashRestore();
  const deleteMutation = useTrashDelete();

  // 3. 事件处理
  const handleRestore = (item: any) => {
    restoreMutation.mutate({
      dir: item.original_path, // 假设后端需要原路径来还原
      file_names: [item.entry_name],
    });
  };

  const handleDelete = (trashId: number) => {
    if (confirm("Permanently delete this item? This cannot be undone.")) {
      deleteMutation.mutate({
        trash_ids: [trashId],
      });
    }
  };

  const handleEmptyTrash = () => {
    if (
      confirm(
        "Are you sure you want to empty the trash? All files will be lost forever.",
      )
    ) {
      deleteMutation.mutate({
        empty: true,
      });
    }
  };

  return (
    <div class="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
      <Sidebar />

      <div class="flex-1 flex flex-col h-full relative">
        {/* 这里复用 Topbar，或者写一个简化的 TrashTopbar */}
        <header class="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20">
          <div class="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <Trash2 class="text-red-500" />
            Trash
          </div>

          <button
            onClick={handleEmptyTrash}
            disabled={trashQuery.data?.total === 0 || deleteMutation.isPending}
            class="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Empty Trash
          </button>
        </header>

        <main class="flex-1 overflow-y-auto p-6">
          <Show
            when={!trashQuery.isLoading}
            fallback={
              <div class="p-10 text-center text-gray-400">Loading trash...</div>
            }
          >
            <Show
              when={trashQuery.data?.items.length !== 0}
              fallback={
                <div class="h-64 flex flex-col items-center justify-center text-gray-300">
                  <Trash2 size={64} strokeWidth={1} />
                  <p class="mt-4 text-sm font-medium">Trash is empty</p>
                </div>
              }
            >
              <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table class="w-full text-sm text-left">
                  <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                      <th class="px-6 py-3 w-12"></th>
                      <th class="px-6 py-3">Name</th>
                      <th class="px-6 py-3">Original Path</th>
                      <th class="px-6 py-3">Deleted At</th>
                      <th class="px-6 py-3 w-24">Size</th>
                      <th class="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <For each={trashQuery.data?.items}>
                      {(item) => (
                        <tr class="hover:bg-red-50/30 group transition-colors">
                          <td class="px-6 py-3">
                            {/* 由于 TrashItem 也是文件，我们可以复用 FileIcon */}
                            <FileIcon
                              type={
                                item.type === "directory" ? "directory" : "file"
                              }
                              mimeType={item.mime_type}
                              size={20}
                            />
                          </td>
                          <td class="px-6 py-3 font-medium text-gray-700">
                            {item.entry_name}
                          </td>
                          <td class="px-6 py-3 text-gray-500 font-mono text-xs">
                            {item.original_path}
                          </td>
                          <td class="px-6 py-3 text-gray-400 text-xs">
                            {new Date(item.deleted_at).toLocaleString()}
                          </td>
                          <td class="px-6 py-3 text-gray-400 text-xs">
                            {item.size
                              ? (item.size / 1024).toFixed(1) + " KB"
                              : "-"}
                          </td>
                          <td class="px-6 py-3 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRestore(item)}
                              class="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                              title="Restore"
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.trash_id)}
                              class="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                              title="Delete Permanently"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </Show>
        </main>
      </div>
    </div>
  );
};

export default TrashPage;
