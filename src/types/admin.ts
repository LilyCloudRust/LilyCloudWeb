import { SortOrder } from "./common"; // 假设

export interface AdminUser {
  user_id: number;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface AdminStorage {
  storage_id: number;
  mount_path: string;
  type: "local" | "s3";
  enabled: boolean;
  config: any;
  created_at: string;
}

export interface UserListResponse {
  total: number;
  items: AdminUser[];
}

// 存储类型枚举
export type StorageType = "local" | "s3";

// 基础响应对象
export interface StorageResponse {
  storage_id: number;
  mount_path: string;
  type: StorageType;
  enabled: boolean;
  config: any; // 具体配置根据 type 变化
  created_at: string;
}

// 列表响应
export interface StorageListResponse {
  total: number;
  items: StorageResponse[];
}

// 创建请求体
export interface StorageCreate {
  mount_path: string;
  type: StorageType;
  enabled?: boolean;
  config: any;
}

// 更新请求体
export interface StorageUpdate {
  mount_path?: string;
  type?: StorageType;
  enabled?: boolean;
  config?: any;
}

// 列表查询参数
export interface StorageListQuery {
  keyword?: string;
  type?: StorageType | null;
  sort_by?: string;
  sort_order?: SortOrder;
  enabled_first?: boolean;
  page?: number;
  page_size?: number;
}
