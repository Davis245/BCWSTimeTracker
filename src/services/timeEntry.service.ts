import { prisma } from "@/lib/prisma";

export async function createTimeEntry({ userId, date, type, direction, hours, notes, savedAt }: {
  userId: string;
  date: string;
  type: "ETO" | "CTO";
  direction: "EARNED" | "USED";
  hours: number;
  notes?: string;
  savedAt?: string;
}) {
  // (previously had debug logging here)
  try {
    const created = await prisma.timeEntry.create({
      // Cast to any because generated Prisma types may be out of date until client is regenerated
      data: {
        userId,
        date: new Date(date),
        savedAt: savedAt ? new Date(savedAt) : undefined,
        type,
        direction,
        hours,
        notes,
        deletedAt: null,
      } as any,
    });
  // creation succeeded
    return created;
  } catch (err) {
    console.error("[timeEntry.service] prisma.create error:", err);
    throw err;
  }
}

export async function deleteTimeEntry({ id, userId }: { id: string; userId: string }) {
  try {
    // Use updateMany to ensure we only affect entries owned by this user
    const result = await prisma.timeEntry.updateMany({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });
    return result; // { count }
  } catch (err) {
    console.error("[timeEntry.service] prisma.delete error:", err);
    throw err;
  }
}
