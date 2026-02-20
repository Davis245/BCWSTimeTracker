import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Parse month from query
  const url = new URL(request.url);
  const month = url.searchParams.get("month") || "2026-02";

  // TODO: Replace with real events from your database
  return NextResponse.json({ events: [] });
}
