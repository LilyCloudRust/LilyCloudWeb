// src/components/file-browser/FileGridView.tsx
import { Camera, Trash2 } from "lucide-solid";
import { Component, For } from "solid-js";

import { FileItem } from "../../types/api";
import { FileIcon } from "./FileIcon";

interface Props {
  files: FileItem[];
  onNavigate: (name: string) => void;
  onDelete: (name: string) => void;
  onUploadClick: () => void;
}

export const FileGridView: Component<Props> = (props) => {
  return (
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      <For each={props.files}>
        {(file) => (
          <div
            class="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors relative"
            onClick={() =>
              file.type === "directory" && props.onNavigate(file.name)
            }
          >
            <div class="transform group-hover:scale-105 transition-transform duration-200 filter drop-shadow-sm">
              <FileIcon type={file.type} mimeType={file.mime_type} />
            </div>

            <span class="text-xs text-center font-medium text-gray-700 line-clamp-2 w-full break-words px-1 rounded group-hover:text-blue-700">
              {file.name}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onDelete(file.name);
              }}
              class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-white rounded-full shadow border border-gray-200 text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </For>

      {/* Upload Button Card */}
      <div
        onClick={props.onUploadClick}
        class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all text-gray-400 hover:text-blue-500"
      >
        <Camera size={32} />
        <span class="text-xs font-medium">Upload</span>
      </div>
    </div>
  );
};
