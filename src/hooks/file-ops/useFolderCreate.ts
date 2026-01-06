import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api, queryClient } from "../../lib/client";
import { delay, getErrorMessage } from "../../utils/file";

export const useFolderCreate = (currentPath: Accessor<string>) => {
  return createMutation(() => ({
    mutationFn: async (folderName: string) => {
      const fullPath =
        currentPath() === "/"
          ? `/${folderName}`
          : `${currentPath()}/${folderName}`;

      return api.post("/files/directory", null, {
        params: { path: fullPath, parents: false },
      });
    },
    onSuccess: async () => {
      await delay(300);
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (err) => alert(getErrorMessage(err, "Create folder failed")),
  }));
};
