// src/hooks/file-ops/useFileMove.ts
import { createMutation } from "@tanstack/solid-query";

import { api, queryClient } from "../../lib/client";
import { MoveCommand, TaskResponse } from "../../types";
import { delay,getErrorMessage } from "../../utils/file";

export const useFileMove = () => {
  return createMutation(() => ({
    mutationFn: async (payload: MoveCommand) => {
      // 1. Body: 仅发送文件名数组
      const body = payload.file_names;

      // 2. Query: 发送 src_dir 和 dst_dir
      const queryParams = {
        src_dir: payload.src_dir,
        dst_dir: payload.dst_dir,
      };

      return api.post<TaskResponse>("/files/move", body, {
        params: queryParams,
      });
    },
    onSuccess: async () => {
      await delay(150);
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (err) => alert(getErrorMessage(err, "Move failed")),
  }));
};
