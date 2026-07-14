import Link from "next/link";
import { Compass } from "lucide-react";

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export function LegalPageShell({
  eyebrow,
  title,
  intro,
  children,
}: LegalPageShellProps) {
  return (
    <main className="travel-page-bg relative min-h-screen overflow-hidden text-white">
      <div className="travel-grid-overlay pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-300/[0.08] blur-[130px]" />

      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/[0.12] text-emerald-200">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold">TravelAI</p>
            <p className="text-xs text-neutral-400">Group Travel OS</p>
          </div>
        </Link>

        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-neutral-100 transition hover:bg-white/[0.1]"
        >
          Back home
        </Link>
      </nav>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-12 sm:px-10 sm:pt-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
            {intro}
          </p>
        </div>

        <article className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.045] p-7 text-[15px] leading-7 text-neutral-300 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-10">
          {children}
        </article>
      </section>
    </main>
  );
}
