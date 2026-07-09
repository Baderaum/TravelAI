"use client";

import {
  BedDouble,
  CalendarDays,
  CircleDollarSign,
  Plane,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ItineraryActivity } from "@/components/trip/itinerary-dialog";

type BudgetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate?: string | null;
  endDate?: string | null;
  flightBudget?: number | null;
  hotelBudgetAmount?: number | null;
  hotelBudgetMode?: "total" | "per_night" | null;
  activities: ItineraryActivity[];
};

type BudgetDay = {
  date: Date;
  key: string;
  activityCost: number;
  activityCount: number;
  hotelCost: number;
};

function parseDate(value?: string | null) {
  if (!value) return null;

  const match = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function calculateBudgetDays({
  startDate,
  endDate,
  hotelTotal,
  activities,
}: {
  startDate?: string | null;
  endDate?: string | null;
  hotelTotal: number;
  activities: ItineraryActivity[];
}) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end || end < start) return [];

  const dayCount =
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const nightCount = Math.max(0, dayCount - 1);
  const hotelPerNight = nightCount > 0 ? hotelTotal / nightCount : 0;

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + index
    );
    const key = dateKey(date);
    const dayActivities = activities.filter(
      (activity) => activity.start_time?.slice(0, 10) === key
    );

    return {
      date,
      key,
      activityCost: dayActivities.reduce(
        (sum, activity) => sum + (activity.estimated_cost || 0),
        0
      ),
      activityCount: dayActivities.length,
      hotelCost: index < nightCount ? hotelPerNight : 0,
    } satisfies BudgetDay;
  });
}

export default function BudgetDialog({
  open,
  onOpenChange,
  startDate,
  endDate,
  flightBudget,
  hotelBudgetAmount,
  hotelBudgetMode,
  activities,
}: BudgetDialogProps) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const dayCount =
    start && end && end >= start
      ? Math.round((end.getTime() - start.getTime()) / 86400000) + 1
      : 0;
  const nightCount = Math.max(0, dayCount - 1);
  const hotelTotal = hotelBudgetAmount
    ? hotelBudgetMode === "per_night"
      ? hotelBudgetAmount * nightCount
      : hotelBudgetAmount
    : 0;
  const activityTotal = activities.reduce(
    (sum, activity) => sum + (activity.estimated_cost || 0),
    0
  );
  const total = (flightBudget || 0) + hotelTotal + activityTotal;
  const days = calculateBudgetDays({
    startDate,
    endDate,
    hotelTotal,
    activities,
  });
  const missingActivityCosts = activities.filter(
    (activity) => activity.estimated_cost == null
  ).length;

  const categories = [
    {
      label: "Flights",
      value: flightBudget || 0,
      detail: flightBudget ? "Round trip estimate" : "No estimate yet",
      icon: Plane,
    },
    {
      label: "Hotel",
      value: hotelTotal,
      detail: hotelBudgetAmount
        ? hotelBudgetMode === "per_night"
          ? `${formatCurrency(hotelBudgetAmount)} x ${nightCount} nights`
          : `${nightCount} nights, total cost`
        : "Add in Trip Settings",
      icon: BedDouble,
    },
    {
      label: "Activities",
      value: activityTotal,
      detail: `${activities.length} activities`,
      icon: Sparkles,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full !max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[#080808] p-0 text-white shadow-[0_0_100px_rgba(34,197,94,0.1)]">
        <DialogTitle className="sr-only">Trip budget</DialogTitle>
        <DialogDescription className="sr-only">
          Estimated trip costs by category and day.
        </DialogDescription>

        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <header className="pr-10">
            <p className="flex items-center gap-2 text-sm font-medium text-green-300">
              <CircleDollarSign className="h-4 w-4" />
              Estimated cost per person
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-4xl font-semibold">Budget</h2>
              <p className="text-3xl font-semibold text-green-300">
                {formatCurrency(total)}
              </p>
            </div>
          </header>

          <div className="mt-7 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] px-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.label}
                  className="flex items-center gap-4 py-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-neutral-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{category.label}</p>
                    <p className="mt-1 truncate text-sm text-neutral-500">
                      {category.detail}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(category.value)}
                  </p>
                </div>
              );
            })}
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">Daily budget</h3>
              <span className="text-sm text-neutral-500">
                Hotel + activities
              </span>
            </div>

            {days.length > 0 ? (
              <div className="mt-4 space-y-2">
                {days.map((day, index) => {
                  const dayTotal = day.hotelCost + day.activityCost;

                  return (
                    <div
                      key={day.key}
                      className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.08] bg-black/50 px-3 py-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-400/10 text-sm font-semibold text-green-300">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {day.date.toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {day.activityCount} activities
                          {day.hotelCost > 0 ? " + hotel" : ""}
                        </p>
                      </div>
                      <p className="font-medium">{formatCurrency(dayTotal)}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-neutral-500">
                <CalendarDays className="mx-auto mb-3 h-5 w-5" />
                Add trip dates to calculate daily budgets.
              </div>
            )}
          </section>

          {missingActivityCosts > 0 && (
            <p className="mt-5 text-sm text-neutral-500">
              {missingActivityCosts} {missingActivityCosts === 1 ? "activity has" : "activities have"} no cost estimate yet. Add one in the activity details.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
