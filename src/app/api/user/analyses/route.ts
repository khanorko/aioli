import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserAnalyses, getUserById } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Du måste vara inloggad" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    // Check if user is Pro
    const user = await getUserById(userId);
    if (!user || user.subscriptionStatus !== "pro") {
      return NextResponse.json(
        { error: "Historik är endast tillgängligt för Pro-användare" },
        { status: 403 }
      );
    }

    const analyses = await getUserAnalyses(userId);

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta analyser" },
      { status: 500 }
    );
  }
}
