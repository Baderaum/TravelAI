"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const previewFeatures = [
  "Be able to plan a trip from start to end",
  "Create unlimited trip projects",
  "Search flights from your trip workspace",
  "Invite friends to a trip",
  "Generate AI activities for any trip",
  "Build day-by-day itineraries",
];

const allFeatures = [
  "Be able to plan a trip from start to end",
  "Create unlimited trip projects",
  "Create trips from AI recommendations",
  "Search flights from your trip workspace",
  "Invite friends to a trip",
  "Plan together with trip members",
  "Vote on activities with your group",
  "Generate AI activities for any trip",
  "Add AI-generated activity descriptions",
  "Plan activity timing with AI",
  "Build day-by-day itineraries",
  "View planned trips in the calendar",
  "Track total trip budget",
  "Track daily trip costs",
  "Add hotel budget",
  "Estimate activity costs",
  "Unlock advanced discovery filters",
  "Filter by target country",
  "Filter by trip dates and group size",
  "See match scores for destinations",
  "Archive and manage completed trips",
];

export default function ProPricingCard({
  expanded,
  onExpandedChange,
}: {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}) {
  const visibleFeatures = expanded ? allFeatures : previewFeatures;

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] border border-emerald-200/25 bg-[linear-gradient(145deg,rgba(16,185,129,0.16),rgba(255,255,255,0.06))] p-7 shadow-[0_30px_100px_rgba(16,185,129,0.12)] transition-all duration-300 ${
        expanded ? "md:col-span-2" : ""
      }`}
    >
      <div className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
        Best value
      </div>

      <div className="pr-28">
        <p className="text-lg font-semibold">Pro</p>

        <div
          className={`grid transition-all duration-300 ${
            expanded
              ? "grid-rows-[0fr] opacity-0"
              : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div>
                <p className="text-4xl font-bold">$10</p>
                <p className="mt-1 text-sm text-neutral-300">per month</p>
              </div>

              <div className="hidden h-16 w-px bg-white/15 sm:block" />

              <div className="border-t border-white/15 pt-4 sm:border-t-0 sm:pt-0">
                <p className="text-4xl font-bold">$25</p>
                <p className="mt-1 text-sm text-neutral-300">lifetime</p>
              </div>
            </div>
          </div>
        </div>

        <p
          className={`text-neutral-200 transition-all duration-300 ${
            expanded ? "mt-3 text-sm" : "mt-4 min-h-14"
          }`}
        >
          For actually planning and managing trips.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onExpandedChange(!expanded)}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-white/10"
        aria-expanded={expanded}
      >
        {expanded ? "Show less" : "View all Pro features"}
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      <div
        className={`mt-7 grid gap-3 text-sm text-neutral-200 transition-all duration-300 ${
          expanded ? "md:grid-cols-2" : ""
        }`}
      >
        {visibleFeatures.map((feature) => (
          <p key={feature} className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-100" />
            {feature}
          </p>
        ))}
      </div>

      {!expanded && (
        <Link
          href="/billing"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-neutral-200"
        >
          Choose plan
          <ArrowRight className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
