// src/components/ContextMenu.tsx
import {
  Clipboard,
  Copy,
  Download,
  Edit2,
  FolderPlus,
  Scissors,
  Trash2,
} from "lucide-solid";
import { Component, onCleanup, onMount,Show } from "solid-js";

import { clipboardStore } from "../store/clipboard";

interface Props {
  x: number;
  y: number;
  // 如果 target 为 null，说明点击的是空白处（背景）
  target: { name: string; type: "file" | "directory" } | null;
  onClose: () => void;

  // 文件操作 Actions
  onDownload?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onCut?: () => void;

  // 背景操作 Actions
  onPaste?: () => void;
  onNewFolder?: () => void;
}

export const ContextMenu: Component<Props> = (props) => {
  let menuRef: HTMLDivElement | undefined;

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef && !menuRef.contains(e.target as Node)) {
      props.onClose();
    }
  };

  onMount(() => document.addEventListener("click", handleClickOutside));
  onCleanup(() => document.removeEventListener("click", handleClickOutside));

  const MenuItem = (p: {
    icon: any;
    label: string;
    onClick?: () => void;
    color?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={() => {
        if (!p.disabled) {
          p.onClick?.();
          props.onClose();
        }
      }}
      disabled={p.disabled}
      class={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${
        p.disabled
          ? "text-gray-300 cursor-not-allowed"
          : `hover:bg-blue-50 text-gray-700 hover:text-blue-600 ${p.color || ""}`
      }`}
    >
      <p.icon size={16} /> {p.label}
    </button>
  );

  return (
    <div
      ref={menuRef}
      class="fixed bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 w-48 py-1 z-50 text-sm font-medium animate-in fade-in zoom-in-95 duration-100"
      style={{ top: `${props.y}px`, left: `${props.x}px` }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Show
        when={props.target}
        fallback={
          // --- 背景菜单 (点击空白处) ---
          <>
            <div class="px-3 py-2 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
              Current Folder
            </div>
            <MenuItem
              icon={FolderPlus}
              label="New Folder"
              onClick={props.onNewFolder}
            />
            <div class="h-px bg-gray-100 my-1"></div>
            <MenuItem
              icon={Clipboard}
              label={`Paste ${clipboardStore.clipboard() ? `(${clipboardStore.clipboard()?.mode})` : ""}`}
              onClick={props.onPaste}
              disabled={!clipboardStore.clipboard()} // 没复制东西时禁用
            />
          </>
        }
      >
        {/* --- 文件菜单 (点击文件) --- */}
        <div class="px-3 py-2 border-b border-gray-100 text-xs text-gray-500 truncate font-semibold">
          {props.target?.name}
        </div>

        <Show when={props.target?.type !== "directory"}>
          <MenuItem
            icon={Download}
            label="Download"
            onClick={props.onDownload}
          />
        </Show>
        <MenuItem icon={Edit2} label="Rename" onClick={props.onRename} />

        <div class="h-px bg-gray-100 my-1"></div>

        <MenuItem icon={Copy} label="Copy" onClick={props.onCopy} />
        <MenuItem icon={Scissors} label="Cut" onClick={props.onCut} />

        <div class="h-px bg-gray-100 my-1"></div>

        <MenuItem
          icon={Trash2}
          label="Delete"
          onClick={props.onDelete}
          color="text-red-600 hover:text-red-700 hover:bg-red-50"
        />
      </Show>
    </div>
  );
};
