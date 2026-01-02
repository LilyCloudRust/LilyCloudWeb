// src/components/file-browser/FileIcon.tsx
import { Component } from "solid-js";
import {
  Folder,
  // 1. 修改这里：把导入的图标重命名为 DefaultFile，避免和组件名冲突
  File as DefaultFile,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
} from "lucide-solid";

interface Props {
  type: "file" | "directory";
  mimeType: string | null;
  size?: number;
  class?: string;
}

export const FileIcon: Component<Props> = (props) => {
  const iconSize = props.size || 40;
  const className = props.class || "";

  if (props.type === "directory") {
    return (
      <Folder
        class={`text-blue-500 ${className}`}
        size={iconSize}
        fill="currentColor"
      />
    );
  }

  const mime = props.mimeType || "";
  if (mime.startsWith("image"))
    return <ImageIcon class={`text-purple-500 ${className}`} size={iconSize} />;
  if (mime.startsWith("video"))
    return <Video class={`text-red-500 ${className}`} size={iconSize} />;
  if (mime.startsWith("audio"))
    return <Music class={`text-green-500 ${className}`} size={iconSize} />;

  // 2. 修改这里：使用重命名后的 DefaultFile
  return <DefaultFile class={`text-gray-400 ${className}`} size={iconSize} />;
};
