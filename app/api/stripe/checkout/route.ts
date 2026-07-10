import { createClient } from "@/lib/supabase/server";
import {
  getStripePriceId,
  stripeRequest,
  type StripePlan,
} from "@/lib/stripe";
import { NextResponse } from "next/server";

type CheckoutSession = {
  url: string | null;
};

function isStripePlan(plan: unknown): plan is StripePlan {
  return plan === "Monthly" || plan === "Lifetime";
}

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

    const { plan } = await request.json();

    if (!isStripePlan(plan)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    const origin = new URL(request.url).origin;
    const params = new URLSearchParams();
    const mode =
      plan === "Monthly" ? "subscription" : "payment";

    params.set("mode", mode);
    params.set("line_items[0][price]", getStripePriceId(plan));
    params.set("line_items[0][quantity]", "1");
    params.set("success_url", `${origin}/billing?checkout=success`);
    params.set("cancel_url", `${origin}/billing?checkout=cancelled`);
    params.set("client_reference_id", user.id);
    params.set("metadata[userId]", user.id);
    params.set("metadata[plan]", plan);
    params.set("allow_promotion_codes", "true");

    if (profile?.stripe_customer_id) {
      params.set("customer", profile.stripe_customer_id);
    } else if (user.email) {
      params.set("customer_email", user.email);
    }

    if (plan === "Monthly") {
      params.set("subscription_data[metadata][userId]", user.id);
      params.set("subscription_data[metadata][plan]", plan);
    } else {
      params.set("payment_intent_data[metadata][userId]", user.id);
      params.set("payment_intent_data[metadata][plan]", plan);
    }

    const session = await stripeRequest<CheckoutSession>(
      "/checkout/sessions",
      {
        method: "POST",
        body: params,
      }
    );

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe checkout could not be created" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not start Stripe checkout" },
      { status: 500 }
    );
  }
}
