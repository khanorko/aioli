import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export function getBaseUrl() {
  // Use custom domain in production
  if (process.env.NODE_ENV === "production") {
    return "https://aioli-one.vercel.app";
  }
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}
