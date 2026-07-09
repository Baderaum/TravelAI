"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Route,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type ItineraryActivity = {
  id?: string;
  title: string;
  description?: string | null;
  image?: string | null;
  location?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  estimated_cost?: number | null;
};

type ItineraryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: string;
  startDate?: string | null;
  endDate?: string | null;
  activities: ItineraryActivity[];
};

type ItineraryDay = {
  date: Date;
  dateKey: string;
  activities: ItineraryActivity[];
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseLocalDate(value?: string | null) {
  if (!value) return null;

  const match = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createItineraryDays(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  activities: ItineraryActivity[]
) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  if (!start || !end || end < start) return [];

  const activitiesByDay = new Map<string, ItineraryActivity[]>();

  for (const activity of activities) {
    if (!activity.start_time) continue;

    const dateKey = activity.start_time.slice(0, 10);
    const entries = activitiesByDay.get(dateKey) || [];
    entries.push(activity);
    activitiesByDay.set(dateKey, entries);
  }

  const numberOfDays =
    Math.round((end.getTime() - start.getTime()) / DAY_IN_MS) + 1;

  return Array.from({ length: numberOfDays }, (_, index) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + index
    );
    const dateKey = toDateKey(date);
    const dayActivities = activitiesByDay.get(dateKey) || [];

    return {
      date,
      dateKey,
      activities: dayActivities.sort((a, b) =>
        (a.start_time || "").localeCompare(b.start_time || "")
      ),
    } satisfies ItineraryDay;
  });
}

function formatTime(value?: string | null) {
  if (!value) return null;

  const match = value.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : null;
}

function formatDuration(
  startValue?: string | null,
  endValue?: string | null
) {
  if (!startValue || !endValue) return null;

  const start = new Date(startValue);
  const end = new Date(endValue);
  const minutes = Math.round((end.getTime() - start.getTime()) / 60000);

  if (!Number.isFinite(minutes) || minutes <= 0) return null;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) return `${remainingMinutes} min`;
  if (!remainingMinutes) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
}

export default function ItineraryDialog({
  open,
  onOpenChange,
  destination,
  startDate,
  endDate,
  activities,
}: ItineraryDialogProps) {
  const days = createItineraryDays(startDate, endDate, activities);
  const scheduledCount = days.reduce(
    (total, day) => total + day.activities.length,
    0
  );
  const unscheduledCount = activities.filter(
    (activity) => !activity.start_time
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full !max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-[#070707] p-0 text-white shadow-[0_0_120px_rgba(34,197,94,0.12)]">
        <DialogTitle className="sr-only">Trip itinerary</DialogTitle>
        <DialogDescription className="sr-only">
          Daily schedule for this trip.
        </DialogDescription>

        <div className="max-h-[92vh] overflow-y-auto">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070707]/95 px-6 py-6 backdrop-blur sm:px-9">
            <div className="flex flex-col gap-5 pr-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-green-300">
                  <Route className="h-4 w-4" />
                  {destination}
                </div>
                <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  Your itinerary
                </h2>
              </div>

              {days.length > 0 && (
                <div className="flex gap-2 text-sm">
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-neutral-300">
                    {days.length} {days.length === 1 ? "day" : "days"}
                  </span>
                  <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-2 text-green-300">
                    {scheduledCount} planned
                  </span>
                </div>
              )}
            </div>
          </header>

          <div className="px-5 py-7 sm:px-9 sm:py-9">
            {days.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/[0.15] bg-white/[0.03] px-6 py-14 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-neutral-500" />
                <h3 className="mt-4 text-xl font-semibold">
                  Add your trip dates first
                </h3>
                <p className="mx-auto mt-2 max-w-md text-neutral-400">
                  The itinerary will create one timeline stop for every day of
                  your trip.
                </p>
              </div>
            ) : (
              <div>
                {days.map((day, index) => (
                  <section
                    key={day.dateKey}
                    className="relative grid grid-cols-[52px_minmax(0,1fr)] gap-3 pb-8 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-5"
                  >
                    {index < days.length - 1 && (
                      <div className="absolute bottom-0 left-[25px] top-11 w-px bg-gradient-to-b from-green-400/60 to-white/10 sm:left-[37px]" />
                    )}

                    <div className="relative z-10 flex h-[52px] w-[52px] flex-col items-center justify-center rounded-2xl border border-green-400/30 bg-green-400/10 text-green-200 sm:h-[76px] sm:w-[76px]">
                      <span className="text-[10px] font-medium uppercase tracking-widest sm:text-xs">
                        Day
                      </span>
                      <span className="text-xl font-semibold sm:text-2xl">
                        {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0 pt-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold sm:text-2xl">
                          {day.date.toLocaleDateString("en-GB", {
                            weekday: "long",
                          })}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500">
                          {day.date.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {day.activities.length > 0 ? (
                        <div className="space-y-3">
                          {day.activities.map((activity) => {
                            const startTime = formatTime(activity.start_time);
                            const endTime = formatTime(activity.end_time);
                            const duration = formatDuration(
                              activity.start_time,
                              activity.end_time
                            );

                            return (
                              <article
                                key={activity.id || `${day.dateKey}-${activity.title}`}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-black/70 transition hover:border-green-400/25 hover:bg-white/[0.04]"
                              >
                                <div className="flex gap-4 p-4 sm:p-5">
                                  {activity.image && (
                                    <img
                                      src={activity.image}
                                      alt=""
                                      className="hidden h-24 w-28 shrink-0 rounded-xl object-cover sm:block"
                                    />
                                  )}

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                      <div>
                                        <p className="flex items-center gap-2 text-sm font-medium text-green-300">
                                          <Clock3 className="h-4 w-4" />
                                          {startTime || "Time open"}
                                          {endTime ? ` - ${endTime}` : ""}
                                        </p>
                                        <h4 className="mt-2 text-lg font-semibold sm:text-xl">
                                          {activity.title}
                                        </h4>
                                      </div>

                                      {duration && (
                                        <span className="w-fit shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400">
                                          {duration}
                                        </span>
                                      )}
                                    </div>

                                    {activity.location && (
                                      <p className="mt-3 flex items-start gap-2 text-sm text-neutral-400">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                        {activity.location}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-6 text-sm text-neutral-500">
                          No activities planned yet. Keep this day open or add
                          an activity time.
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {unscheduledCount > 0 && days.length > 0 && (
              <div className="ml-[64px] rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-neutral-400 sm:ml-[96px]">
                <span className="font-medium text-white">
                  {unscheduledCount} {unscheduledCount === 1 ? "activity" : "activities"}
                </span>{" "}
                still need a date and time. Use <span className="text-green-300">Plan timing</span> in Activities to place them automatically.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
