// src/hooks/file-ops/useFilePaste.ts
import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../../lib/client";
import { clipboardStore } from "../../store/clipboard";
import { TaskResponse } from "../../types";
import { delay, getErrorMessage, normalizePath } from "../../utils/file";

export const useFilePaste = (currentPath: Accessor<string>) => {
  return createMutation(() => ({
    mutationFn: async () => {
      const data = clipboardStore.clipboard();
      if (!data) throw new Error("Clipboard is empty");

      const targetDir = normalizePath(currentPath());
      const sourceDir = normalizePath(data.sourceDir);
      const { files, mode } = data;

      if (sourceDir === targetDir) {
        throw new Error("Cannot paste into the same folder.");
      }

      // 1. 准备 Query 参数
      const queryParams = {
        src_dir: sourceDir,
        dst_dir: targetDir,
      };

      // 2. 准备 Body (纯数组)
      const body = files; // string[]

      const endpoint = mode === "copy" ? "/files/copy" : "/files/move";

      // 3. 发送请求
      return api.post<TaskResponse>(endpoint, body, {
        params: queryParams,
      });
    },

    onSuccess: async () => {
      // 增加等待时间让后端任务处理
      await delay(500);
      queryClient.invalidateQueries({ queryKey: ["files"] });

      if (clipboardStore.clipboard()?.mode === "move") {
        clipboardStore.clear();
      }
    },

    onError: (err: any) => {
      if (err.message?.includes("same folder")) {
        alert("Cannot copy/paste into the same folder.");
      } else if (err.response?.status === 409) {
        alert("Paste Failed: Files already exist.");
      } else {
        alert(getErrorMessage(err, "Paste failed"));
      }
    },
  }));
};
