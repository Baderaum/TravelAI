"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

type Activity = {
  id: string;
  title: string;
  image?: string | null;
  lat?: number | null;
  lng?: number | null;
};

type Props = {
  lat?: number;
  lng?: number;
  activities?: Activity[];
};

export default function TripMap({
  lat,
  lng,
  activities = [],
}: Props) {
  const hasCoordinates =
    typeof lat === "number" &&
    typeof lng === "number";

  if (!hasCoordinates) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500">
        No map data
      </div>
    );
  }

  const activitiesWithLocation =
    activities.filter(
      (activity) => activity.lat && activity.lng
    );

  return (
    <ComposableMap
      projectionConfig={{
        scale: 1750,
        center: [
          Number(lng),
          Number(lat),
        ],
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >

      <ZoomableGroup
        center={[
          Number(lng),
          Number(lat),
        ]}
        zoom={1}
        minZoom={1}
        maxZoom={8}
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

        <Marker
          coordinates={[
            Number(lng),
            Number(lat),
          ]}
        >
          <circle
            r={7}
            fill="#22c55e"
            stroke="#fff"
            strokeWidth={2}
          />
        </Marker>

        {activitiesWithLocation.map((activity) => (
          <Marker
            key={activity.id}
            coordinates={[
              activity.lng as number,
              activity.lat as number,
            ]}
          >
            <circle
              r={13}
              fill="#111827"
              stroke="#22c55e"
              strokeWidth={2}
            />

            <text
              textAnchor="middle"
              y={4}
              fontSize={10}
              fill="white"
            >
              📍
            </text>
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
}