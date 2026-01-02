// src/hooks/useFileOperations.ts
import { createMutation } from "@tanstack/solid-query";
import { api, queryClient } from "../lib/client";
import { Accessor } from "solid-js";

export const useFileOperations = (currentPath: Accessor<string>) => {
  // 删除逻辑
  const deleteMutation = createMutation(() => ({
    mutationFn: async (filename: string) => {
      const fullPath =
        currentPath() === "/" ? `/${filename}` : `${currentPath()}/${filename}`;
      return api.delete("/files/delete", { params: { path: fullPath } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
    onError: (err) => alert("Delete failed"),
  }));

  // 上传逻辑 (已修复参数问题)
  const uploadMutation = createMutation(() => ({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("files", file); // 注意复数 files
      formData.append("dir", currentPath()); // 注意 dir

      return api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
    onError: (err) => alert("Upload failed"),
  }));

  return {
    deleteFile: deleteMutation.mutate,
    uploadFile: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
  };
};
