"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  etoTotal: number | string;
  ctoTotal: number | string;
  etoLast?: string | null;
  ctoLast?: string | null;
};

export default function CrewPageClient() {
  const [loading, setLoading] = useState(true);
  const [crew, setCrew] = useState<any | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getEtoBackgroundColor = (value: number | string): string => {
    const num = typeof value === "number" ? value : parseFloat(value as string);
    if (isNaN(num)) return "bg-white";
    if (num < 0 || num > 70) return "bg-red-200";
    if (num >= 41) return "bg-yellow-200";
    return "bg-green-200";
  };

  useEffect(() => {
    let mounted = true;
    async function fetchCrew() {
      setLoading(true);
      try {
        const res = await fetch("/api/crew");
        if (!res.ok) {
          if (res.status === 401) {
            if (!mounted) return;
            setCrew(null);
            setMembers([]);
            setError("You are not signed in.");
            setLoading(false);
            return;
          }
          const json = await res.json().catch(() => null);
          throw new Error(json?.error || `Failed to load (${res.status})`);
        }
        const json = await res.json();
        if (!mounted) return;
        setCrew(json.crew);
        // members returned with ISO strings for dates; convert to display strings
        const transformed: Member[] = (json.members || []).map((m: any) => ({
          id: m.id,
          firstName: m.firstName,
          lastName: m.lastName,
          etoTotal: m.etoTotal,
          ctoTotal: m.ctoTotal,
          etoLast: m.etoLast ? new Date(m.etoLast).toLocaleDateString() : undefined,
          ctoLast: m.ctoLast ? new Date(m.ctoLast).toLocaleDateString() : undefined,
        }));
        setMembers(transformed);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCrew();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <div className="px-6 pt-4">
        <div className="w-full max-w-md mb-2">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 font-medium"><span aria-hidden="true">←</span>&nbsp;Back</Link>
        </div>
      </div>

      <div className="p-8 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4">{crew ? crew.name : "Crew"}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100 w-full max-w-3xl text-center">
        {loading ? (
          <div className="text-zinc-600">Fetching crew data…</div>
        ) : error ? (
          <div className="text-zinc-600">{error}</div>
        ) : !crew ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-zinc-600 text-lg">You are not part of a crew</div>
            <div className="text-sm text-zinc-500">To join a crew, go to your profile and enter your crew code.</div>
            <Link href="/profile/edit" className="mt-2 inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition">
              Go to Profile
            </Link>
          </div>
        ) : (
          <div>
            {crew.fireCentre && <div className="text-sm text-zinc-500 mb-4">{crew.fireCentre}</div>}

            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-sm text-zinc-500 border-b border-zinc-200">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2 text-center">ETO</th>
                    <th className="px-4 py-2 text-center">Last updated</th>
                    {/* <th className="px-4 py-2 text-center">CTO</th>
                    <th className="px-4 py-2 text-center">Last updated</th> */}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="align-middle border-b border-zinc-200">
                      <td className="px-4 py-3 font-medium">{m.firstName} {m.lastName}</td>
                      <td className="px-4 py-3 font-medium text-center"><span className={`inline-flex items-center justify-center w-16 px-3 py-1 rounded ${getEtoBackgroundColor(m.etoTotal)}`}>{m.etoTotal}</span></td>
                      <td className="px-4 py-3 text-zinc-600 text-center">{m.etoLast ?? "--"}</td>
                      {/* <td className="px-4 py-3 font-medium text-center">{m.ctoTotal}</td>
                      <td className="px-4 py-3 text-zinc-600 text-center">{m.ctoLast ?? "--"}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
        )}
      </div>
    </div>
    </>
  );
}
