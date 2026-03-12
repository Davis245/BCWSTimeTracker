import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { createTimeEntry } from "@/services/timeEntry.service";
import { deleteTimeEntry } from "@/services/timeEntry.service";

const timeEntrySchema = z.object({
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
  type: z.enum(["ETO", "CTO"]),
  direction: z.enum(["EARNED", "USED"]),
  // accept numbers or numeric strings (coerce to number)
  hours: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") return Number(val);
    return val;
  }, z.number().min(0, "Hours must be non-negative")),
  notes: z.string().optional(),
  savedAt: z.string().optional().refine(
    (val) => val === undefined || !isNaN(Date.parse(val)),
    { message: "Invalid savedAt date format" }
  ),
}).refine(
  (data) => {
    // ETO earned: max 1.5 hours
    if (data.type === "ETO" && data.direction === "EARNED" && data.hours > 1.5) {
      return false;
    }
    // ETO used: min -7 hours (i.e., max 7 hours can be used)
    if (data.type === "ETO" && data.direction === "USED" && data.hours > 7) {
      return false;
    }
    // CTO used: min -7 hours (i.e., max 7 hours can be used)
    if (data.type === "CTO" && data.direction === "USED" && data.hours > 7) {
      return false;
    }
    return true;
  },
  {
    message: "Invalid input",
    path: ["hours"],
  }
);

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
      // Extract error message from the first field error
      const flattened = parseResult.error.flatten();
      const errorMessage = flattened.fieldErrors.hours?.[0] || "Invalid input";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const { date, type, direction, hours, notes, savedAt } = parseResult.data;
    const entry = await createTimeEntry({
      userId: session.user.id,
      date,
      type,
      direction,
      hours,
      notes,
      savedAt,
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    // Log error internally if needed
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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
    const id = body?.id;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 });
    }
    const result = await deleteTimeEntry({ id, userId: session.user.id });
    if (result.count === 0) {
      // nothing deleted - either not found or not owned by user
      return NextResponse.json({ error: "Not found or not allowed" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
