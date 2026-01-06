// src/queries/admin/storages.ts
import { createQuery, createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";
import { api, queryClient } from "../lib/client";
import {
  StorageListQuery,
  StorageListResponse,
  StorageCreate,
  StorageUpdate,
  StorageResponse,
} from "../types";

// 1. 获取存储列表
export const useStorageList = (params: Accessor<StorageListQuery>) => {
  return createQuery(() => ({
    queryKey: ["admin-storages", params()],
    queryFn: async () => {
      const res = await api.get<StorageListResponse>("/admin/storages", {
        params: params(),
      });
      return res.data;
    },
  }));
};

// 2. 创建存储
export const useCreateStorage = () => {
  return createMutation(() => ({
    mutationFn: async (data: StorageCreate) => {
      return api.post<StorageResponse>("/admin/storages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-storages"] });
    },
  }));
};

// 3. 更新存储
export const useUpdateStorage = () => {
  return createMutation(() => ({
    mutationFn: async ({ id, data }: { id: number; data: StorageUpdate }) => {
      return api.patch<StorageResponse>(`/admin/storages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-storages"] });
    },
  }));
};

// 4. 删除存储
export const useDeleteStorage = () => {
  return createMutation(() => ({
    mutationFn: async (id: number) => {
      return api.delete(`/admin/storages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-storages"] });
    },
  }));
};
