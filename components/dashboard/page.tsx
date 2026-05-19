import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Sparkles, Plus } from "lucide-react";

const trips = [
  {
    name: "Ibiza Summer Trip",
    members: 6,
    status: "Planning",
  },
  {
    name: "Tokyo Adventure",
    members: 3,
    status: "Ideas",
  },
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Your Trips
            </h1>

            <p className="mt-2 text-neutral-400">
              Plan group trips with AI.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.02]">
            <Plus className="h-4 w-4" />
            New Trip
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <div
              key={trip.name}
              className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Sparkles className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-neutral-300">
                  {trip.status}
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                {trip.name}
              </h2>

              <p className="mt-2 text-neutral-400">
                {trip.members} members
              </p>

              <button className="mt-8 w-full rounded-2xl bg-white/10 py-3 transition hover:bg-white/20">
                Open Workspace
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}