// src/components/file-browser/FileIcon.tsx
import {
  File as DefaultFile,
  Folder,
  Image as ImageIcon,
  Music,
  Video,
} from "lucide-solid";
import { Component } from "solid-js";

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
  return <DefaultFile class={`text-gray-400 ${className}`} size={iconSize} />;
};
