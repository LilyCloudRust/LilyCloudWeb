// src/hooks/useFileOperations.ts
import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../lib/client";
import { clipboardStore } from "../store/clipboard";

// 辅助函数：标准化路径
const normalizePath = (p: string) => {
  if (p === "/") return p;
  return p.endsWith("/") ? p.slice(0, -1) : p;
};

// 辅助函数：拆分路径
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

// 辅助函数：延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFileOperations = (currentPath: Accessor<string>) => {
  const refreshFiles = async () => {
    await delay(150);
    return queryClient.invalidateQueries({
      queryKey: ["files"],
      refetchType: "all",
    });
  };

  // --- 1. 删除文件 ---
  const deleteMutation = createMutation(() => ({
    mutationFn: async (filename: string) => {
      const fullPath =
        currentPath() === "/" ? `/${filename}` : `${currentPath()}/${filename}`;
      const { dir, name } = splitPath(fullPath);
      return api.delete("/files", { params: { dir: dir }, data: [name] });
    },
    onSuccess: refreshFiles,
    onError: (err: any) =>
      alert(
        "Delete failed: " +
          (err.response?.data?.detail?.[0]?.msg || err.message),
      ),
  }));

  // --- 2. 上传文件 ---
  const uploadMutation = createMutation(() => ({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("dir", currentPath());
      formData.append("files", file);
      return api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: refreshFiles,
    onError: (err: any) =>
      alert(
        "Upload failed: " +
          (err.response?.data?.detail?.[0]?.msg || err.message),
      ),
  }));

  // --- 3. 新建文件夹 ---
  const createFolderMutation = createMutation(() => ({
    mutationFn: async (folderName: string) => {
      const fullPath =
        currentPath() === "/"
          ? `/${folderName}`
          : `${currentPath()}/${folderName}`;
      return api.post("/files/directory", null, { params: { path: fullPath } });
    },
    onSuccess: refreshFiles,
    onError: (err: any) =>
      alert(
        "Create folder failed: " +
          (err.response?.data?.detail?.[0]?.msg || err.message),
      ),
  }));

  // --- 4. 重命名 (通过 Vite Proxy + Bearer Token) ---
  const renameMutation = createMutation(() => ({
    mutationFn: async (payload: { oldName: string; newName: string }) => {
      const dir = currentPath();

      const srcPath =
        dir === "/" ? `/${payload.oldName}` : `${dir}/${payload.oldName}`;
      const dstPath =
        dir === "/" ? `/${payload.newName}` : `${dir}/${payload.newName}`;

      const encodeWebDavPath = (p: string) =>
        p.split("/").map(encodeURIComponent).join("/");

      // 🟢 恢复：使用相对路径，让请求经过 Vite 代理
      const webdavSrcUrl = `/webdav${encodeWebDavPath(srcPath)}`;

      // 🟢 恢复：Destination Header 也使用相对路径对应的完整 URL
      const webdavDstHeader = `${window.location.origin}/webdav${encodeWebDavPath(dstPath)}`;

      // 使用 api 实例，它会自动携带 Bearer Token
      // 覆盖 baseURL，确保请求从 /webdav 开始
      return api.request({
        method: "MOVE",
        url: webdavSrcUrl,
        baseURL: "/", // 请求将是 http://localhost:5173/webdav/...
        headers: {
          Destination: webdavDstHeader,
          Overwrite: "F",
        },
      });
    },
    onSuccess: refreshFiles,
    onError: (err: any) => {
      console.error("Rename failed:", err);
      if (err.response?.status === 401) {
        alert(
          "Rename failed: Authentication rejected. The proxy might still be stripping headers.",
        );
      } else {
        alert(`Rename failed: ${err.response?.data?.detail || err.message}`);
      }
    },
  }));

  // --- 5. 下载文件 ---
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
    } catch (e: any) {
      console.error(e);
      alert("Download failed");
    }
  };

  // --- 6. 粘贴 (复制/移动) ---
  const pasteMutation = createMutation(() => ({
    mutationFn: async () => {
      const data = clipboardStore.clipboard();
      if (!data) throw new Error("Clipboard is empty");

      const targetDir = normalizePath(currentPath());
      const sourceDir = normalizePath(data.sourceDir);
      const { files, mode } = data;

      if (sourceDir === targetDir) {
        throw new Error("Cannot paste into the same folder.");
      }

      const endpoint = mode === "copy" ? "/files/copy" : "/files/move";

      return api.post(endpoint, files, {
        params: { src_dir: sourceDir, dst_dir: targetDir },
      });
    },
    onSuccess: async () => {
      await refreshFiles();
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
        alert("Cannot copy/paste into the same folder.");
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
