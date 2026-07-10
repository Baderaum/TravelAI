"use client";

import { useState } from "react";
import { Check, LockKeyhole } from "lucide-react";

import ProPricingCard from "@/components/landing/pro-pricing-card";

export default function PricingCards() {
  const [proExpanded, setProExpanded] = useState(false);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {!proExpanded && (
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7">
          <p className="text-lg font-semibold">Free</p>
          <p className="mt-3 text-4xl font-bold">$0</p>
          <p className="mt-4 min-h-14 text-neutral-300">
            For trying destination discovery.
          </p>
          <div className="mt-7 space-y-3 text-sm text-neutral-300">
            <p className="flex gap-2">
              <Check className="h-4 w-4 text-emerald-200" />
              Discovery search
            </p>
            <p className="flex gap-2">
              <Check className="h-4 w-4 text-emerald-200" />
              Basic recommendations
            </p>
            <p className="flex gap-2">
              <LockKeyhole className="h-4 w-4 text-neutral-500" />
              Hidden Gems and advanced filters locked
            </p>
          </div>
        </div>
      )}

      <ProPricingCard
        expanded={proExpanded}
        onExpandedChange={setProExpanded}
      />
    </div>
  );
}
