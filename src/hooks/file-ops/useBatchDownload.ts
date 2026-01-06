// src/hooks/file-ops/useBatchDownload.ts
import { createMutation } from "@tanstack/solid-query";
import { Accessor } from "solid-js";

import { api } from "../../lib/client";
import { TaskResponse } from "../../types";
import { getErrorMessage } from "../../utils/file";

export const useBatchDownload = (currentPath: Accessor<string>) => {
  return createMutation(() => ({
    mutationFn: async (fileNames: string[]) => {
      // 1. 创建打包任务
      // 需要依赖注入 path，所以 params 加上 path
      const res = await api.post<TaskResponse>(
        "/files/download",
        {
          dir: currentPath(),
          file_names: fileNames,
        },
        {
          params: { path: currentPath() },
        },
      );

      return res.data;
    },
    onSuccess: async (data) => {
      // 2. 任务创建成功，拿到 task_id，开始下载 zip 流
      const taskId = data.task_id; // 后端 TaskResponse 包含 task_id

      // 直接触发浏览器下载
      // 注意：这里需要带上 query param 'path' 给依赖注入
      const downloadUrl = `/api/files/archive/${taskId}?path=${encodeURIComponent(currentPath())}&name=download`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      await downloadZipBlob(taskId);
    },
    onError: (err) => alert(getErrorMessage(err, "Batch download failed")),
  }));

  // 辅助：下载 Zip Blob
  const downloadZipBlob = async (taskId: string) => {
    try {
      const response = await api.get(`/files/archive/${taskId}`, {
        params: {
          path: currentPath(),
          name: "archive",
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "archive.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Zip download failed");
    }
  };
};
