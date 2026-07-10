import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

import ProLockedState from "@/components/billing/pro-locked-state";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

type Trip = {
  id: string;
  title: string;
  destination: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
};

type TripMembership = {
  trips: Trip | Trip[] | null;
};

type CalendarDay = {
  date: Date;
  iso: string;
  inMonth: boolean;
};

const hiddenStatuses = new Set(["planning", "archived"]);
const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function getMonthDays(monthStart: Date): CalendarDay[] {
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = addDays(monthStart, -firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      date,
      iso: toIsoDate(date),
      inMonth: date.getMonth() === monthStart.getMonth(),
    };
  });
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDefaultMonthForTrips(trips: Trip[]) {
  const datedTrips = trips.filter(
    (trip) => trip.start_date && trip.end_date
  );

  if (!datedTrips.length) {
    return getMonthStart(new Date());
  }

  const starts = datedTrips.map((trip) => parseDate(trip.start_date!));
  return getMonthStart(
    new Date(Math.min(...starts.map((date) => date.getTime())))
  );
}

function getMonthFromParam(value?: string | string[]) {
  if (typeof value !== "string") {
    return null;
  }

  const match = value.match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) {
    return null;
  }

  return new Date(year, month - 1, 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function getCalendarHref(date: Date) {
  return `/calendar?month=${getMonthKey(date)}`;
}

function tripIsOnDate(trip: Trip, isoDate: string) {
  if (!trip.start_date || !trip.end_date) {
    return false;
  }

  return trip.start_date <= isoDate && trip.end_date >= isoDate;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <DashboardShell>
        <div className="flex min-h-screen items-center justify-center p-10 text-white">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center">
            <h1 className="text-3xl font-bold">Please log in</h1>
            <p className="mt-4 text-neutral-400">
              You need to be logged in to view your calendar.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-neutral-200"
            >
              Login
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (profile?.plan !== "Monthly" && profile?.plan !== "Lifetime") {
    return (
      <DashboardShell>
        <ProLockedState
          title="Calendar is a Pro feature"
          description="Upgrade to see planned, active and completed trips across your travel calendar."
        />
      </DashboardShell>
    );
  }

  const { data: rawMemberships } = await supabase
    .from("trip_members")
    .select(
      `
      trips (
        id,
        title,
        destination,
        status,
        start_date,
        end_date
      )
    `
    )
    .eq("user_id", user.id);

  const memberships = rawMemberships as TripMembership[] | null;

  const trips =
    memberships
      ?.flatMap((membership) => {
        if (!membership.trips) return [];

        return Array.isArray(membership.trips)
          ? membership.trips
          : [membership.trips];
      })
      .filter((trip) => !hiddenStatuses.has(trip.status))
      .sort((a, b) => {
        const first = a.start_date || "9999-12-31";
        const second = b.start_date || "9999-12-31";
        return first.localeCompare(second);
      }) || [];

  const datedTrips = trips.filter(
    (trip) => trip.start_date && trip.end_date
  );
  const selectedMonth =
    getMonthFromParam(query.month) || getDefaultMonthForTrips(trips);
  const monthDays = getMonthDays(selectedMonth);
  const visibleMonthTrips = datedTrips.filter((trip) =>
    monthDays.some((day) => day.inMonth && tripIsOnDate(trip, day.iso))
  );

  return (
    <DashboardShell>
      <div className="p-6 sm:p-10">
        <section className="travel-card relative overflow-hidden rounded-[36px] p-8 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-neutral-200">
                <CalendarDays className="h-6 w-6" />
              </div>

              <h1 className="mt-6 text-5xl font-bold leading-tight text-white sm:text-6xl">
                Calendar
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-300">
                Planned, active and completed trips appear on every day of
                their travel period.
              </p>
            </div>

            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-neutral-200"
            >
              <Plus className="h-5 w-5" />
              New Trip
            </Link>
          </div>
        </section>

        {!datedTrips.length && (
          <div className="travel-card mt-10 rounded-[32px] p-12 text-center">
            <h2 className="text-3xl font-bold text-white">
              No scheduled trips yet
            </h2>
            <p className="mt-4 text-neutral-400">
              Set a trip to Planned, Active or Completed and make sure it has
              start and end dates.
            </p>
          </div>
        )}

        <div className="mt-10">
          <section className="travel-card rounded-[36px] p-5 sm:p-7">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                      Trip schedule
                    </p>
                    <h2 className="mt-1 text-3xl font-bold text-white">
                      {formatMonth(selectedMonth)}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-neutral-400">
                      {visibleMonthTrips.length} scheduled{" "}
                      {visibleMonthTrips.length === 1 ? "trip" : "trips"}
                    </p>

                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 p-1">
                      <Link
                        href={getCalendarHref(addMonths(selectedMonth, -1))}
                        aria-label="Previous month"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Link>

                      <Link
                        href={getCalendarHref(new Date())}
                        className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
                      >
                        Today
                      </Link>

                      <Link
                        href={getCalendarHref(addMonths(selectedMonth, 1))}
                        aria-label="Next month"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekdayLabels.map((label) => (
                    <div
                      key={label}
                      className="px-2 pb-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500"
                    >
                      {label}
                    </div>
                  ))}

                  {monthDays.map((day) => {
                    const dayTrips = datedTrips.filter((trip) =>
                      tripIsOnDate(trip, day.iso)
                    );

                    return (
                      <div
                        key={day.iso}
                        className={`min-h-[128px] rounded-3xl border p-3 transition ${
                          day.inMonth
                            ? "border-white/10 bg-white/[0.045]"
                            : "border-white/[0.04] bg-white/[0.018] text-neutral-600"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-sm font-medium ${
                              day.inMonth
                                ? "text-neutral-200"
                                : "text-neutral-600"
                            }`}
                          >
                            {day.date.getDate()}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2">
                          {dayTrips.map((trip) => (
                            <Link
                              key={trip.id}
                              href={`/trip/${trip.id}`}
                              className="group block rounded-2xl border border-white/10 bg-black/35 p-3 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-white">
                                    {trip.title}
                                  </p>
                                  <p className="mt-1 truncate text-xs text-neutral-400">
                                    {trip.destination || formatStatus(trip.status)}
                                  </p>
                                </div>

                                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
