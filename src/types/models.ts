// src/types/models.ts

// 文件类型枚举
export enum FileType {
  FILE = "file",
  DIRECTORY = "directory",
}

// 核心用户模型
export interface User {
  user_id: number;
  username: string;
  created_at: string;
  updated_at: string;
}

// 核心文件模型
export interface FileItem {
  name: string;
  path: string;
  type: FileType;
  size: number;
  mime_type: string | null;
  created_at: string;
  modified_at: string;
  accessed_at: string;
}

// 回收站条目模型
export interface TrashItem {
  trash_id: number;
  user_id: number;
  entry_name: string;
  original_path: string;
  type: string;
  size: number;
  mime_type: string | null;
  created_at: string;
  modified_at: string;
  accessed_at: string;
  deleted_at: string;
}

// 管理员存储配置模型
export interface StorageConfig {
  storage_id: number;
  mount_path: string;
  type: "local" | "s3";
  enabled: boolean;
  config: any; // 具体配置根据 type 动态变化
  created_at: string;
}
