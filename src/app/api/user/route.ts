import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById, initDb } from "@/lib/db";

let dbInitialized = false;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Inte inloggad" },
        { status: 401 }
      );
    }

    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const user = await getUserById(session.user.id);

    if (!user) {
      return NextResponse.json({
        credits: 0,
      });
    }

    return NextResponse.json({
      credits: user.credits,
    });
  } catch (error) {
    console.error("User status error:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta användarstatus" },
      { status: 500 }
    );
  }
}
