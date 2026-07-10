"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const supabase = createClient();

    const [isRedirecting, setIsRedirecting] =
        useState(true);
    const redirectStarted = useRef(false);

    async function signIn() {
        setIsRedirecting(true);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
            redirectTo: `${window.location.origin}/auth/callback`
            },
        });

        if (error) {
            console.error(error);
            setIsRedirecting(false);
        }
    }

    useEffect(() => {
        if (redirectStarted.current) return;

        redirectStarted.current = true;
        signIn();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-10">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8">

            <h1 className="text-4xl font-bold text-white">
            Redirecting to Google
            </h1>

            <p className="mt-4 text-neutral-400">
            You will be redirected automatically.
            </p>

            <button
            onClick={signIn}
            disabled={isRedirecting}
            className="mt-6 w-full cursor-pointer rounded-2xl bg-white py-4 font-semibold text-black transition hover:scale-[1.02] hover:bg-neutral-200 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            >
            {isRedirecting
                ? "Opening Google..."
                : "Continue with Google"}
            </button>
        </div>
        </div>
    );
}
