"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";

import AskDialog from "@/components/ui/ask-dialog";

export type TripCardStatus =
  | "planning"
  | "planned"
  | "active"
  | "completed"
  | "archived";

export type TripCardTrip = {
  id: string;
  title: string;
  destination: string | null;
  cover_image: string | null;
  status: string;
  role?: string;
};

const statusOptions: {
  value: TripCardStatus;
  label: string;
}[] = [
  { value: "planning", label: "Planning" },
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

function formatStatus(status: string) {
  const option = statusOptions.find(
    (item) => item.value === status
  );

  return option?.label || status;
}

export default function TripCard({
  trip,
}: {
  trip: TripCardTrip;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(trip.status);
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleted, setDeleted] = useState(false);
  const isOwner = trip.role === "owner";

  async function updateStatus(nextStatus: string) {
    setSavingStatus(true);
    setStatus(nextStatus);

    try {
      const response = await fetch("/api/update-trip-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip.id,
          status: nextStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update trip status");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus(trip.status);
    } finally {
      setSavingStatus(false);
    }
  }

  async function deleteTrip() {
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const response = await fetch("/api/delete-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete trip");
      }

      setDeleted(true);
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete trip"
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  if (deleted) {
    return null;
  }

  return (
    <>
      <article className="travel-card-hover group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.055]">
        <Link
          href={`/trip/${trip.id}`}
          className="block"
        >
          <div className="relative h-64 w-full overflow-hidden">
            {trip.cover_image ? (
              <img
                src={trip.cover_image}
                alt={trip.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(135deg,#161616,#2a2415)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/[0.35] to-black/5" />

            <div className="absolute bottom-0 left-0 p-6">
              <span className="rounded-full border border-white/[0.15] bg-white/[0.15] px-3 py-1 text-sm text-white backdrop-blur">
                {formatStatus(status)}
              </span>

              <h2 className="mt-4 text-3xl font-bold text-white">
                {trip.title}
              </h2>

              <p className="mt-2 text-neutral-300">
                {trip.destination}
              </p>
            </div>
          </div>
        </Link>

        <div className="border-t border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Group Trip
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {formatStatus(status)}
              </div>
            </div>

            <Link
              href={`/trip/${trip.id}`}
              aria-label={`Open ${trip.title}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white transition hover:border-white/20 hover:bg-white/10"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="sr-only" htmlFor={`status-${trip.id}`}>
              Trip status
            </label>
            <select
              id={`status-${trip.id}`}
              value={status}
              disabled={savingStatus}
              onChange={(event) => updateStatus(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 disabled:opacity-50"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-neutral-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
              aria-label={isOwner ? `Delete ${trip.title}` : `Leave ${trip.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <MoreHorizontal className="hidden h-4 w-4 text-neutral-500" />
          </div>
        </div>
      </article>

      <AskDialog
        open={deleteOpen}
        title={isOwner ? "Delete trip?" : "Leave trip?"}
        question={
          deleteError ||
          (isOwner
            ? `Do you really want to delete "${trip.title}"? This removes the trip, members, activities and planning data.`
            : `Do you really want to leave "${trip.title}"? The trip will stay available for the owner and other members.`)
        }
        yesLabel={isOwner ? "Delete" : "Leave"}
        noLabel="Cancel"
        loading={deleteLoading}
        onAnswer={async (answer) => {
          if (answer === "yes") {
            await deleteTrip();
            return;
          }

          setDeleteOpen(false);
        }}
      />
    </>
  );
}
