import { Camera, Trash2 } from "lucide-solid";
import { Component, For } from "solid-js";
import { clipboardStore } from "../../store/clipboard";
import { FileItem } from "../../types/api";
import { FileIcon } from "./FileIcon";
interface Props {
  files: FileItem[];
  onNavigate: (name: string) => void;
  onDelete: (name: string) => void;
  onUploadClick: () => void;
  onContextMenu: (e: MouseEvent, file: FileItem) => void;
}

export const FileGridView: Component<Props> = (props) => {
  const isCut = (fileName: string) => {
    const clip = clipboardStore.clipboard();
    return clip?.mode === "move" && clip.files.includes(fileName);
  };

  return (
    <div class="w-full pb-20">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <For each={props.files}>
          {(file) => (
            <div
              class={`group relative flex flex-col items-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer h-48 ${
                // 3. 动态添加样式：如果是剪切状态，透明度降低
                isCut(file.name)
                  ? "opacity-40 grayscale border-dashed border-gray-300"
                  : ""
              }`}
              onClick={() =>
                file.type === "directory" && props.onNavigate(file.name)
              }
              onContextMenu={(e) => props.onContextMenu(e, file)}
            >
              <div class="flex-1 w-full flex items-center justify-center min-h-[80px]">
                <FileIcon
                  type={file.type}
                  mimeType={file.mime_type}
                  size={64}
                />
              </div>

              <div class="mt-4 w-full text-center">
                <p class="text-sm font-medium text-gray-700 truncate px-2 group-hover:text-blue-700">
                  {file.name}
                </p>
                {/* 🔴 修复这里：明确判断 type 是否为 directory */}
                <p class="text-xs text-gray-400 mt-1">
                  {file.type === "directory"
                    ? "Folder"
                    : file.size
                      ? (file.size / 1024).toFixed(1) + " KB"
                      : "0 KB"}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  props.onDelete(file.name);
                }}
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-white text-red-500 rounded shadow hover:bg-red-50 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </For>

        <div
          onClick={props.onUploadClick}
          class="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-colors text-gray-400 hover:text-blue-600 gap-3"
        >
          <Camera size={40} />
          <span class="text-sm font-bold uppercase tracking-wide">
            Upload File
          </span>
        </div>
      </div>
    </div>
  );
};
