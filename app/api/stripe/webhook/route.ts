import { createAdminClient } from "@/lib/supabase/admin";
import {
  stripeRequest,
  verifyStripeSignature,
} from "@/lib/stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
};

type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  items?: {
    data?: {
      price?: {
        id?: string;
      };
    }[];
  };
  metadata?: {
    userId?: string;
  };
};

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : null;
}

function unixToIso(value?: number | null) {
  return value
    ? new Date(value * 1000).toISOString()
    : null;
}

function getMetadata(object: Record<string, unknown>) {
  return (object.metadata || {}) as Record<string, string>;
}

async function getSubscription(subscriptionId: string) {
  return stripeRequest<StripeSubscription>(
    `/subscriptions/${subscriptionId}`
  );
}

async function findProfileByStripeReference(
  supabase: ReturnType<typeof createAdminClient>,
  reference: {
    userId?: string | null;
    customerId?: string | null;
    subscriptionId?: string | null;
  }
) {
  if (reference.userId) {
    const { data } = await supabase
      .from("profiles")
      .select("id, plan")
      .eq("id", reference.userId)
      .maybeSingle();

    if (data) return data;
  }

  if (reference.subscriptionId) {
    const { data } = await supabase
      .from("profiles")
      .select("id, plan")
      .eq("stripe_subscription_id", reference.subscriptionId)
      .maybeSingle();

    if (data) return data;
  }

  if (reference.customerId) {
    const { data } = await supabase
      .from("profiles")
      .select("id, plan")
      .eq("stripe_customer_id", reference.customerId)
      .maybeSingle();

    if (data) return data;
  }

  return null;
}

async function syncSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: StripeSubscription
) {
  const subscriptionId = subscription.id;
  const customerId = asString(subscription.customer);
  const userId = subscription.metadata?.userId ?? null;
  const priceId =
    subscription.items?.data?.[0]?.price?.id ?? null;
  const isActive =
    subscription.status === "active" ||
    subscription.status === "trialing";

  const profile = await findProfileByStripeReference(
    supabase,
    {
      userId,
      customerId,
      subscriptionId,
    }
  );

  if (!profile) return;

  await supabase
    .from("profiles")
    .update({
      plan:
        isActive || profile.plan === "Lifetime"
          ? profile.plan === "Lifetime"
            ? "Lifetime"
            : "Monthly"
          : "Free",
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: priceId,
      subscription_status: subscription.status,
      current_period_end: unixToIso(
        subscription.current_period_end
      ),
      cancel_at_period_end: Boolean(
        subscription.cancel_at_period_end
      ),
      plan_updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createAdminClient>,
  session: Record<string, unknown>
) {
  const metadata = getMetadata(session);
  const userId = metadata.userId;
  const plan = metadata.plan;
  const customerId = asString(session.customer);
  const subscriptionId = asString(session.subscription);
  const paymentStatus = asString(session.payment_status);

  if (!userId) return;

  if (plan === "Lifetime" && paymentStatus === "paid") {
    await supabase
      .from("profiles")
      .update({
        plan: "Lifetime",
        stripe_customer_id: customerId,
        stripe_subscription_id: null,
        stripe_price_id:
          process.env.STRIPE_LIFETIME_PRICE_ID ?? null,
        subscription_status: null,
        current_period_end: null,
        cancel_at_period_end: false,
        lifetime_paid_at: new Date().toISOString(),
        plan_updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return;
  }

  if (plan === "Monthly" && subscriptionId) {
    const subscription =
      await getSubscription(subscriptionId);

    await syncSubscription(supabase, subscription);

    return;
  }

  if (customerId) {
    await supabase
      .from("profiles")
      .update({
        stripe_customer_id: customerId,
        plan_updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  }
}

async function handleInvoicePaid(
  supabase: ReturnType<typeof createAdminClient>,
  invoice: Record<string, unknown>
) {
  const subscriptionId = asString(invoice.subscription);

  if (!subscriptionId) return;

  const subscription = await getSubscription(subscriptionId);

  await syncSubscription(supabase, subscription);
}

async function handleInvoiceFailed(
  supabase: ReturnType<typeof createAdminClient>,
  invoice: Record<string, unknown>
) {
  const subscriptionId = asString(invoice.subscription);
  const customerId = asString(invoice.customer);

  const profile = await findProfileByStripeReference(
    supabase,
    {
      customerId,
      subscriptionId,
    }
  );

  if (!profile) return;

  await supabase
    .from("profiles")
    .update({
      subscription_status: "past_due",
      plan_updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Record<string, unknown>
) {
  const subscriptionId = asString(subscription.id);
  const customerId = asString(subscription.customer);

  const profile = await findProfileByStripeReference(
    supabase,
    {
      customerId,
      subscriptionId,
    }
  );

  if (!profile) return;

  await supabase
    .from("profiles")
    .update({
      plan:
        profile.plan === "Lifetime" ? "Lifetime" : "Free",
      stripe_subscription_id: null,
      subscription_status: "canceled",
      current_period_end: null,
      cancel_at_period_end: false,
      plan_updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
}

async function handlePaymentIntentSucceeded(
  supabase: ReturnType<typeof createAdminClient>,
  paymentIntent: Record<string, unknown>
) {
  const metadata = getMetadata(paymentIntent);

  if (metadata.plan !== "Lifetime" || !metadata.userId) {
    return;
  }

  await supabase
    .from("profiles")
    .update({
      plan: "Lifetime",
      stripe_customer_id: asString(
        paymentIntent.customer
      ),
      stripe_subscription_id: null,
      stripe_price_id:
        process.env.STRIPE_LIFETIME_PRICE_ID ?? null,
      subscription_status: null,
      current_period_end: null,
      cancel_at_period_end: false,
      lifetime_paid_at: new Date().toISOString(),
      plan_updated_at: new Date().toISOString(),
    })
    .eq("id", metadata.userId);
}

export async function POST(request: Request) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook secret" },
      { status: 500 }
    );
  }

  const payload = await request.text();
  const signature = request.headers.get(
    "stripe-signature"
  );

  if (
    !verifyStripeSignature(
      payload,
      signature,
      webhookSecret
    )
  ) {
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  const event = JSON.parse(payload) as StripeEvent;
  const supabase = createAdminClient();

  const { data: existingEvent } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();

  if (existingEvent) {
    return NextResponse.json({ received: true });
  }

  const object = event.data.object;

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(supabase, object);
    }

    if (event.type === "invoice.paid") {
      await handleInvoicePaid(supabase, object);
    }

    if (event.type === "invoice.payment_failed") {
      await handleInvoiceFailed(supabase, object);
    }

    if (event.type === "customer.subscription.updated") {
      await syncSubscription(
        supabase,
        object as unknown as StripeSubscription
      );
    }

    if (event.type === "customer.subscription.deleted") {
      await handleSubscriptionDeleted(supabase, object);
    }

    if (event.type === "payment_intent.succeeded") {
      await handlePaymentIntentSucceeded(
        supabase,
        object
      );
    }

    await supabase.from("stripe_events").insert({
      id: event.id,
      type: event.type,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
