// src/utils/file.ts

/**
 * 标准化路径：去除末尾的斜杠（根路径除外）
 */
export const normalizePath = (p: string): string => {
  if (p === "/") return p;
  return p.endsWith("/") ? p.slice(0, -1) : p;
};

/**
 * 拆分路径为目录和文件名
 * @example "/foo/bar.txt" -> { dir: "/foo", name: "bar.txt" }
 */
export const splitPath = (fullPath: string): { dir: string; name: string } => {
  const cleanPath = fullPath.startsWith("//")
    ? fullPath.substring(1)
    : fullPath;
  const lastSlashIndex = cleanPath.lastIndexOf("/");

  if (lastSlashIndex === -1) return { dir: "/", name: cleanPath };
  if (lastSlashIndex === 0) return { dir: "/", name: cleanPath.substring(1) };

  return {
    dir: cleanPath.substring(0, lastSlashIndex),
    name: cleanPath.substring(lastSlashIndex + 1),
  };
};

/**
 * 延迟函数 (用于等待文件系统 I/O 完成)
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 统一错误信息提取
 */
export const getErrorMessage = (err: any, context: string): string => {
  // 1. 尝试提取 FastAPI/Pydantic 的详细错误 (ValidationError)
  const detail = err.response?.data?.detail;

  if (Array.isArray(detail) && detail[0]?.msg) {
    return `${context}: ${detail[0].msg}`;
  }

  // 2. 尝试提取普通 HTTP 错误消息 string
  if (typeof detail === "string") {
    return `${context}: ${detail}`;
  }

  // 3. 兜底
  return `${context}: ${err.message || "Unknown error"}`;
};

/**
 * WebDAV 路径编码
 */
export const encodeWebDavPath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

/**
 * 自定义 Axios 参数序列化
 * 解决 Axios 默认将数组序列化为 key[] 的问题，FastAPI (Python) 需要 key=val1&key=val2
 */
export const paramsSerializer = (params: any) => {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      // 数组：多次 append 同一个 key，不带 []
      // 结果：file_names=a.txt&file_names=b.txt
      value.forEach((v) => searchParams.append(key, v));
    } else {
      // 普通值
      searchParams.append(key, value);
    }
  }
  return searchParams.toString();
};
