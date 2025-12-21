import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    analysesPerMonth: 3,
  },
  PRO: {
    name: "Pro",
    price: 299,
    analysesPerMonth: -1, // Unlimited
  },
} as const;

export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}
