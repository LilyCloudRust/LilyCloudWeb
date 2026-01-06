// src/types/files.ts
import { SortBy, SortOrder } from "./common";
import { FileItem, FileType,TrashItem } from "./models";

// --- Query Parameters (GET 请求参数) ---

export interface ListQuery {
  path: string;
  sort_by?: SortBy;
  sort_order?: SortOrder;
  dir_first?: boolean;
}

export interface SearchQuery {
  keyword: string;
  path: string;
  recursive?: boolean;
  type?: FileType | null;
  mime_type?: string | null;
  sort_by?: SortBy;
  sort_order?: SortOrder;
  dir_first?: boolean;
}

export interface TrashListQuery {
  keyword?: string | null;
  user_id?: number | null;
  type?: FileType | null;
  mime_type?: string | null;
  sort_by?: SortBy;
  sort_order?: SortOrder;
  dir_first?: boolean;
}

// --- Commands / Payloads (POST/DELETE 请求体) ---

export interface MkdirCommand {
  path: string;
  parents?: boolean;
}

export interface CopyCommand {
  src_dir: string;
  dst_dir: string;
  file_names: string[];
}

export interface MoveCommand {
  src_dir: string;
  dst_dir: string;
  file_names: string[];
}

export interface TrashCommand {
  dir: string;
  file_names: string[];
}

export interface RestoreCommand {
  dir: string;
  file_names: string[];
}

export interface DeleteCommand {
  empty?: boolean;
  trash_ids?: number[];
  dir?: string | null;
  file_names?: string[];
}

// --- Responses (特定接口响应) ---

export interface FileListResponse {
  path: string;
  total: number;
  items: FileItem[];
}

export interface SearchResponse {
  path: string;
  total: number;
  items: FileItem[];
}

export interface TrashListResponse {
  total: number;
  items: TrashItem[];
}

export interface TrashResponse extends TrashItem {}
