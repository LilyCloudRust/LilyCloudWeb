// src/components/file-browser/FileListView.tsx
import { Trash2 } from "lucide-solid";
import { Component, For } from "solid-js";

import { FileItem } from "../../types/api";
import { FileIcon } from "./FileIcon";

interface Props {
  files: FileItem[];
  onNavigate: (name: string) => void;
  onDelete: (name: string) => void;
}

export const FileListView: Component<Props> = (props) => {
  return (
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 w-8"></th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3 w-32">Date Modified</th>
            <th class="px-4 py-3 w-24">Size</th>
            <th class="px-4 py-3 w-16"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <For each={props.files}>
            {(file) => (
              <tr
                class="hover:bg-blue-50/60 group cursor-pointer transition-colors"
                onClick={() =>
                  file.type === "directory" && props.onNavigate(file.name)
                }
              >
                <td class="px-4 py-2">
                  <FileIcon
                    type={file.type}
                    mimeType={file.mime_type}
                    size={18}
                  />
                </td>
                <td class="px-4 py-2 font-medium text-gray-700 group-hover:text-blue-700">
                  {file.name}
                </td>
                <td class="px-4 py-2 text-gray-400 text-xs">
                  {new Date(file.modified_at).toLocaleDateString()}
                </td>
                <td class="px-4 py-2 text-gray-400 text-xs">
                  {file.size ? (file.size / 1024).toFixed(1) + " KB" : "--"}
                </td>
                <td class="px-4 py-2 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onDelete(file.name);
                    }}
                    class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};
