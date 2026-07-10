import Link from "next/link";
import {
  CreditCard,
} from "lucide-react";

import BillingPlanCards from "@/components/billing/billing-plan-cards";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

type Plan = "Free" | "Monthly" | "Lifetime";

function normalizePlan(plan?: string | null): Plan {
  if (plan === "Monthly" || plan === "Lifetime") {
    return plan;
  }

  return "Free";
}

export default async function BillingPage() {
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
              You need to be logged in before choosing a plan.
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

  const currentPlan = normalizePlan(profile?.plan);

  return (
    <DashboardShell>
      <div className="p-6 sm:p-10">
        <section className="travel-card relative overflow-hidden rounded-[36px] p-8 sm:p-10">
          <div className="max-w-3xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-neutral-200">
              <CreditCard className="h-6 w-6" />
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-white sm:text-6xl">
              Billing
            </h1>

            <p className="mt-4 text-lg leading-8 text-neutral-300">
              Choose how you want to unlock the full TravelAI planning
              workspace. Payments are securely handled through Stripe.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <BillingPlanCards
            currentPlan={currentPlan}
            enableLiveTestPayment={
              process.env.ENABLE_STRIPE_LIVE_TEST_PAYMENT ===
              "true"
            }
          />
        </section>
      </div>
    </DashboardShell>
  );
}
