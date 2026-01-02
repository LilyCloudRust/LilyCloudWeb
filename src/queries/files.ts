// src/queries/files.ts
import { createQuery } from "@tanstack/solid-query";
import { api } from "../lib/client";
import type { FileListResponse } from "../types/api";
import { Accessor } from "solid-js";

// 获取文件列表 Hook
export const useFiles = (path: Accessor<string>) => {
  return createQuery(() => ({
    queryKey: ["files", path()],
    queryFn: async () => {
      const res = await api.get<FileListResponse>("/files/list", {
        params: { path: path() },
      });
      return res.data;
    },
    // 当 path 变化时自动刷新
    enabled: !!path(),
  }));
};
