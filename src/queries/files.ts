// src/queries/files.ts
import { createQuery } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api } from "../lib/client";
import {
  FileItem,
  FileListResponse,
  ListQuery,
  SearchQuery,
  SearchResponse,
} from "../types"; // 确保从统一入口引入

// --- Queries ---

// 1. 获取文件列表
export const useFiles = (params: Accessor<ListQuery>) => {
  return createQuery(() => ({
    queryKey: ["files", params()],
    queryFn: async () => {
      // Axios params 会自动序列化
      const res = await api.get<FileListResponse>("/files/list", {
        params: params(),
      });
      return res.data;
    },
    // 只有当 path 有值时才触发请求
    enabled: !!params().path,
    // 保持数据新鲜度，避免频繁闪烁，视需求调整
    staleTime: 10 * 5,
  }));
};

// 2. 获取单个文件信息
export const useFileInfo = (path: Accessor<string>) => {
  return createQuery(() => ({
    queryKey: ["file-info", path()],
    queryFn: async () => {
      const res = await api.get<FileItem>("/files/info", {
        params: { path: path() },
      });
      return res.data;
    },
    enabled: !!path(),
  }));
};

// 3. 搜索文件
export const useSearchFiles = (params: Accessor<SearchQuery>) => {
  return createQuery(() => ({
    queryKey: ["files-search", params()],
    queryFn: async () => {
      const res = await api.get<SearchResponse>("/files/search", {
        params: params(),
      });
      return res.data;
    },
    // 只有关键词存在且不为空时才搜索
    enabled: () => !!params().keyword && params().keyword.length > 0,
  }));
};
