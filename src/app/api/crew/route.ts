import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, include: { crew: true } });
  const crew = dbUser?.crew ?? null;

  if (!crew) {
    return NextResponse.json({ crew: null, members: [] });
  }

  const thisYear = new Date().getFullYear();
  const start = new Date(thisYear, 0, 1);
  const end = new Date(thisYear + 1, 0, 1);

  const users = await prisma.user.findMany({
    where: { crewId: crew.id },
    include: { timeEntries: { where: { deletedAt: null, date: { gte: start, lt: end } } } },
    orderBy: { lastName: "asc" },
  });

  const members = users.map((u) => {
    let etoSum = 0;
    let ctoSum = 0;
    let etoLastDate: string | null = null;
    let ctoLastDate: string | null = null;
    for (const entry of u.timeEntries) {
      const sign = entry.direction === "EARNED" ? 1 : -1;
      if (entry.type === "ETO") {
        etoSum += sign * entry.hours;
        if (!etoLastDate || new Date(entry.date) > new Date(etoLastDate)) etoLastDate = new Date(entry.date).toISOString();
      }
      if (entry.type === "CTO") {
        ctoSum += sign * entry.hours;
        if (!ctoLastDate || new Date(entry.date) > new Date(ctoLastDate)) ctoLastDate = new Date(entry.date).toISOString();
      }
    }

    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      etoTotal: etoSum === 0 ? 0 : etoSum || "--",
      ctoTotal: ctoSum === 0 ? 0 : ctoSum || "--",
      etoLast: etoLastDate ? new Date(etoLastDate).toISOString() : null,
      ctoLast: ctoLastDate ? new Date(ctoLastDate).toISOString() : null,
    };
  });

  return NextResponse.json({ crew, members });
}
