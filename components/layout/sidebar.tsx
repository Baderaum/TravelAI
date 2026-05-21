"use client";
import Link from "next/link";

import {
  Compass,
  Map,
  Calendar,
  Bookmark,
  Settings,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { useEffect, useState } from "react";

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

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    const supabase =
      createClient();

    async function loadUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();

  }, []);

  return (
    <div className="flex h-screen w-[280px] flex-col border-r border-white/10 bg-black">

      {/* LOGO */}
      <div className="border-b border-white/10 p-6">

        <h1 className="text-2xl font-bold text-white">
          TravelAI
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Group Travel OS
        </p>

      </div>

      {/* NAVIGATION */}
      <div className="flex-1 p-4">

        <div className="space-y-2">

          {items.map((item) => {

            const Icon =
              item.icon;

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

      {/* FOOTER */}
      <div className="border-t border-white/10 p-4">

        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-neutral-400 transition hover:bg-white/5 hover:text-white">

          <Settings className="h-5 w-5" />

          Settings

        </button>

        {/* USER */}
        <div className="mt-4">

          {user ? (

            <div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                <p className="text-xs text-neutral-500">
                  Logged in as
                </p>

                <p className="mt-1 truncate text-sm font-medium text-white">
                  {user.email}
                </p>

              </div>

              <form
                action="/auth/signout"
                method="post"
              >

                <button
                  className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
                >
                  Logout
                </button>

              </form>

            </div>

          ) : (

            <Link
              href="/login"
              className="block w-full rounded-2xl bg-white px-4 py-3 text-center text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Login
            </Link>

          )}

        </div>

      </div>

    </div>
  );
}