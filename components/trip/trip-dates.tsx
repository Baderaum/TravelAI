import { CalendarDays } from "lucide-react";

type Props = {
  startDate?: string | null;
  endDate?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

export default function TripDates({
  startDate,
  endDate,
}: Props) {
  return (
    <div className="travel-card rounded-[28px] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10 text-sky-100">
          <CalendarDays className="h-5 w-5" />
        </span>

        <div>
          <h3 className="text-xl font-semibold">
            Trip Dates
          </h3>

          <p className="text-sm text-neutral-400">
            Read-only schedule
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Start
          </p>
          <p className="mt-1 text-lg font-medium">
            {formatDate(startDate)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            End
          </p>
          <p className="mt-1 text-lg font-medium">
            {formatDate(endDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
