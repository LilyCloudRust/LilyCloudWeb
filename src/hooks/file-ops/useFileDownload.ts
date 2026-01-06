// src/hooks/file-ops/useFileDownload.ts
import { Accessor } from "solid-js";

import { api } from "../../lib/client";

export const useFileDownload = (currentPath: Accessor<string>) => {
  const downloadFile = async (filename: string) => {
    try {
      // 拼接完整路径
      const fullPath =
        currentPath() === "/" ? `/${filename}` : `${currentPath()}/${filename}`;

      // 后端路由是 @router.get("") prefix="/api/files"
      // 所以 URL 是 /files (配合 baseURL /api)
      const response = await api.get("/files", {
        params: { path: fullPath }, // 依赖注入也需要 path，且查询也需要 path
        responseType: "blob", // 必须设置为 blob 以处理二进制流
      });

      // 处理下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // 设置下载文件名
      document.body.appendChild(link);
      link.click();

      // 清理
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Download failed");
    }
  };

  return { downloadFile };
};
