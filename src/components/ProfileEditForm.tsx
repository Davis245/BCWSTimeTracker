"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  firstName?: string;
  lastName?: string;
  email?: string;
  crew?: string;
};

export default function ProfileEditForm({ firstName, lastName, email, crew }: Props) {
  const [first, setFirst] = useState(firstName ?? "");
  const [last, setLast] = useState(lastName ?? "");
  const [emailVal, setEmailVal] = useState(email ?? "");
  const [crewVal, setCrewVal] = useState(crew ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function onCancel() {
    router.push("/profile");
  }

  async function onSave() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: first,
          lastName: last,
          email: emailVal,
          crew: crewVal,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        setError(json?.error ?? `Save failed (${res.status})`);
        setLoading(false);
        return;
      }
      // success -> go back to profile
      router.push("/profile");
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-4">
        <label className="text-xs text-zinc-500">First name</label>
        <input className="w-full rounded border px-3 py-2" value={first} onChange={(e) => setFirst(e.target.value)} />

        <label className="text-xs text-zinc-500">Last name</label>
        <input className="w-full rounded border px-3 py-2" value={last} onChange={(e) => setLast(e.target.value)} />

        <label className="text-xs text-zinc-500">Email</label>
        <input className="w-full rounded border px-3 py-2" value={emailVal} onChange={(e) => setEmailVal(e.target.value)} />

        <label className="text-xs text-zinc-500">Crew</label>
        <input className="w-full rounded border px-3 py-2" value={crewVal} onChange={(e) => setCrewVal(e.target.value)} />
      </div>

      {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

      <div className="mt-8 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 inline-flex justify-center items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="flex-1 inline-flex justify-center items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
