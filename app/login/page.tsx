"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const supabase = createClient();

    const [email, setEmail] =
        useState("");

    async function signIn() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
            redirectTo:
                "http://localhost:3000/auth/callback",
            },
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-10">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8">

            <h1 className="text-4xl font-bold text-white">
            Login
            </h1>

            <button
            onClick={signIn}
            className="mt-6 w-full cursor-pointer rounded-2xl bg-white py-4 font-semibold text-black transition hover:scale-[1.02] hover:bg-neutral-200 active:scale-[0.98]"
            >
            Continue with Google
            </button>
        </div>
        </div>
    );
}