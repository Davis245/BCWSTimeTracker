import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { User, TimeEntry } from "@prisma/client";

export default async function CrewPage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Crew</h1>
        <p className="text-zinc-600">You are not signed in.</p>
      </div>
    );
  }

  // Fetch the current user's crew only
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, include: { crew: true } });
  const crew = dbUser?.crew ?? null;

  // If user has a crew, compute per-member ETO/CTO totals and last-updated dates for the current year
  let members: Array<{
    id: string;
    firstName: string;
    lastName: string;
    etoTotal: number | string;
    ctoTotal: number | string;
    etoLast?: string;
    ctoLast?: string;
  }> = [];

  if (crew) {
    const thisYear = new Date().getFullYear();
    const start = new Date(thisYear, 0, 1);
    const end = new Date(thisYear + 1, 0, 1);

    const users = await prisma.user.findMany({
      where: { crewId: crew.id },
      include: { timeEntries: { where: { deletedAt: null, date: { gte: start, lt: end } } } },
      orderBy: { lastName: "asc" },
    });

  members = users.map((u: User & { timeEntries: TimeEntry[] }) => {
      let etoSum = 0;
      let ctoSum = 0;
      let etoLastDate: string | null = null;
      let ctoLastDate: string | null = null;
      for (const entry of u.timeEntries) {
        const sign = entry.direction === "EARNED" ? 1 : -1;
        if (entry.type === "ETO") {
          etoSum += sign * entry.hours;
          if (!etoLastDate || new Date(entry.date) > new Date(etoLastDate)) etoLastDate = entry.date.toISOString();
        }
        if (entry.type === "CTO") {
          ctoSum += sign * entry.hours;
          if (!ctoLastDate || new Date(entry.date) > new Date(ctoLastDate)) ctoLastDate = entry.date.toISOString();
        }
      }

      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        etoTotal: etoSum === 0 ? 0 : etoSum || "--",
        ctoTotal: ctoSum === 0 ? 0 : ctoSum || "--",
        etoLast: etoLastDate ? new Date(etoLastDate).toLocaleDateString() : undefined,
        ctoLast: ctoLastDate ? new Date(ctoLastDate).toLocaleDateString() : undefined,
      };
    });
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">{crew ? crew.name : "Crew"}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100 w-full max-w-3xl text-center">
        {!crew ? (
          <div className="text-zinc-600">You are not assigned to a crew.</div>
        ) : (
          <div>
            {crew.fireCentre && <div className="text-sm text-zinc-500 mb-4">{crew.fireCentre}</div>}

            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-sm text-zinc-500">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2 text-center">ETO</th>
                    <th className="px-4 py-2 text-center">Last updated</th>
                    <th className="px-4 py-2 text-center">CTO</th>
                    <th className="px-4 py-2 text-center">Last updated</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="align-middle">
                      <td className="px-4 py-3 font-medium">{m.firstName} {m.lastName}</td>
                      <td className="px-4 py-3 font-medium text-center">{m.etoTotal}</td>
                      <td className="px-4 py-3 text-zinc-600 text-center">{m.etoLast ?? "--"}</td>
                      <td className="px-4 py-3 font-medium text-center">{m.ctoTotal}</td>
                      <td className="px-4 py-3 text-zinc-600 text-center">{m.ctoLast ?? "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}
