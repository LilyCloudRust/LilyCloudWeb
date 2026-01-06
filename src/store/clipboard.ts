// src/store/clipboard.ts
import { createRoot, createSignal } from "solid-js";

export interface ClipboardItem {
  files: string[]; // 文件名列表
  sourceDir: string; // 源文件夹路径
  mode: "copy" | "move"; // 复制还是移动(剪切)
}

function createClipboardStore() {
  const [clipboard, setClipboard] = createSignal<ClipboardItem | null>(null);

  const copy = (files: string[], sourceDir: string) => {
    setClipboard({ files, sourceDir, mode: "copy" });
    console.log("Copied:", files);
  };

  const cut = (files: string[], sourceDir: string) => {
    setClipboard({ files, sourceDir, mode: "move" });
    console.log("Cut:", files);
  };

  const clear = () => setClipboard(null);

  return { clipboard, copy, cut, clear };
}

export const clipboardStore = createRoot(createClipboardStore);
