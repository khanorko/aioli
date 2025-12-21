import { NextRequest, NextResponse } from "next/server";
import { stripe, getBaseUrl } from "@/lib/stripe";
import { getUserByEmail, createUser, updateUser } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-postadress krävs" },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser(email);
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
      await updateUser(user.id, { stripeCustomerId: customerId });
    }

    const baseUrl = getBaseUrl();

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/?canceled=true`,
      metadata: {
        userId: user.id,
      },
      locale: "sv",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Kunde inte skapa betalningssession" },
      { status: 500 }
    );
  }
}
