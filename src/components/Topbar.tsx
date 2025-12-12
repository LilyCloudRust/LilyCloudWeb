import type { JSX } from "solid-js";

export default function Topbar(): JSX.Element {
  return (
    <header class="h-full w-full bg-(--color-background) border-b border-(--color-border) px-6 py-3 flex items-center">
      <div class="font-bold text-lg text-(--color-text-primary)">LilyCloud</div>
      <div class="ml-auto text-sm text-(--color-text-secondary)">
        Topbar placeholder
      </div>
    </header>
  );
}
