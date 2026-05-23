"use client";

import { useState } from "react";

type Props = {
  tripId: string;

  members: any[];
};

export default function InviteMember({
  tripId,
  members,
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

        setLoading(false);

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

        <div className="flex items-center justify-between">

        <h3 className="text-2xl font-semibold text-white">
            Members
        </h3>

        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-neutral-300">
            {members?.length || 0}
        </span>

        </div>

        {/* INVITE */}
        <div className="mt-6 flex gap-3">

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

        {/* MEMBERS */}
        <div className="mt-6 space-y-3">

        {members?.map((member: any) => (

            <div
            key={member.profiles.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4"
            >

            <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">


                {member.profiles.email
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                <p className="font-medium text-white">
                    {member.profiles.email}
                </p>

                <p className="text-sm text-neutral-500 capitalize">
                    {member.role}
                </p>

                </div>

            </div>

            </div>

        ))}

        </div>

    </div>

    );
}