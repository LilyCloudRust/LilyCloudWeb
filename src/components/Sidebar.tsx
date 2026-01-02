import type { JSX } from "solid-js";

type SidebarProps = {
  visible: boolean;
};

export default function Sidebar(props: SidebarProps): JSX.Element {
  return (
    <aside
      class={
        "h-full bg-(--color-background) p-4 flex flex-col transition-all duration-100 shadow-lg " +
        (props.visible
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none")
      }
      style="will-change: transform, opacity;"
    >
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
