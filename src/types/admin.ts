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

export interface StorageListResponse {
  total: number;
  items: AdminStorage[];
}
