"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Compass,
  Map,
  Calendar,
  Bookmark,
  Settings,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

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
  const pathname = usePathname();

  const [user, setUser] =
    useState<User | null>(null);

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
    <div className="relative z-20 flex h-screen w-[280px] shrink-0 flex-col border-r border-white/10 bg-[#06110d]/92 shadow-[24px_0_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">

      {/* LOGO */}
      <div className="border-b border-white/10 p-6">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/[0.12] text-emerald-200 shadow-[0_0_34px_rgba(52,211,153,0.12)]">
            <Compass className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              TravelAI
            </h1>

            <p className="mt-1 text-sm text-emerald-100/55">
              Group Travel OS
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.055] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">
            AI Workspace
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            Discover, vote and plan trips with your group.
          </p>
        </div>

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
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  pathname === item.href
                    ? "border border-emerald-300/20 bg-emerald-400/[0.12] text-emerald-100"
                    : "text-neutral-300 hover:bg-white/[0.07] hover:text-white"
                }`}
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

        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-neutral-400 transition hover:bg-white/[0.07] hover:text-white">

          <Settings className="h-5 w-5" />

          Settings

        </button>

        {/* USER */}
        <div className="mt-4">

          {user ? (

            <div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.065] p-4">

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
