// src/queries/trash.ts
import { createMutation,createQuery } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../lib/client";
// 确保从正确的路径引入类型，根据你的项目结构可能是 '../types' 或 '../types/api'
import {
  DeleteCommand,
  RestoreCommand,
  TaskResponse,
  TrashListQuery,
  TrashListResponse,
  TrashResponse,
} from "../types";

// --- Queries (读) ---

// 1. 获取回收站列表
export const useTrashList = (params: Accessor<TrashListQuery>) => {
  return createQuery(() => ({
    queryKey: ["trash-list", params()],
    queryFn: async () => {
      const res = await api.get<TrashListResponse>("/files/trash", {
        params: params(),
      });
      return res.data;
    },
    staleTime: 1000 * 10,
  }));
};

// 2. 获取回收站单个条目 (如果需要)
export const useTrashEntry = (trashId: Accessor<number | null>) => {
  return createQuery(() => ({
    queryKey: ["trash-entry", trashId()],
    queryFn: async () => {
      const res = await api.get<TrashResponse>(`/files/trash/${trashId()}`);
      return res.data;
    },
    enabled: !!trashId(),
  }));
};

// --- Mutations (写) ---

// 3. 还原文件 (Restore)
export const useTrashRestore = () => {
  return createMutation(() => ({
    mutationFn: async (payload: RestoreCommand) => {
      return api.post<TaskResponse>("/files/trash/restore", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash-list"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (err: any) => alert(`Restore failed: ${err.message}`),
  }));
};

// 4. 彻底删除/清空 (Delete Permanently)
// ⚠️ 关键点：确保这里的函数名是 useTrashDelete，以匹配 TrashPage.tsx 的引用
export const useTrashDelete = () => {
  return createMutation(() => ({
    mutationFn: async (payload: DeleteCommand) => {
      // DELETE /api/files/trash
      return api.delete<TaskResponse>("/files/trash", { data: payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash-list"] });
    },
    onError: (err: any) => alert(`Delete failed: ${err.message}`),
  }));
};
