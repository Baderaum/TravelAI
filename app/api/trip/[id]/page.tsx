import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CalendarDays, Users, Sparkles } from "lucide-react";

export default function TripPage() {
  return (
    <DashboardShell>
      <div className="flex min-h-screen">
        <div className="w-[320px] border-r border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-bold">
            Ibiza Summer
          </h2>

          <div className="mt-8 space-y-3">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
              <Sparkles className="h-5 w-5" />
              AI Planner
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 hover:bg-white/5">
              <CalendarDays className="h-5 w-5" />
              Dates
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 hover:bg-white/5">
              <Users className="h-5 w-5" />
              Group
            </button>
          </div>
        </div>

        <div className="flex-1 p-10">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-5xl font-bold">
              Plan your next trip.
            </h1>

            <p className="mt-4 text-lg text-neutral-400">
              AI helps your group find the perfect destination.
            </p>

            <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-5">
              <textarea
                placeholder="We want beach, nightlife and warm weather in August..."
                className="min-h-[180px] w-full resize-none bg-transparent text-lg outline-none placeholder:text-neutral-500"
              />

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <div className="flex gap-2">
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
                    Beach
                  </div>

                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
                    Nightlife
                  </div>

                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
                    Europe
                  </div>
                </div>

                <button className="rounded-2xl bg-white px-5 py-3 font-medium text-black">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[340px] border-l border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold">
            Group Members
          </h2>

          <div className="mt-6 space-y-4">
            {["Max", "Anna", "Chris", "Tom"].map((member) => (
              <div
                key={member}
                className="flex items-center gap-3 rounded-2xl bg-white/5 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  {member[0]}
                </div>

                <div>
                  <p className="font-medium">{member}</p>

                  <p className="text-sm text-neutral-500">
                    Preferences added
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}