import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } =
    new URL(request.url);

  const code =
    searchParams.get("code");

  if (code) {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.exchangeCodeForSession(
        code
      );

    if (user) {

      const { data: existingProfile } =
        await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

      if (!existingProfile) {

        await supabase
          .from("profiles")
          .insert({
            id: user.id,

            username:
              user.user_metadata.full_name,

            avatar_url:
              user.user_metadata.avatar_url,

            email:
              user.email,
          });
      }
    }
  }

  return NextResponse.redirect(origin);
}