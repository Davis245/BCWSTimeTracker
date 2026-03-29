import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileUpdateSchema = z.object({
  firstName: z.string().min(0).optional(),
  lastName: z.string().min(0).optional(),
  email: z.string().email().optional(),
  crew: z.string().optional().nullable(),
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

    // handle crew: if provided and not empty, validate crew exists by crewCode
    let crewId: string | null | undefined = undefined;
    if (crew !== undefined) {
      if (crew && crew.trim()) {
        // User provided a crew code - validate it
        const existingCrew = await prisma.crew.findUnique({ where: { crewCode: crew } });
        if (!existingCrew) {
          return NextResponse.json({ error: "Invalid crew code" }, { status: 400 });
        }
        crewId = existingCrew.id;
      } else {
        // User cleared the crew code - set crewId to null
        crewId = null;
      }
    }

    const updateData: any = {
      firstName: typeof firstName === "string" ? firstName : undefined,
      lastName: typeof lastName === "string" ? lastName : undefined,
      email: typeof email === "string" ? email : undefined,
    };
    
    if (crewId !== undefined) {
      updateData.crewId = crewId;
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err) {
    console.error("/api/profile PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, include: { crew: true } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const firstName = dbUser.firstName ?? "";
    const lastName = dbUser.lastName ?? "";
    const email = dbUser.email ?? session.user.email ?? "";
    const crew = dbUser.crew ? { id: dbUser.crew.id, crewCode: dbUser.crew.crewCode } : null;

    return NextResponse.json({ user: { firstName, lastName, email, crew } });
  } catch (err) {
    console.error("/api/profile GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
