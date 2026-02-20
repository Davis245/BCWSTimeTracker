
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, crew } = await request.json();
    if (!email || !password || !firstName || !lastName || !crew) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    // Find or create the crew
    const crewRecord = await prisma.crew.upsert({
      where: { name: crew },
      update: {},
      create: { name: crew },
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
        firstName,
        lastName,
        crew: { connect: { id: crewRecord.id } },
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Registration API error:", e);
    let message = "Registration failed";
    if (e instanceof Error) message = e.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
