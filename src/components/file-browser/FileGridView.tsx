// src/components/file-browser/FileGridView.tsx
import { Camera, CheckCircle,Trash2 } from "lucide-solid"; // 1. 引入 CheckCircle
import { Component, For } from "solid-js";

import { clipboardStore } from "../../store/clipboard";
import { FileItem } from "../../types";
import { FileIcon } from "./FileIcon";

interface Props {
  files: FileItem[];
  onNavigate: (name: string) => void;
  onDelete: (name: string) => void;
  onUploadClick: () => void;
  onContextMenu: (e: MouseEvent, file: FileItem) => void;

  // 2. 新增多选相关的 Props
  selectedFiles: Set<string>;
  onToggleSelect: (name: string) => void;
}

export const FileGridView: Component<Props> = (props) => {
  // 判断文件是否处于“剪切”状态
  const isCut = (fileName: string) => {
    const clip = clipboardStore.clipboard();
    return clip?.mode === "move" && clip.files.includes(fileName);
  };

  return (
    <div class="w-full pb-20">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <For each={props.files}>
          {(file) => {
            // 判断当前文件是否被选中
            const isSelected = () => props.selectedFiles.has(file.name);

            return (
              <div
                class={`group relative flex flex-col items-center p-4 rounded-xl transition-all cursor-pointer h-48 border-2
                  ${
                    // 3. 动态样式：优先级处理 (选中 > 剪切 > 默认)
                    isSelected()
                      ? "bg-blue-50 border-blue-500 shadow-sm" // 选中样式
                      : isCut(file.name)
                        ? "opacity-40 grayscale border-dashed border-gray-300 bg-white" // 剪切样式
                        : "bg-white border-gray-200 hover:shadow-md hover:border-blue-400 hover:bg-blue-50" // 默认样式
                  }
                `}
                onClick={(e) => {
                  // 4. 点击逻辑：如果是多选模式，点击卡片切换选中；否则点击文件夹进入
                  if (props.selectedFiles.size > 0) {
                    props.onToggleSelect(file.name);
                  } else if (file.type === "directory") {
                    props.onNavigate(file.name);
                  }
                }}
                onContextMenu={(e) => props.onContextMenu(e, file)}
              >
                {/* 5. 左上角复选框 (Check Circle) */}
                <div
                  class={`absolute top-2 left-2 z-10 p-1 rounded-full transition-all
                    ${
                      isSelected()
                        ? "opacity-100 text-blue-600"
                        : "opacity-0 group-hover:opacity-100 text-gray-300 hover:text-blue-400"
                    }
                  `}
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止冒泡，防止触发进入文件夹
                    props.onToggleSelect(file.name);
                  }}
                >
                  <CheckCircle
                    size={22}
                    fill={isSelected() ? "currentColor" : "none"}
                  />
                </div>

                {/* 图标区域 */}
                <div class="flex-1 w-full flex items-center justify-center min-h-[80px]">
                  <div
                    class={`transform transition-transform duration-200 ${
                      isSelected() ? "scale-90" : "group-hover:scale-105"
                    }`}
                  >
                    <FileIcon
                      type={file.type}
                      mimeType={file.mime_type}
                      size={64}
                    />
                  </div>
                </div>

                {/* 文本信息 */}
                <div class="mt-4 w-full text-center">
                  <p class="text-sm font-medium text-gray-700 truncate px-2 group-hover:text-blue-700">
                    {file.name}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {file.type === "directory"
                      ? "Folder"
                      : file.size
                        ? (file.size / 1024).toFixed(1) + " KB"
                        : "0 KB"}
                  </p>
                </div>

                {/* 删除/Trash 按钮 (保留原来的位置) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onDelete(file.name);
                  }}
                  class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-white text-red-500 rounded shadow hover:bg-red-50 transition-all z-10"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          }}
        </For>

        {/* 上传按钮卡片 (保持原样) */}
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
