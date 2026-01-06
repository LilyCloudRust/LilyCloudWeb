import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../../lib/client";
import { DeleteCommand, TaskResponse } from "../../types";
import { delay,getErrorMessage, splitPath } from "../../utils/file";

export const useFileDelete = (currentPath: Accessor<string>) => {
  return createMutation(() => ({
    mutationFn: async (filename: string) => {
      const fullPath =
        currentPath() === "/" ? `/${filename}` : `${currentPath()}/${filename}`;

      const { dir, name } = splitPath(fullPath);

      const payload: DeleteCommand = {
        dir: dir,
        file_names: [name],
      };

      return api.delete<TaskResponse>("/files", { data: payload });
    },
    onSuccess: async () => {
      await delay(150);
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (err) => alert(getErrorMessage(err, "Delete failed")),
  }));
};
