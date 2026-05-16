"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

type Destination = {
  name: string;
  summary: string;
  match_score: number;
  estimated_budget: number;
  best_for: string;
  vibes: string[];
};

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Destination[]>([]);

  async function generateTrip() {
    if (!prompt) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const text = await res.text();

      console.log("API RESPONSE:", text);

      const data = JSON.parse(text);

      setResults(data.destinations || []);
    } catch (error) {
      console.error("FRONTEND ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20">
        <div className="mb-12 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300">
          <Sparkles className="h-4 w-4" />
          AI Travel Planner
        </div>

        <h1 className="max-w-4xl text-center text-5xl font-bold tracking-tight md:text-7xl">
          Describe your{" "}
          <span className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            perfect trip.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-center text-lg text-neutral-400">
          Get destination ideas, activities and travel recommendations in
          seconds.
        </p>

        <div className="mt-12 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="We are 4 friends from Frankfurt looking for beach, nightlife and cheap flights in July..."
            className="min-h-[140px] w-full resize-none bg-transparent p-4 text-lg outline-none placeholder:text-neutral-500"
          />

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <p className="text-sm text-neutral-500">
              Powered by AI recommendations
            </p>

            <button
              onClick={generateTrip}
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Trip
                </>
              )}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-16 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((destination, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {destination.name}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-400">
                      Match Score: {destination.match_score}%
                    </p>
                  </div>

                  <div className="rounded-full bg-white/10 px-3 py-1 text-sm">
                    €{destination.estimated_budget}
                  </div>
                </div>

                <p className="mt-5 text-neutral-300">
                  {destination.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {destination.vibes?.map((vibe, vibeIndex) => (
                    <span
                      key={vibeIndex}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-neutral-300"
                    >
                      {vibe}
                    </span>
                  ))}
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-sm text-neutral-400">
                    Best for: {destination.best_for}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}