// src/types/api.ts

export interface User {
  user_id: number;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size: number;
  mime_type: string | null;
  created_at: string;
  modified_at: string;
  accessed_at: string;
}

export interface FileListResponse {
  path: string;
  total: number;
  items: FileItem[];
}

export interface ApiError {
  detail: string | { loc: (string | number)[]; msg: string; type: string }[];
}
