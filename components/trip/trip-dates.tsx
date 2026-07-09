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
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-5 w-5 text-green-400" />

        <h3 className="text-xl font-semibold">
          Trip Dates
        </h3>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Start
          </p>
          <p className="mt-1 text-lg font-medium">
            {formatDate(startDate)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
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
