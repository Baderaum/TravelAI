"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Compass,
  FlaskConical,
  Infinity,
  Sparkles,
} from "lucide-react";

import stripeLogo from "@/screenshots/stripe.png";

type PlanId =
  | "Free"
  | "Monthly"
  | "Lifetime"
  | "LiveTest";

type BillingPlan = {
  id: PlanId;
  title: string;
  price: string;
  interval: string;
  button: string;
  icon: typeof Compass;
  accent: "neutral" | "emerald" | "amber";
  perks: string[];
  paid: boolean;
};

const plans: BillingPlan[] = [
  {
    id: "Free",
    title: "Free",
    price: "$0",
    interval: "current discovery access",
    button: "Current free plan",
    icon: Compass,
    accent: "neutral",
    perks: ["Discovery search", "Basic recommendations"],
    paid: false,
  },
  {
    id: "Monthly",
    title: "Pro Monthly",
    price: "$10",
    interval: "per month",
    button: "Choose monthly",
    icon: Sparkles,
    accent: "emerald",
    perks: ["Monthly access", "Manage or cancel anytime"],
    paid: true,
  },
  {
    id: "Lifetime",
    title: "Pro Lifetime",
    price: "$25",
    interval: "one-time payment",
    button: "Choose lifetime",
    icon: Infinity,
    accent: "amber",
    perks: ["One-time payment", "Lifetime access"],
    paid: true,
  },
];

export default function BillingPlanCards({
  currentPlan,
  enableLiveTestPayment,
}: {
  currentPlan: Exclude<PlanId, "LiveTest">;
  enableLiveTestPayment: boolean;
}) {
  const [selectedPlan, setSelectedPlan] =
    useState<PlanId>(currentPlan);
  const [loadingPlan, setLoadingPlan] =
    useState<PlanId | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function startCheckout(plan: PlanId) {
    if (plan === "Free") return;

    setLoadingPlan(plan);
    setErrorMessage("");

    try {
      const endpoint =
        plan !== "LiveTest" && currentPlan === plan
          ? "/api/stripe/portal"
          : "/api/stripe/checkout";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          endpoint === "/api/stripe/checkout"
            ? JSON.stringify({ plan })
            : undefined,
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(
          data.error || "Could not open Stripe"
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not open Stripe"
      );
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      {errorMessage && (
        <p className="mb-5 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {errorMessage}
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {plans.map((plan) => {
        const Icon = plan.icon;
        const selected = selectedPlan === plan.id;
        const accentClasses =
          plan.accent === "neutral"
            ? "border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))]"
            : plan.accent === "emerald"
            ? "border-emerald-200/25 bg-[linear-gradient(145deg,rgba(16,185,129,0.16),rgba(255,255,255,0.055))]"
            : "border-amber-200/25 bg-[linear-gradient(145deg,rgba(245,158,11,0.15),rgba(255,255,255,0.055))]";
        const iconColor =
          plan.accent === "neutral"
            ? "text-neutral-200"
            : plan.accent === "emerald"
            ? "text-emerald-200"
            : "text-amber-200";
        const isCurrentPlan = currentPlan === plan.id;

        return (
          <article
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`travel-card-hover rounded-[32px] border p-7 text-left transition ${
              isCurrentPlan
                ? `border-white shadow-[0_0_0_1px_rgba(255,255,255,0.78),0_30px_90px_rgba(0,0,0,0.34)] md:col-span-2 xl:col-span-1 xl:scale-[1.03] ${accentClasses}`
                : selected
                ? `border-white/60 shadow-[0_0_0_1px_rgba(255,255,255,0.35),0_24px_70px_rgba(0,0,0,0.28)] ${accentClasses}`
                : accentClasses
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <Icon className={`h-7 w-7 ${iconColor}`} />

              {plan.paid && (
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2">
                  <Image
                    src={stripeLogo}
                    alt="Stripe"
                    className="h-4 w-auto"
                    sizes="72px"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <h2 className="text-3xl font-bold text-white">
                {plan.title}
              </h2>

              {isCurrentPlan && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                  Current
                </span>
              )}
            </div>

            <p className="mt-4 text-5xl font-bold text-white">
              {plan.price}
            </p>
            <p className="mt-1 text-neutral-400">
              {plan.interval}
            </p>
            <div className="mt-6 space-y-2">
              {plan.perks.map((perk) => (
                <p
                  key={perk}
                  className="flex items-center gap-2 text-sm text-neutral-300"
                >
                  <Check className="h-4 w-4 text-emerald-200" />
                  {perk}
                </p>
              ))}
            </div>

            <button
              type="button"
              disabled={
                !plan.paid ||
                loadingPlan === plan.id
              }
              onClick={(event) => {
                event.stopPropagation();
                startCheckout(plan.id);
              }}
              className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold transition ${
                plan.paid
                  ? "bg-white text-black hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-70"
                  : "border border-white/10 bg-white/[0.055] text-neutral-300"
              }`}
            >
              {loadingPlan === plan.id
                ? "Opening Stripe..."
                : isCurrentPlan && plan.paid
                ? "Manage billing"
                : plan.button}
              {plan.paid && <ArrowRight className="h-5 w-5" />}
            </button>
          </article>
        );
        })}
      </div>

      {enableLiveTestPayment && (
        <div className="mt-6 rounded-[28px] border border-blue-300/25 bg-blue-500/[0.08] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 text-blue-100">
                <FlaskConical className="h-5 w-5" />
                <h3 className="text-xl font-bold">
                  Live Stripe webhook test
                </h3>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">
                Runs a small live one-time payment to verify
                checkout, webhook delivery and database access.
                This does not unlock Pro.
              </p>
            </div>

            <button
              type="button"
              disabled={loadingPlan === "LiveTest"}
              onClick={() => startCheckout("LiveTest")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-70"
            >
              {loadingPlan === "LiveTest"
                ? "Opening Stripe..."
                : "Pay test amount"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
