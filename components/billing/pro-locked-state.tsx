import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function ProLockedState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-10 text-white">
      <div className="max-w-xl rounded-[36px] border border-red-400/25 bg-red-500/[0.045] p-10 text-center shadow-[0_24px_90px_rgba(0,0,0,0.32)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-300/25 bg-red-500/10 text-red-100">
          <LockKeyhole className="h-7 w-7" />
        </div>

        <h1 className="mt-6 text-4xl font-bold">
          {title}
        </h1>

        <p className="mt-4 leading-7 text-neutral-300">
          {description}
        </p>

        <Link
          href="/billing"
          className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-neutral-200"
        >
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}
