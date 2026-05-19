import { Destination } from "./page";
import { DestinationCard } from "./destination-card";

type Props = {
  results: Destination[];
  onSelect: (destination: Destination) => void;
};

export function ResultsGrid({
  results,
  onSelect,
}: Props) {
  if (results.length === 0) return null;

  return (
    <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
      {results.map((destination, index) => (
        <DestinationCard
          key={index}
          destination={destination}
          onClick={() => onSelect(destination)}
        />
      ))}
    </div>
  );
}