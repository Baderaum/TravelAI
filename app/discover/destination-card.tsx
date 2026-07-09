import { Destination } from "./page";

type Props = {
  destination: Destination;
  onClick: () => void;
};

export function DestinationCard({
  destination,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-[32px] border border-white/10 bg-white/5 transition hover:scale-[1.01] hover:border-white/20"
    >
      <div className="relative h-64">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        <div className="absolute bottom-5 left-5">
          <h2 className="text-3xl font-bold text-white">
            {destination.name}
          </h2>

          <p className="mt-1 text-sm text-neutral-300">
            Match Score: {destination.match_score}%
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-neutral-300">
          {destination.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {destination.flight_budget && (
            <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm text-green-300">
              Est. flight EUR {destination.flight_budget}
            </div>
          )}

          {destination.vibes?.map(
            (vibe, vibeIndex) => (
              <div
                key={vibeIndex}
                className="rounded-full bg-white/10 px-3 py-1 text-sm text-white"
              >
                {vibe}
              </div>
            )
          )}
        </div>

        <button className="mt-8 w-full rounded-2xl bg-white py-3 font-medium text-black transition hover:scale-[1.02]">
          Create Trip
        </button>
      </div>
    </div>
  );
}
