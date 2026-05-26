"use client";

import { useState } from "react";
import { Settings, X, Users, CalendarDays, Type, FileText } from "lucide-react";

type TripSettingsProps = {
  tripId: string;
  title: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  members: any[];
};

export default function TripSettings({
  tripId,
  title,
  description,
  startDate,
  endDate,
  members,
}: TripSettingsProps) {
    const [open, setOpen] = useState(false);
    const [tripTitle, setTripTitle] = useState(title);
    const [tripDescription, setTripDescription] = useState(description || "");
    const [tripStart, setTripStart] = useState(startDate || "");
    const [tripEnd, setTripEnd] = useState(endDate || "");

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);

            const res = await fetch(`${window.location.origin}/api/update-trip-settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tripId,
                    title: tripTitle,
                    description: tripDescription,
                    startDate: tripStart,
                    endDate: tripEnd,
                }),
                });

            if (!res.ok) {
            throw new Error("Failed");
            }

            window.location.reload();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 shrink-0 rounded-2xl border border-white/10 bg-black/50 p-4 text-white backdrop-blur transition hover:bg-white/10"
      >
        <Settings className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[36px] border border-white/10 bg-[#0b0b0b] p-8 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-3xl font-semibold">Trip Settings</h2>
                <p className="mt-2 text-neutral-400">
                  Manage the basic information for this trip.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                  <Type className="h-4 w-4" />
                  Trip Title
                </label>
                <input
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                    <CalendarDays className="h-4 w-4" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tripStart}
                    onChange={(e) => setTripStart(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                    <CalendarDays className="h-4 w-4" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tripEnd}
                    onChange={(e) => setTripEnd(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                  <FileText className="h-4 w-4" />
                  Description
                </label>
                <textarea
                    value={tripDescription}
                    onChange={(e) => setTripDescription(e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                    placeholder="Describe this trip..."
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-400" />
                  <p className="font-medium">Friends</p>
                </div>

                <div className="space-y-3">
                  {members.length > 0 ? (
                    members.map((member: any) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between rounded-xl bg-black/40 px-4 py-3"
                      >
                        <span>
                          {member.profiles?.username ||
                            member.profiles?.email ||
                            "Unknown user"}
                        </span>

                        <span className="text-sm capitalize text-neutral-500">
                          {member.role}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">
                      No friends invited yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 px-5 py-3 text-neutral-300 transition hover:bg-white/10"
              >
                Cancel
              </button>

                 <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
                    >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}