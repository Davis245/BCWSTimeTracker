import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  crew: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const parse = registerSchema.safeParse(body);
    if (!parse.success) {
      const flattened = parse.error.flatten();
      const errorMsg = Object.values(flattened.fieldErrors)[0]?.[0] || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    
    const { email, password, firstName, lastName, crew } = parse.data;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    
    // Handle crew: if provided and not empty, validate crew exists by crewCode
    let crewId: string | undefined = undefined;
    if (crew && crew.trim()) {
      const crewRecord = await prisma.crew.findUnique({
        where: { crewCode: crew },
      });
      if (!crewRecord) {
        return NextResponse.json({ error: "Invalid crew code" }, { status: 400 });
      }
      crewId = crewRecord.id;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData: any = {
      email,
      hashedPassword,
      firstName,
      lastName,
    };
    
    if (crewId) {
      userData.crew = { connect: { id: crewId } };
    } else {
      userData.crewId = null;
    }
    
    await prisma.user.create({ data: userData });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Registration API error:", e);
    let message = "Registration failed";
    if (e instanceof Error) message = e.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
