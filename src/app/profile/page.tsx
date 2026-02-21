"use client";

import { useEffect, useState } from "react";
import SignOutButton from "@/components/SignOutButton";
import EditProfileButton from "@/components/EditProfileButton";
import Link from "next/link";

type ProfileUser = {
  firstName: string;
  lastName: string;
  email: string;
  crew: { id: string; name: string } | null;
};

export default function ProfilePageClient() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          if (res.status === 401) {
            if (!mounted) return;
            setError("You are not signed in.");
            setUser(null);
            setLoading(false);
            return;
          }
          const json = await res.json().catch(() => null);
          throw new Error(json?.error || `Failed to load (${res.status})`);
        }
        const json = await res.json();
        if (!mounted) return;
        setUser(json.user ?? null);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => { mounted = false; };
  }, []);

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const email = user?.email ?? "";
  const crewName = user?.crew?.name ?? "-";

  return (
    <>
      <div className="px-6 pt-4">
        <div className="w-full max-w-md mb-2">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 font-medium"><span aria-hidden="true">←</span>&nbsp;Back</Link>
        </div>
      </div>

      <div className="p-8 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4 text-center">Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100 w-full max-w-md text-center">
          {loading ? (
            <div className="text-zinc-600">Fetching profile…</div>
          ) : error ? (
            <div className="text-zinc-600">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-y-6 mb-6">
                <div>
                  <div className="text-xs text-zinc-400">First name</div>
                  <div className="font-medium">{firstName || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Last name</div>
                  <div className="font-medium">{lastName || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Email</div>
                  <div className="font-medium">{email || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Crew</div>
                  <div className="font-medium">{crewName}</div>
                </div>
              </div>

              <div className="mt-12 flex gap-3">
                <EditProfileButton className="flex-1" />
                <SignOutButton className="flex-1" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
