import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Sparkles,
  Plus,
  Clock3,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const trips = [
  {
    id: "ibiza",
    name: "Ibiza Summer Trip",
    description: "Beach clubs, nightlife and sunsets.",
    members: 6,
    status: "Planning",
  },
  {
    id: "tokyo",
    name: "Tokyo Adventure",
    description: "Food, city vibes and late night exploring.",
    members: 3,
    status: "Ideas",
  },
  {
    id: "bali",
    name: "Bali Escape",
    description: "Relaxing villas and tropical beaches.",
    members: 5,
    status: "Voting",
  },
];

export default function HomePage() {
  return (
    <DashboardShell>
      <div className="p-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300">
              <Sparkles className="h-4 w-4" />
              AI Travel Workspace
            </div>

            <h1 className="text-5xl font-bold tracking-tight">
              Plan trips with your friends.
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-neutral-400">
              Collect preferences, compare dates and let AI help your group find
              the perfect destination.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:scale-[1.03]">
            <Plus className="h-5 w-5" />
            New Trip
          </button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 xl:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trip/${trip.id}`}
              className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                  alt={trip.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute left-6 top-6">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-sm backdrop-blur">
                    {trip.status}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6">
                  <h2 className="text-3xl font-bold">
                    {trip.name}
                  </h2>

                  <p className="mt-2 max-w-sm text-sm text-neutral-300">
                    {trip.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Users className="h-4 w-4" />
                    {trip.members}
                  </div>

                  <div className="flex items-center gap-2 text-neutral-400">
                    <Clock3 className="h-4 w-4" />
                    Active
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-300 transition group-hover:translate-x-1">
                  Open
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}