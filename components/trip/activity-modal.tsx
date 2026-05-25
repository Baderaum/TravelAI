"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Activity = {
  id?: string;
  title: string;
  description: string;
  image?: string | null;
  location?: string | null;
  start_time?: string | null;
  end_time?: string | null;
};

type Props = {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (activityId: string) => void;
  onUpdateTime?: (
    activityId: string,
    startTime: string,
    endTime: string
  ) => void;
};

export default function ActivityModal({
  activity,
  open,
  onOpenChange,
  onDelete,
  onUpdateTime,
}: Props) {
  const [startTime, setStartTime] = useState(
    activity?.start_time?.slice(0, 16) || ""
  );

  const [endTime, setEndTime] = useState(
    activity?.end_time?.slice(0, 16) || ""
  );

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full !max-w-4xl overflow-y-auto rounded-[32px] border border-white/10 bg-black p-0 text-white shadow-[0_0_120px_rgba(34,197,94,0.15)]">
        <DialogTitle className="sr-only">
          Activity Details
        </DialogTitle>

        <DialogDescription className="sr-only">
          View and edit activity details.
        </DialogDescription>

        <div className="overflow-hidden rounded-[28px]">
          <div className="relative h-[300px] w-full">
            {activity.image && (
              <img
                src={activity.image}
                alt={activity.title}
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8">
              <p className="mb-3 w-fit rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-300">
                Activity
              </p>

              <h2 className="text-5xl font-bold">
                {activity.title}
              </h2>
            </div>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h3 className="text-3xl font-semibold">
                About
              </h3>

              <p className="mt-4 text-lg leading-8 text-neutral-300">
                {activity.description}
              </p>

              {activity.location && (
                <p className="mt-6 text-neutral-400">
                  📍 {activity.location}
                </p>
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-2xl font-semibold">
                  Schedule
                </h3>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="mb-2 text-sm text-neutral-500">
                      Start
                    </p>

                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) =>
                        setStartTime(e.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-neutral-500">
                      End
                    </p>

                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) =>
                        setEndTime(e.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!activity.id) return;

                      onUpdateTime?.(
                        activity.id,
                        startTime,
                        endTime
                      );

                      onOpenChange(false);
                    }}
                    className="w-full rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200"
                  >
                    Save Time
                  </button>
                </div>
              </div>

              {activity.id && (
                <button
                  onClick={() => {
                    onDelete?.(activity.id!);
                    onOpenChange(false);
                  }}
                  className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-medium text-red-300 transition hover:bg-red-500/20"
                >
                  Delete Activity
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}