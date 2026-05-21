"use client";

import { useState } from "react";

type Props = {
  tripId: string;
};

export default function InviteMember({
  tripId,
}: Props) {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function inviteMember() {

    if (!email) return;

    setLoading(true);

    setMessage("");

    try {

      const res =
        await fetch(
          "/api/invite-member",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              tripId,
              email,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        setMessage(
          data.error
        );

        return;
      }

      setMessage(
        "Member invited 😄"
      );

      setEmail("");

    } catch (error) {

      console.error(error);

      setMessage(
        "Something went wrong"
      );
    }

    setLoading(false);
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">

      <h3 className="text-2xl font-semibold text-white">
        Invite Member
      </h3>

      <div className="mt-5 flex gap-3">

        <input
          type="email"
          placeholder="friend@email.com"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="flex-1 rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-neutral-500"
        />

        <button
          onClick={inviteMember}
          disabled={loading}
          className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {loading
            ? "Inviting..."
            : "Invite"}
        </button>

      </div>

      {message && (

        <p className="mt-4 text-sm text-neutral-400">
          {message}
        </p>

      )}

    </div>
  );
}