// src/hooks/file-ops/useFileTrash.ts
import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../../lib/client";
import { TaskResponse, TrashCommand } from "../../types";
import { delay, getErrorMessage, splitPath } from "../../utils/file";

export const useFileTrash = (currentPath: Accessor<string>) => {
  return createMutation(() => ({
    mutationFn: async (filename: string) => {
      const fullPath =
        currentPath() === "/" ? `/${filename}` : `${currentPath()}/${filename}`;

      const { dir, name } = splitPath(fullPath);

      // 构造 TrashCommand
      const payload: TrashCommand = {
        dir: dir,
        file_names: [name],
      };

      // 调用 POST /api/files/trash
      return api.post<TaskResponse>("/files/trash", payload);
    },
    onSuccess: async () => {
      await delay(150);
      queryClient.invalidateQueries({ queryKey: ["files"] });
      // 也可以顺便刷新回收站计数，如果有的话
      queryClient.invalidateQueries({ queryKey: ["trash-list"] });
    },
    onError: (err) => alert(getErrorMessage(err, "Move to trash failed")),
  }));
};
