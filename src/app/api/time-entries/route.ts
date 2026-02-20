import { NextResponse } from "next/server";
import { auth, SessionWithId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = await prisma.timeEntry.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null,
    },
  });
  return NextResponse.json({ entries });
}
