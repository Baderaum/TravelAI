import { createClient } from "@/lib/supabase/server";
import { stripeRequest } from "@/lib/stripe";
import { NextResponse } from "next/server";

type PortalSession = {
  url: string | null;
};

export async function POST(request: Request) {
  try {
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
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    const origin = new URL(request.url).origin;
    const params = new URLSearchParams();

    params.set("customer", profile.stripe_customer_id);
    params.set("return_url", `${origin}/billing`);

    const session = await stripeRequest<PortalSession>(
      "/billing_portal/sessions",
      {
        method: "POST",
        body: params,
      }
    );

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe portal could not be created" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not open Stripe billing portal" },
      { status: 500 }
    );
  }
}
