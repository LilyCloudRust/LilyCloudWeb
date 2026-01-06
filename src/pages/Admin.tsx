// src/pages/Admin.tsx
import { createQuery } from "@tanstack/solid-query";
import { HardDrive, Plus, ShieldAlert, Trash2, User } from "lucide-solid";
import { Component, createSignal, For, Show } from "solid-js";

import Sidebar from "../components/Sidebar";
import { api } from "../lib/client";
import type { StorageListResponse, UserListResponse } from "../types/admin";

const Admin: Component = () => {
  const [activeTab, setActiveTab] = createSignal<"users" | "storages">("users");

  // --- Queries ---
  const usersQuery = createQuery(() => ({
    queryKey: ["admin", "users"],
    queryFn: async () => (await api.get<UserListResponse>("/admin/users")).data,
    enabled: activeTab() === "users", // 只有切到这个 tab 才请求
  }));

  return (
    <div class="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
      <Sidebar />

      <main class="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShieldAlert class="text-blue-600" /> System Administration
          </h1>

          {/* Tabs */}
          <div class="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("users")}
              class={`pb-2 px-4 font-medium transition-colors border-b-2 ${
                activeTab() === "users"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Users
            </button>
          </div>

          {/* Users Content */}
          <Show when={activeTab() === "users"}>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="font-bold text-gray-700 flex items-center gap-2">
                  <User size={18} /> User List
                </h3>
                <button class="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700">
                  <Plus size={16} /> Add User
                </button>
              </div>

              <Show
                when={!usersQuery.isLoading}
                fallback={
                  <div class="p-8 text-center text-gray-400">
                    Loading users...
                  </div>
                }
              >
                <table class="w-full text-sm text-left">
                  <thead class="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th class="px-6 py-3">ID</th>
                      <th class="px-6 py-3">Username</th>
                      <th class="px-6 py-3">Created At</th>
                      <th class="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <For each={usersQuery.data?.items}>
                      {(user) => (
                        <tr class="hover:bg-gray-50">
                          <td class="px-6 py-3 font-mono text-gray-500">
                            #{user.user_id}
                          </td>
                          <td class="px-6 py-3 font-medium text-gray-800">
                            {user.username}
                          </td>
                          <td class="px-6 py-3 text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td class="px-6 py-3 text-right">
                            <button class="text-red-500 hover:bg-red-50 p-1 rounded">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </Show>
            </div>
          </Show>
        </div>
      </main>
    </div>
  );
};

export default Admin;
