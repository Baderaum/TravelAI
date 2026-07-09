"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Compass,
  Home,
  Map,
  Calendar,
  Archive,
  CreditCard,
  Lock,
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
    label: "Archive",
    href: "/archive",
    icon: Archive,
  },
];

type Plan = "Free" | "Monthly" | "Lifetime";

export function Sidebar() {
  const pathname = usePathname();

  const [user, setUser] =
    useState<User | null>(null);
  const [plan, setPlan] =
    useState<Plan>("Free");

  useEffect(() => {

    const supabase =
      createClient();

    async function loadUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (
        profile?.plan === "Monthly" ||
        profile?.plan === "Lifetime"
      ) {
        setPlan(profile.plan);
      }
    }

    loadUser();

  }, []);

  return (
    <div className="relative z-20 flex h-screen w-[280px] shrink-0 flex-col border-r border-white/10 bg-[#06110d]/92 shadow-[24px_0_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">

      {/* LOGO */}
      <div className="border-b border-white/10 p-6">

        <Link href="/" className="flex items-center gap-3">
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
        </Link>

      </div>

      {/* NAVIGATION */}
      <div className="flex-1 p-4">

        <div className="space-y-2">

          <Link
            href="/"
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
              pathname === "/"
                ? "border border-emerald-300/20 bg-emerald-400/[0.12] text-emerald-100"
                : "text-neutral-300 hover:bg-white/[0.07] hover:text-white"
            }`}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          <div className="my-3 border-t border-white/10" />

          {items.map((item) => {

            const Icon =
              item.icon;
            const isLocked =
              plan === "Free" &&
              ["Trips", "Calendar", "Archive"].includes(item.label);

            if (isLocked) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full cursor-not-allowed items-center justify-between gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.045] px-4 py-3 text-left text-neutral-500"
                  aria-disabled="true"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-red-300/20 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-100">
                    <Lock className="h-3 w-3" />
                    Pro
                  </span>
                </button>
              );
            }

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

        <Link
          href="/billing"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
            pathname === "/billing"
              ? "border border-emerald-300/20 bg-emerald-400/[0.12] text-emerald-100"
              : "text-neutral-300 hover:bg-white/[0.07] hover:text-white"
          }`}
        >
          <CreditCard className="h-5 w-5" />
          Billing
        </Link>

        <div className="mt-4 border-t border-white/10" />

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
