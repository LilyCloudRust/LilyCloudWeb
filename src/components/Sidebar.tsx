import type { JSX } from "solid-js";

export default function Sidebar(): JSX.Element {
  return (
    <aside class="h-full bg-(--color-background) border-r border-(--color-border) p-4 flex flex-col">
      <nav class="flex flex-col gap-2">
        <a
          href="#"
          class="text-(--color-text-secondary) hover:bg-(--color-hover) hover:text-(--color-text-primary) rounded px-2 py-1"
        >
          Files
        </a>
        <a
          href="#"
          class="text-(--color-text-secondary) hover:bg-(--color-hover) hover:text-(--color-text-primary) rounded px-2 py-1"
        >
          Settings
        </a>
      </nav>
    </aside>
  );
}
