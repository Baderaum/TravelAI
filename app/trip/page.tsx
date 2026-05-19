import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Plus,
  Users,
  ArrowRight,
  Clock3,
} from "lucide-react";

const trips = [
  {
    id: "ibiza",
    name: "Ibiza Summer",
    members: 6,
    status: "Planning",
  },
  {
    id: "tokyo",
    name: "Tokyo Adventure",
    members: 3,
    status: "Ideas",
  },
];

export default function TripsPage() {
  return (
    <DashboardShell>
      <div className="p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-white">
              Your Trips
            </h1>

            <p className="mt-4 text-lg text-neutral-400">
              Collaborative workspaces for group travel planning.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-medium text-black">
            <Plus className="h-5 w-5" />
            New Trip
          </button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 xl:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trip/${trip.id}`}
              className="group rounded-[32px] border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                  {trip.status}
                </span>

                <ArrowRight className="h-5 w-5 text-white transition group-hover:translate-x-1" />
              </div>

              <h2 className="mt-8 text-3xl font-bold text-white">
                {trip.name}
              </h2>

              <div className="mt-8 flex items-center gap-6 text-neutral-400">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {trip.members} members
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  Active
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}