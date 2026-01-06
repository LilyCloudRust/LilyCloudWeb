// src/pages/admin/StoragePage.tsx
import { Component, createSignal, For, Show } from "solid-js";
import Sidebar from "../components/Sidebar";
import {
  useStorageList,
  useCreateStorage,
  useUpdateStorage,
  useDeleteStorage,
} from "../queries/storages";
import {
  HardDrive,
  Plus,
  Edit,
  Trash2,
  Server,
  Database,
  CheckCircle,
  XCircle,
} from "lucide-solid";
import { StorageResponse, StorageType } from "../types";

const StoragePage: Component = () => {
  // --- 状态 ---
  const [page, setPage] = createSignal(1);
  const storageQuery = useStorageList(() => ({
    page: page(),
    page_size: 100,
    sort_by: "created_at",
  }));

  const createMutation = useCreateStorage();
  const updateMutation = useUpdateStorage();
  const deleteMutation = useDeleteStorage();

  // Modal 状态
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [editingId, setEditingId] = createSignal<number | null>(null);

  // 表单状态
  const [formData, setFormData] = createSignal({
    mount_path: "/",
    type: "local" as StorageType,
    enabled: true,
    // Local Config
    local_root: "/data",
    local_trash_path: ".trash", // ✅ 新增：回收站路径
    // S3 Config
    s3_endpoint: "",
    s3_bucket: "",
    s3_access_key: "",
    s3_secret_key: "",
    s3_region: "",
  });

  // --- 动作处理 ---

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      mount_path: "/",
      type: "local",
      enabled: true,
      local_root: "",
      local_trash_path: ".trash", // ✅ 默认值
      s3_endpoint: "",
      s3_bucket: "",
      s3_access_key: "",
      s3_secret_key: "",
      s3_region: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: StorageResponse) => {
    setEditingId(item.storage_id);
    const config = item.config || {};
    setFormData({
      mount_path: item.mount_path,
      type: item.type,
      enabled: item.enabled,
      // ✅ 适配后端字段名 root_path 和 trash_path
      local_root: config.root_path || "",
      local_trash_path: config.trash_path || ".trash",

      s3_endpoint: config.endpoint || "",
      s3_bucket: config.bucket || "",
      s3_access_key: config.access_key || "",
      s3_secret_key: config.secret_key || "",
      s3_region: config.region || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this storage?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const f = formData();

    // 组装 config JSON
    let config = {};
    if (f.type === "local") {
      config = {
        root_path: f.local_root, // ✅ 对应后端 root_path
        trash_path: f.local_trash_path, // ✅ 对应后端 trash_path
      };
    } else if (f.type === "s3") {
      config = {
        endpoint: f.s3_endpoint,
        bucket: f.s3_bucket,
        access_key: f.s3_access_key,
        secret_key: f.s3_secret_key,
        region: f.s3_region,
      };
    }

    const payload = {
      mount_path: f.mount_path,
      type: f.type,
      enabled: f.enabled,
      config: config,
    };

    if (editingId()) {
      updateMutation.mutate(
        { id: editingId()!, data: payload },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  // --- 辅助函数：更新表单字段 ---
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div class="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div class="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div class="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Server class="text-blue-600" />
            <span>Storage Management</span>
          </div>
          <button
            onClick={handleOpenCreate}
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={18} /> Add Storage
          </button>
        </header>

        {/* Content */}
        <main class="flex-1 overflow-auto p-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table class="w-full text-sm text-left">
              <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4">ID</th>
                  <th class="px-6 py-4">Mount Path</th>
                  <th class="px-6 py-4">Type</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">Config Summary</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <Show
                  when={!storageQuery.isLoading}
                  fallback={
                    <tr>
                      <td colspan={6} class="p-6 text-center">
                        Loading...
                      </td>
                    </tr>
                  }
                >
                  <For each={storageQuery.data?.items}>
                    {(item) => (
                      <tr class="hover:bg-gray-50/50">
                        <td class="px-6 py-4 text-gray-500">
                          #{item.storage_id}
                        </td>
                        <td class="px-6 py-4 font-mono text-blue-700 font-medium">
                          {item.mount_path}
                        </td>
                        <td class="px-6 py-4">
                          <span
                            class={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.type === "local"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {item.type === "local" ? (
                              <HardDrive size={12} />
                            ) : (
                              <Database size={12} />
                            )}
                            {item.type.toUpperCase()}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          {item.enabled ? (
                            <span class="flex items-center gap-1 text-green-600 text-xs font-medium">
                              <CheckCircle size={14} /> Enabled
                            </span>
                          ) : (
                            <span class="flex items-center gap-1 text-gray-400 text-xs font-medium">
                              <XCircle size={14} /> Disabled
                            </span>
                          )}
                        </td>
                        <td class="px-6 py-4 text-gray-400 text-xs truncate max-w-xs font-mono">
                          {item.type === "local"
                            ? item.config.root_path // ✅ 更新显示字段
                            : `${item.config.bucket} @ ${item.config.region || "default"}`}
                        </td>
                        <td class="px-6 py-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.storage_id)}
                            class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </Show>
              </tbody>
            </table>
          </div>
        </main>

        {/* Modal */}
        <Show when={isModalOpen()}>
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
              <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="font-semibold text-lg text-gray-800">
                  {editingId() ? "Edit Storage" : "New Storage"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  class="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                class="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
              >
                {/* 基础设置 */}
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Mount Path
                    </label>
                    <input
                      type="text"
                      required
                      value={formData().mount_path}
                      onInput={(e) =>
                        updateField("mount_path", e.currentTarget.value)
                      }
                      placeholder="/mnt/..."
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData().type}
                      onChange={(e) =>
                        updateField("type", e.currentTarget.value)
                      }
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                      <option value="local">Local Filesystem</option>
                      <option value="s3">S3 Compatible</option>
                    </select>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={formData().enabled}
                    onChange={(e) =>
                      updateField("enabled", e.currentTarget.checked)
                    }
                    class="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    for="enabled"
                    class="text-sm font-medium text-gray-700"
                  >
                    Enable this storage
                  </label>
                </div>

                <div class="border-t border-gray-100 my-4"></div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {formData().type === "local" ? "Local Config" : "S3 Config"}
                </h4>

                {/* Local Config */}
                <Show when={formData().type === "local"}>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Root Path (on server)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData().local_root}
                        onInput={(e) =>
                          updateField("local_root", e.currentTarget.value)
                        }
                        placeholder="/var/www/uploads"
                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                      />
                    </div>
                    {/* ✅ 新增：Trash Path 输入框 */}
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Trash Path (relative or absolute)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData().local_trash_path}
                        onInput={(e) =>
                          updateField("local_trash_path", e.currentTarget.value)
                        }
                        placeholder=".trash"
                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                </Show>

                {/* S3 Config */}
                <Show when={formData().type === "s3"}>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Endpoint
                      </label>
                      <input
                        type="text"
                        value={formData().s3_endpoint}
                        onInput={(e) =>
                          updateField("s3_endpoint", e.currentTarget.value)
                        }
                        placeholder="https://s3.amazonaws.com"
                        class="w-full px-3 py-2 border rounded-lg outline-none text-sm"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Bucket
                        </label>
                        <input
                          type="text"
                          required
                          value={formData().s3_bucket}
                          onInput={(e) =>
                            updateField("s3_bucket", e.currentTarget.value)
                          }
                          class="w-full px-3 py-2 border rounded-lg outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Region
                        </label>
                        <input
                          type="text"
                          value={formData().s3_region}
                          onInput={(e) =>
                            updateField("s3_region", e.currentTarget.value)
                          }
                          class="w-full px-3 py-2 border rounded-lg outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Access Key
                        </label>
                        <input
                          type="text"
                          value={formData().s3_access_key}
                          onInput={(e) =>
                            updateField("s3_access_key", e.currentTarget.value)
                          }
                          class="w-full px-3 py-2 border rounded-lg outline-none text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Secret Key
                        </label>
                        <input
                          type="password"
                          value={formData().s3_secret_key}
                          onInput={(e) =>
                            updateField("s3_secret_key", e.currentTarget.value)
                          }
                          class="w-full px-3 py-2 border rounded-lg outline-none text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </Show>

                <div class="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editingId() ? "Save Changes" : "Create Storage"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default StoragePage;
