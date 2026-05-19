"use client";

import Link from "next/link";
import {
  Compass,
  Map,
  Calendar,
  Bookmark,
  Settings,
} from "lucide-react";

const items = [
  {
    label: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    label: "Trips",
    href: "/trips",
    icon: Map,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    label: "Saved",
    href: "/saved",
    icon: Bookmark,
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
          Group Travel OS
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