import { prisma } from "@/lib/prisma";

export async function createTimeEntry({ userId, date, type, direction, hours, notes }: {
  userId: string;
  date: string;
  type: "ETO" | "CTO";
  direction: "EARNED" | "USED";
  hours: number;
  notes?: string;
}) {
  // (previously had debug logging here)
  try {
    const created = await prisma.timeEntry.create({
      data: {
        userId,
        date,
        type,
        direction,
        hours,
        notes,
        deletedAt: null,
      },
    });
  // creation succeeded
    return created;
  } catch (err) {
    console.error("[timeEntry.service] prisma.create error:", err);
    throw err;
  }
}
