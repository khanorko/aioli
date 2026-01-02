import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, getBaseUrl } from "@/lib/stripe";
import { getUserById, updateUser } from "@/lib/db";

// Credit packages with prices in ore (Swedish cents)
const CREDIT_PACKAGES: Record<string, { credits: number; priceOre: number; name: string }> = {
  starter: { credits: 1, priceOre: 4900, name: "Starter - 1 credit" },
  website: { credits: 5, priceOre: 14900, name: "Website - 5 credits" },
  agency: { credits: 15, priceOre: 29900, name: "Agency - 15 credits" },
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const { packageId } = await request.json();

    if (!packageId || !CREDIT_PACKAGES[packageId]) {
      return NextResponse.json(
        { error: "Invalid package" },
        { status: 400 }
      );
    }

    const creditPackage = CREDIT_PACKAGES[packageId];
    const user = await getUserById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
      await updateUser(user.id, { stripeCustomerId: customerId });
    }

    const baseUrl = getBaseUrl();

    // Create checkout session for one-time payment
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: `Aioli™ Credits - ${creditPackage.name}`,
              description: `${creditPackage.credits} credits to unlock analysis results`,
            },
            unit_amount: creditPackage.priceOre,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?success=true&credits=${creditPackage.credits}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      metadata: {
        userId: user.id,
        packageId,
        credits: creditPackage.credits.toString(),
      },
      locale: "en",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not create payment session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
