// src/types/common.ts

// 通用排序枚举
export enum SortBy {
  NAME = "name",
  SIZE = "size",
  TYPE = "type",
  MODIFIED = "modified",
  CREATED = "created",
  DELETED = "deleted", // 仅回收站
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

// 通用 API 错误结构
export interface ApiError {
  detail: string | { loc: (string | number)[]; msg: string; type: string }[];
}

// 通用异步任务响应 (如复制、移动、删除等耗时操作)
export interface TaskResponse {
  task_id: string;
  status: string;
  message?: string;
}
