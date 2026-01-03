import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../lib/client";
import { clipboardStore } from "../store/clipboard";

const normalizePath = (p: string) => {
  if (p === "/") return p;
  return p.endsWith("/") ? p.slice(0, -1) : p;
};

const splitPath = (fullPath: string) => {
  const cleanPath = fullPath.startsWith("//")
    ? fullPath.substring(1)
    : fullPath;
  const lastSlashIndex = cleanPath.lastIndexOf("/");
  if (lastSlashIndex === -1) return { dir: "/", name: cleanPath };
  if (lastSlashIndex === 0) return { dir: "/", name: cleanPath.substring(1) };
  return {
    dir: cleanPath.substring(0, lastSlashIndex),
    name: cleanPath.substring(lastSlashIndex + 1),
  };
};

// ⏳ 辅助函数：延迟等待
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFileOperations = (currentPath: Accessor<string>) => {
  // 🔄 核心修复：强力刷新函数
  const refreshFiles = async () => {
    // 1. 延迟 150ms，等待后端文件系统索引更新（解决粘贴后不显示的问题）
    await delay(150);

    // 2. 强制作废缓存，触发重新请求
    // queryKey: ['files'] 会匹配所有以 ['files'] 开头的查询（包括当前的路径）
    return queryClient.invalidateQueries({
      queryKey: ["files"],
      refetchType: "all", // 强制刷新所有状态（包括 active/inactive）
    });
  };

  // 1. 删除文件
  const deleteMutation = createMutation(() => ({
    mutationFn: async (filename: string) => {
      const fullPath =
        currentPath() === "/" ? `/${filename}` : `${currentPath()}/${filename}`;
      const { dir, name } = splitPath(fullPath);
      return api.delete("/files", { params: { dir: dir }, data: [name] });
    },
    onSuccess: refreshFiles, // 使用新的刷新逻辑
    onError: (err: any) =>
      alert(
        "Delete failed: " +
          (err.response?.data?.detail?.[0]?.msg || err.message),
      ),
  }));

  // 2. 上传文件
  const uploadMutation = createMutation(() => ({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("dir", currentPath());
      formData.append("files", file);
      return api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: refreshFiles, // 使用新的刷新逻辑
    onError: (err: any) =>
      alert(
        "Upload failed: " +
          (err.response?.data?.detail?.[0]?.msg || err.message),
      ),
  }));

  // 3. 新建文件夹
  const createFolderMutation = createMutation(() => ({
    mutationFn: async (folderName: string) => {
      const fullPath =
        currentPath() === "/"
          ? `/${folderName}`
          : `${currentPath()}/${folderName}`;
      return api.post("/files/directory", null, { params: { path: fullPath } });
    },
    onSuccess: refreshFiles, // 使用新的刷新逻辑
    onError: (err: any) =>
      alert(
        "Create folder failed: " +
          (err.response?.data?.detail?.[0]?.msg || err.message),
      ),
  }));

  // 4. 重命名 (暂不支持)
  const renameMutation = createMutation(() => ({
    mutationFn: async () => {
      alert("Rename is not supported by the current API.");
      throw new Error("Rename not supported");
    },
  }));

  // 5. 下载文件
  const downloadFile = async (filename: string) => {
    try {
      const fullPath =
        currentPath() === "/" ? `/${filename}` : `${currentPath()}/${filename}`;
      const response = await api.get("/files", {
        params: { path: fullPath },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Download failed");
    }
  };

  // 6. 粘贴 (复制/移动)
  const pasteMutation = createMutation(() => ({
    mutationFn: async () => {
      const data = clipboardStore.clipboard();
      if (!data) throw new Error("Clipboard is empty");

      const targetDir = normalizePath(currentPath());
      const sourceDir = normalizePath(data.sourceDir);
      const { files, mode } = data;

      if (sourceDir === targetDir) {
        throw new Error(
          "Cannot paste into the same folder. API does not support duplication/renaming.",
        );
      }

      const endpoint = mode === "copy" ? "/files/copy" : "/files/move";

      return api.post(endpoint, files, {
        params: { src_dir: sourceDir, dst_dir: targetDir },
      });
    },
    onSuccess: async () => {
      // 1. 先刷新列表 (带延迟)
      await refreshFiles();

      // 2. 如果是剪切，操作成功后清空剪贴板
      // 这样 UI 上的“半透明”效果就会消失
      if (clipboardStore.clipboard()?.mode === "move") {
        clipboardStore.clear();
      }
    },
    onError: (err: any) => {
      if (
        err.response?.status === 409 ||
        err.message?.includes("already exists")
      ) {
        alert(`Paste Failed: Some files already exist in destination.`);
      } else if (err.message?.includes("same folder")) {
        alert(
          "Cannot copy/paste into the same folder (Duplicates not supported by backend).",
        );
      } else {
        alert(
          `Paste failed: ${err.response?.data?.detail?.[0]?.msg || err.message}`,
        );
      }
    },
  }));

  return {
    deleteFile: deleteMutation.mutate,
    uploadFile: uploadMutation.mutate,
    createFolder: createFolderMutation.mutate,
    renameFile: renameMutation.mutate,
    downloadFile,
    isUploading: uploadMutation.isPending,
    pasteFiles: pasteMutation.mutate,
    isPasting: pasteMutation.isPending,
  };
};
