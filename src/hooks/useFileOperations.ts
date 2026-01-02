// src/hooks/useFileOperations.ts
import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../lib/client";

export const useFileOperations = (currentPath: Accessor<string>) => {
  const deleteMutation = createMutation(() => ({
    mutationFn: async (filename: string) => {
      const fullPath =
        currentPath() === "/" ? `/${filename}` : `${currentPath()}/${filename}`;
      return api.delete("/files/delete", { params: { path: fullPath } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
    onError: (err) => alert("Delete failed"),
  }));

  const uploadMutation = createMutation(() => ({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("dir", currentPath());

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
