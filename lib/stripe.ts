import crypto from "node:crypto";

export type StripePlan =
  | "Monthly"
  | "Lifetime"
  | "LiveTest";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return key;
}

export function getStripePriceId(plan: StripePlan) {
  const priceId =
    plan === "Monthly"
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : plan === "Lifetime"
      ? process.env.STRIPE_LIFETIME_PRICE_ID
      : process.env.STRIPE_LIVE_TEST_PRICE_ID;

  if (!priceId) {
    throw new Error(
      `Missing Stripe price id for ${plan}`
    );
  }

  return priceId;
}

export async function stripeRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    body?: URLSearchParams;
  } = {}
) {
  const response = await fetch(
    `${STRIPE_API_BASE}${path}`,
    {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${getStripeSecretKey()}`,
        ...(options.body
          ? {
              "Content-Type":
                "application/x-www-form-urlencoded",
            }
          : {}),
      },
      body: options.body,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Stripe request failed"
    );
  }

  return data as T;
}

export function verifyStripeSignature(
  payload: string,
  signatureHeader: string | null,
  webhookSecret: string
) {
  if (!signatureHeader) return false;

  const parts = signatureHeader.split(",");
  const timestamp = parts
    .find((part) => part.startsWith("t="))
    ?.slice(2);
  const signature = parts
    .find((part) => part.startsWith("v1="))
    ?.slice(3);

  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(
    expectedSignature,
    "hex"
  );
  const receivedBuffer = Buffer.from(signature, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}
