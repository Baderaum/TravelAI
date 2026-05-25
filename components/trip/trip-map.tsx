"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

type Props = {
  lat?: number;
  lng?: number;
};

export default function TripMap({
  lat,
  lng,
}: Props) {
  if (!lat || !lng) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500">
        No map data
      </div>
    );
  }

  return (
    <ComposableMap
      projectionConfig={{
        scale: 900,
        center: [lng, lat],
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
        {({ geographies }) =>
          geographies.map((geo: any) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#1f2937"
              stroke="#111827"
              strokeWidth={0.4}
              style={{
                default: { outline: "none" },
                hover: { fill: "#374151", outline: "none" },
                pressed: { outline: "none" },
              }}
            />
          ))
        }
      </Geographies>

      <Marker coordinates={[lng, lat]}>
        <circle
          r={7}
          fill="#22c55e"
          stroke="#fff"
          strokeWidth={2}
        />
      </Marker>
    </ComposableMap>
  );
}