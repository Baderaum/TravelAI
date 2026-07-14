import Link from "next/link";

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cancellation", label: "Cancellation" },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10">
      <div className="border-t border-white/10 pt-7">
        <div className="flex flex-col gap-5 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TravelAI. All rights reserved.</p>

          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Legal">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
