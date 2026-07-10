import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="travel-page-bg relative min-h-screen text-white">
      <div className="travel-grid-overlay pointer-events-none fixed inset-0" />

      <Sidebar />

      <main className="relative z-10 min-h-screen md:pl-[280px]">
        {children}
      </main>

    </div>
  );
}
