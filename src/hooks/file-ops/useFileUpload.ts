// src/hooks/file-ops/useFileUpload.ts
import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../../lib/client";
import { delay,getErrorMessage } from "../../utils/file";

export const useFileUpload = (currentPath: Accessor<string>) => {
  return createMutation(() => ({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("dir", currentPath());
      formData.append("files", file);

      return api.post("/files/upload", formData, {
        params: { path: currentPath() },
        headers: {
          "Content-Type": undefined,
        },
      });
    },
    onSuccess: async () => {
      await delay(300);
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (err) => alert(getErrorMessage(err, "Upload failed")),
  }));
};
