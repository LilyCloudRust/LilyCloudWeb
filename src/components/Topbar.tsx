import type { JSX } from "solid-js";

type TopbarProps = {
  onToggleSidebar: () => void;
};

export default function Topbar(props: TopbarProps): JSX.Element {
  return (
    <header class="h-full w-full bg-(--color-secondary) border-b border-(--color-border) px-6 py-3 flex items-center">
      <button
        class="mr-4 p-2 rounded hover:bg-(--color-muted)"
        aria-label="Toggle sidebar"
        onClick={props.onToggleSidebar}
        type="button"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>
      <div class="font-bold text-lg text-(--color-text-primary)">LilyCloud</div>
      <div class="ml-auto text-sm text-(--color-text-secondary)">
        Topbar placeholder
      </div>
    </header>
  );
}
