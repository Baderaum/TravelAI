import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Compass,
  MapPinned,
  Route,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";

import PricingCards from "@/components/landing/pricing-cards";
import { SiteFooter } from "@/components/legal/site-footer";
import activitiesScreenshot from "@/screenshots/Activities.png";
import discoveryResultsScreenshot from "@/screenshots/Discovery_Results.png";
import tripScreenshot from "@/screenshots/Trip.png";

const workflow = [
  {
    title: "Discover destinations",
    description:
      "Search worldwide or focus on a target country. TravelAI matches ideas to budget, group type, distance and vibe.",
    icon: Search,
  },
  {
    title: "Create a trip workspace",
    description:
      "Turn a recommendation into a shared trip with dates, members, activities, flights, budget and status tracking.",
    icon: MapPinned,
  },
  {
    title: "Plan with AI",
    description:
      "Generate activities, enrich details, plan timing and turn loose ideas into a day-by-day itinerary.",
    icon: Sparkles,
  },
  {
    title: "Estimate the full budget",
    description:
      "Bring flight estimates, activities, hotel input and daily spending into one clean planning view.",
    icon: Wallet,
  },
];

const features = [
  "AI destination matching",
  "Trip workspaces",
  "Activity generation",
  "Flight budget estimates",
  "Calendar and itinerary views",
  "Group member planning",
];

function ProductPreview() {
  return (
    <div className="landing-float relative mx-auto w-full max-w-6xl rounded-[36px] border border-white/15 bg-[#111]/95 p-3 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-300/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-300/80" />
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 text-xs text-neutral-300">
            Trip workspace
          </div>
        </div>

        <div className="relative">
          <Image
            src={tripScreenshot}
            alt="TravelAI trip workspace with planning center, dates, activities and budget cards"
            className="h-auto w-full"
            sizes="(max-width: 1280px) 94vw, 1152px"
            placeholder="blur"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </div>
      </div>
    </div>
  );
}

function ProductScreenshots() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-10">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">
          Product in action
        </p>
        <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          From the first idea to a planned trip.
        </h2>
        <p className="mt-5 text-lg leading-8 text-neutral-300">
          The product is built around the real planning flow: find a
          destination, create a workspace and let AI help with activities,
          timing and budget.
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.045] p-7">
            <Search className="h-7 w-7 text-emerald-200" />
            <h3 className="mt-6 text-3xl font-bold">
              Discover destinations that match the group.
            </h3>
            <p className="mt-4 leading-8 text-neutral-300">
              Users can search for travel ideas, compare match scores and
              quickly turn the best result into a real trip workspace.
            </p>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-white/12 bg-black shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
            <Image
              src={discoveryResultsScreenshot}
              alt="TravelAI discovery results with destination cards and match scores"
              className="h-auto w-full"
              sizes="(max-width: 1024px) 94vw, 760px"
              placeholder="blur"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.28fr_0.72fr] lg:items-center">
          <div className="overflow-hidden rounded-[34px] border border-white/12 bg-black shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
            <Image
              src={activitiesScreenshot}
              alt="TravelAI activities list with AI generated activities, costs and timing"
              className="h-auto w-full"
              sizes="(max-width: 1024px) 94vw, 760px"
              placeholder="blur"
            />
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.045] p-7">
            <Sparkles className="h-7 w-7 text-emerald-200" />
            <h3 className="mt-6 text-3xl font-bold">
              Build the plan with AI, then refine it together.
            </h3>
            <p className="mt-4 leading-8 text-neutral-300">
              Activities can include time, location, estimated costs and group
              votes, so the itinerary becomes easier to decide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main className="travel-page-bg relative min-h-screen overflow-hidden text-white">
      <div className="travel-grid-overlay pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-300/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-[-220px] top-[1180px] h-[640px] w-[640px] rounded-full bg-emerald-400/[0.09] blur-[130px]" />
      <div className="pointer-events-none absolute right-[-260px] top-[1500px] h-[720px] w-[720px] rounded-full bg-amber-300/[0.085] blur-[150px]" />
      <div className="pointer-events-none absolute left-1/2 top-[2300px] h-[760px] w-[920px] -translate-x-1/2 rounded-full bg-sky-400/[0.055] blur-[165px]" />
      <div className="pointer-events-none absolute bottom-[-220px] left-1/2 h-[680px] w-[760px] -translate-x-1/2 rounded-full bg-emerald-300/[0.07] blur-[150px]" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/[0.12] text-emerald-200">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold">TravelAI</p>
            <p className="text-xs text-neutral-400">Group Travel OS</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-neutral-300 md:flex">
          <a href="#product" className="transition hover:text-white">
            Product
          </a>
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
        </div>

        <Link
          href="/discover"
          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          Open App
        </Link>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-12 sm:px-10 lg:pt-20">
        <div className="landing-fade-up mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm text-emerald-100">
            <Sparkles className="h-4 w-4" />
            AI travel planning from discovery to budget
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Plan group trips without the chaos.
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            TravelAI helps groups find destinations, create trip workspaces,
            generate activities, build itineraries and estimate costs from
            flights to the final night out.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
            >
              Try discovery
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
            >
              View pricing
            </a>
          </div>
        </div>

        <div className="mt-14">
          <ProductPreview />
        </div>
      </section>

      <section
        id="product"
        className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-10"
      >
        <div className="grid gap-5 md:grid-cols-4">
          {workflow.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="landing-fade-up travel-card-hover rounded-[28px] border border-white/10 bg-white/[0.045] p-6"
                style={{
                  animationDelay: `${index * 90}ms`,
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-emerald-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-neutral-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">
            Product
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            One place for the messy parts of group travel.
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-300">
            Instead of splitting planning across chats, spreadsheets, booking
            tabs and random notes, TravelAI turns each trip into a structured
            workspace.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.045] p-5"
            >
              <Check className="h-5 w-5 shrink-0 text-emerald-200" />
              <span className="font-medium text-neutral-100">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <ProductScreenshots />

      <section
        id="pricing"
        className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-10"
      >
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">
              Pricing
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Start free. Upgrade when you want to build the trip.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-300">
              Free users can explore destinations. The paid plan unlocks the
              full planning workspace, advanced filters and AI-powered trip
              building.
            </p>
          </div>

          <PricingCards />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 sm:px-10">
        <div className="rounded-[36px] border border-white/10 bg-white/[0.055] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
            <Route className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-4xl font-bold">
            Turn the next group chat into a real trip.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-neutral-300">
            Start with discovery, pick a destination and let TravelAI help with
            the plan, timing and budget.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-black transition hover:bg-neutral-200"
            >
              Open TravelAI
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
