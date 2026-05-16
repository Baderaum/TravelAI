"use client";

import Link from "next/link";
import {
  Compass,
  Map,
  Calendar,
  Settings,
  Sparkles,
} from "lucide-react";

const items = [
  {
    label: "Explore",
    href: "/dashboard",
    icon: Compass,
  },
  {
    label: "Trips",
    href: "/dashboard/trips",
    icon: Map,
  },
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    label: "AI Planner",
    href: "/dashboard/planner",
    icon: Sparkles,
  },
];

export function Sidebar() {
  return (
    <div className="flex h-screen w-[280px] flex-col border-r border-white/10 bg-black">
      <div className="border-b border-white/10 p-6">
        <h1 className="text-2xl font-bold text-white">
          TravelAI
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          AI Group Travel Planning
        </p>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-neutral-300 transition hover:bg-white/5 hover:text-white"
              >
                <Icon className="h-5 w-5" />

                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-neutral-400 transition hover:bg-white/5 hover:text-white">
          <Settings className="h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  );
}