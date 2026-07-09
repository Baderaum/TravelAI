import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="travel-page-bg relative flex min-h-screen overflow-hidden text-white">
      <div className="travel-grid-overlay pointer-events-none absolute inset-0" />

      <Sidebar />

      <main className="relative z-10 flex-1 overflow-auto">
        {children}
      </main>

    </div>
  );
}
