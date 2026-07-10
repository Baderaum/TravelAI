import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DAILY_DISCOVERY_LIMIT = 5;

function getUtcDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please Login" },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan =
    profile?.plan === "Monthly" ||
    profile?.plan === "Lifetime"
      ? profile.plan
      : "Free";

  if (plan !== "Free") {
    return NextResponse.json({
      plan,
      unlimited: true,
      used: 0,
      limit: null,
      remaining: null,
    });
  }

  const { data: usage } = await supabase
    .from("discovery_usage")
    .select("used_count")
    .eq("user_id", user.id)
    .eq("usage_date", getUtcDateKey())
    .maybeSingle();

  const used = usage?.used_count ?? 0;

  return NextResponse.json({
    plan,
    unlimited: false,
    used,
    limit: DAILY_DISCOVERY_LIMIT,
    remaining: Math.max(
      DAILY_DISCOVERY_LIMIT - used,
      0
    ),
  });
}
