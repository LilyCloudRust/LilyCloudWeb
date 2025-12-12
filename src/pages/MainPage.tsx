import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainPage() {
  return (
    <div class="grid grid-rows-[60px_1fr] grid-cols-[240px_1fr] min-h-screen bg-(--color-background)">
      {/* Topbar */}
      <div class="row-start-1 row-end-2 col-start-1 col-end-3">
        <Topbar />
      </div>
      {/* Sidebar */}
      <div class="row-start-2 row-end-3 col-start-1 col-end-2">
        <Sidebar />
      </div>
      {/* Main Content */}
      <main class="row-start-2 row-end-3 col-start-2 col-end-3 p-8 flex flex-col dark:bg-(--color-background)">
        <h1 class="text-2xl font-bold mb-4 text-(--color-primary)">
          LilyCloud Main Page
        </h1>
        <p class="text-(--color-text-secondary)">
          This is a placeholder for your main content.
        </p>
      </main>
    </div>
  );
}
