import type { Metadata } from "next";
import Link from "next/link";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms | TravelAI",
  description: "Terms of use for TravelAI.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms of use"
      intro="The rules for using TravelAI and its paid planning features. Last updated: 14 July 2026."
    >
      <section>
        <h2 className="text-2xl font-bold text-white">1. Service</h2>
        <p className="mt-4">
          TravelAI is a digital group travel-planning service. It offers
          destination discovery, shared trip workspaces, AI-assisted planning,
          activity and itinerary tools, flight search links and budget tools.
          TravelAI does not sell or operate flights, accommodation, activities
          or other travel services.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">2. Accounts and acceptable use</h2>
        <p className="mt-4">
          You are responsible for keeping your sign-in method secure and for
          the content you add to a trip. Do not use TravelAI unlawfully,
          interfere with the service, upload harmful content or invite people
          without a legitimate reason to participate in a trip.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">3. Free and paid plans</h2>
        <p className="mt-4">
          The Free plan provides limited destination discovery. Paid plans
          unlock the planning workspace and Pro features shown on the billing
          page. Pro Monthly is billed at $10 per month until cancelled. Pro
          Lifetime is a one-time payment of $25 for access to the Pro features
          made available under that plan.
        </p>
        <p className="mt-4">
          Payments are processed by Stripe. Monthly subscriptions can be
          managed or cancelled through the TravelAI billing area, which opens
          the Stripe customer portal. Cancellation takes effect at the end of
          the current billing period unless Stripe states otherwise.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">4. AI and travel information</h2>
        <p className="mt-4">
          AI-generated suggestions, prices, flight estimates, timing and other
          information are for planning assistance only. They may be incomplete,
          inaccurate or out of date. Always verify availability, prices, visa
          requirements, safety information, travel restrictions and booking
          terms directly with the relevant provider before making a decision or
          purchase.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">5. Availability and changes</h2>
        <p className="mt-4">
          We aim to keep TravelAI available and useful, but do not guarantee
          uninterrupted availability or that every third-party integration will
          remain available. We may improve, change or discontinue features when
          reasonably necessary, while respecting mandatory consumer rights.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">6. Liability</h2>
        <p className="mt-4">
          Nothing in these terms limits liability where it cannot lawfully be
          limited. Subject to mandatory law, TravelAI is not responsible for
          bookings, purchases, travel outcomes or third-party services. For
          all other claims, liability is limited to intent and gross negligence;
          in the case of a breach of essential contractual obligations,
          liability is limited to foreseeable damage typical for this type of
          contract.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">7. Contact and withdrawal</h2>
        <p className="mt-4">
          Questions about these terms can be sent to{" "}
          <a className="text-emerald-200 hover:text-emerald-100" href="mailto:baderaum99@gmail.com">
            baderaum99@gmail.com
          </a>
          . Consumer withdrawal information is available on the{" "}
          <Link className="text-emerald-200 hover:text-emerald-100" href="/cancellation">
            Cancellation page
          </Link>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
