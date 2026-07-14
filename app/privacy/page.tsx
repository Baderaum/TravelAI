import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy | TravelAI",
  description: "Privacy information for TravelAI.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy"
      intro="How TravelAI processes information needed to provide the service. Last updated: 14 July 2026."
    >
      <section>
        <h2 className="text-2xl font-bold text-white">1. Controller and contact</h2>
        <p className="mt-4">
          Questions about privacy can be sent to{" "}
          <a className="text-emerald-200 hover:text-emerald-100" href="mailto:baderaum99@gmail.com">
            baderaum99@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">2. Account and trip data</h2>
        <p className="mt-4">
          When you create an account or use TravelAI, we process account data
          such as your email address and authentication details, as well as
          trip content you create or share, including destinations, dates,
          activities, votes, budgets and member invitations. This processing
          is necessary to provide the requested account and planning features.
        </p>
        <p className="mt-4">
          Authentication and application data are hosted using Supabase. If
          you choose Google sign-in, Google processes the authentication flow
          and shares the account details needed to create or access your
          TravelAI account.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">3. AI features and images</h2>
        <p className="mt-4">
          When you request AI-powered destination suggestions, activity
          generation or planning assistance, the request data required for
          that feature, such as your travel preferences and trip context, is
          sent to OpenAI for processing. Please do not include sensitive
          personal information in AI prompts.
        </p>
        <p className="mt-4">
          TravelAI may use Pexels to retrieve destination and activity images.
          Your browser may connect to that provider when images are displayed.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">4. Payments</h2>
        <p className="mt-4">
          Payments, subscriptions and billing management are handled by
          Stripe. We receive payment status and billing identifiers needed to
          activate, manage or cancel your plan. TravelAI does not store full
          payment card details.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">5. Analytics</h2>
        <p className="mt-4">
          We use Vercel Web Analytics to understand aggregated usage, such as
          page views, referrers, device type and approximate location. Vercel
          Web Analytics is designed to work without third-party cookies and
          uses anonymised, aggregated measurement data.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">6. Retention, sharing and transfers</h2>
        <p className="mt-4">
          We retain account and trip data for as long as your account is active
          or it is needed to provide the service, meet legal obligations or
          resolve disputes. We share data only with service providers needed
          to operate TravelAI, including Supabase, OpenAI, Stripe, Vercel,
          Google and Pexels where applicable. Some providers may process data
          outside the European Economic Area using legally recognised transfer
          safeguards.
        </p>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white">7. Your rights</h2>
        <p className="mt-4">
          Subject to applicable law, you may request access, correction,
          deletion, restriction or portability of your personal data, or object
          to certain processing. You may also lodge a complaint with a data
          protection authority. Contact us at the email address above to make
          a request.
        </p>
      </section>
    </LegalPageShell>
  );
}
