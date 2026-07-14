import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Cancellation | TravelAI",
  description: "Cancellation and withdrawal information for TravelAI plans.",
};

export default function CancellationPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Cancellation & withdrawal"
      intro="How to manage a monthly plan and information about statutory consumer withdrawal rights. Last updated: 14 July 2026."
    >
      <section>
        <h2 className="text-2xl font-bold text-white">Monthly plan cancellation</h2>
        <p className="mt-4">
          You can manage or cancel a Pro Monthly subscription in TravelAI under
          Billing. The action opens the Stripe customer portal, where you can
          cancel the subscription. Your access normally continues until the end
          of the current paid billing period.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">Statutory right of withdrawal</h2>
        <p className="mt-4">
          If you are a consumer in the European Union, you may have a statutory
          right to withdraw from a distance contract within 14 days. To exercise
          that right, send a clear statement with your account email and order
          details to{" "}
          <a className="text-emerald-200 hover:text-emerald-100" href="mailto:baderaum99@gmail.com">
            baderaum99@gmail.com
          </a>
          . You do not need to use a specific form.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">Digital service access</h2>
        <p className="mt-4">
          TravelAI may provide paid digital access immediately after purchase.
          Where legally required for early loss of the right of withdrawal, we
          will obtain your express consent and acknowledgement separately before
          relying on that loss. Your mandatory consumer rights remain
          unaffected.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">Lifetime plan</h2>
        <p className="mt-4">
          Pro Lifetime is a one-time purchase, not a recurring subscription.
          It therefore has no recurring payment to cancel. Statutory withdrawal
          and consumer rights may still apply.
        </p>
      </section>
    </LegalPageShell>
  );
}
