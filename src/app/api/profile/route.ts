import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileUpdateSchema = z.object({
  firstName: z.string().min(0).optional(),
  lastName: z.string().min(0).optional(),
  email: z.string().email().optional(),
  crew: z.string().min(1).optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parse = profileUpdateSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
    }
    const { firstName, lastName, email, crew } = parse.data;

    // handle crew: if provided, upsert crew by name
    let crewId: string | undefined = undefined;
    if (crew) {
      const existing = await prisma.crew.findUnique({ where: { name: crew } });
      if (existing) {
        crewId = existing.id;
      } else {
        const createdCrew = await prisma.crew.create({ data: { name: crew } });
        crewId = createdCrew.id;
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: typeof firstName === "string" ? firstName : undefined,
        lastName: typeof lastName === "string" ? lastName : undefined,
        email: typeof email === "string" ? email : undefined,
        crewId: crewId ?? undefined,
      },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err) {
    console.error("/api/profile PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
