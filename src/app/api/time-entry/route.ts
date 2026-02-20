import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { createTimeEntry } from "@/services/timeEntry.service";

const timeEntrySchema = z.object({
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
  type: z.enum(["ETO", "CTO"]),
  direction: z.enum(["EARNED", "USED"]),
  hours: z.number().positive("Hours must be positive"),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parseResult = timeEntrySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
    }
    const { date, type, direction, hours, notes } = parseResult.data;
    const entry = await createTimeEntry({
      userId: session.user.id,
      date,
      type,
      direction,
      hours,
      notes,
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    // Log error internally if needed
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
