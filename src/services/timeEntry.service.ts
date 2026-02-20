import { prisma } from "@/lib/prisma";

export async function createTimeEntry({ userId, date, type, direction, hours, notes }: {
  userId: string;
  date: string;
  type: "ETO" | "CTO";
  direction: "EARNED" | "USED";
  hours: number;
  notes?: string;
}) {
  return prisma.timeEntry.create({
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
}
