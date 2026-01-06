// src/hooks/file-ops/useFileCopy.ts
import { createMutation } from "@tanstack/solid-query";

import { api, queryClient } from "../../lib/client";
import { CopyCommand, TaskResponse } from "../../types";
import { delay, getErrorMessage } from "../../utils/file";

export const useFileCopy = () => {
  return createMutation(() => ({
    mutationFn: async (payload: CopyCommand) => {
      // 1. Body: 仅发送文件名数组 ["a.txt", "b.txt"]
      const body = payload.file_names;

      // 2. Query: 发送 src_dir 和 dst_dir
      const queryParams = {
        src_dir: payload.src_dir,
        dst_dir: payload.dst_dir,
      };

      return api.post<TaskResponse>("/files/copy", body, {
        params: queryParams,
      });
    },
    onSuccess: async () => {
      await delay(150);
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (err) => alert(getErrorMessage(err, "Copy failed")),
  }));
};
