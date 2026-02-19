import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Parse month from query
  const url = new URL(request.url);
  const month = url.searchParams.get("month") || "2026-02";

  // Mock events for demo
  const events = [
    {
      date: "2026-02-14",
      startTime: "10:00:00",
      endTime: "11:00:00",
      title: "Private Event",
    },
    {
      date: "2026-02-14",
      startTime: "13:00:00",
      endTime: "14:00:00",
      title: "Crew Meeting",
    },
    {
      date: "2026-02-21",
      startTime: "09:00:00",
      endTime: "10:30:00",
      title: "CTO Review",
    },
    {
      date: "2026-02-28",
      startTime: "15:00:00",
      endTime: "16:00:00",
      title: "ETO Planning",
    },
  ];

  // Filter by month
  const filtered = events.filter(e => e.date.startsWith(month));

  return NextResponse.json({ events: filtered });
}
