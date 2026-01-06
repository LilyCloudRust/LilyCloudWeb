import { Accessor } from "solid-js";

import { useBatchDownload } from "./file-ops/useBatchDownload"; // 引入
import { useFileDelete } from "./file-ops/useFileDelete";
import { useFileDownload } from "./file-ops/useFileDownload";
import { useFilePaste } from "./file-ops/useFilePaste";
import { useFileTrash } from "./file-ops/useFileTrash";
import { useFileUpload } from "./file-ops/useFileUpload";
import { useFolderCreate } from "./file-ops/useFolderCreate";
/**
 * 统一文件操作 Hook (Facade Pattern)
 * 聚合所有原子操作，对外提供统一接口
 */
export const useFileOperations = (currentPath: Accessor<string>) => {
  // 1. 初始化所有子 Hooks
  const deleteMutation = useFileDelete(currentPath);
  const uploadMutation = useFileUpload(currentPath);
  const createFolderMutation = useFolderCreate(currentPath);
  const trashMutation = useFileTrash(currentPath);
  const pasteMutation = useFilePaste(currentPath);
  const batchDownloadMutation = useBatchDownload(currentPath); // 初始化
  const { downloadFile } = useFileDownload(currentPath);

  // 2. 暴露统一 API
  return {
    // Actions (Mutation Triggers)
    batchDownload: batchDownloadMutation.mutate, // 导出方法
    deleteFile: deleteMutation.mutate,
    uploadFile: uploadMutation.mutate,
    createFolder: createFolderMutation.mutate,
    trashFile: trashMutation.mutate,
    pasteFiles: pasteMutation.mutate,
    downloadFile: downloadFile,

    // Status Indicators
    isUploading: uploadMutation.isPending,
    isPasting: pasteMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCreatingFolder: createFolderMutation.isPending,
    isTrashing: trashMutation.isPending,
    // 👇👇👇 补上这一行 👇👇👇
    isBatchDownloading: batchDownloadMutation.isPending,
  };
};
