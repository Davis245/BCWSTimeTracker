"use client";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-100">
      <div className="bg-white rounded-xl shadow p-12 flex flex-col items-center gap-8 border border-zinc-200">
        <h1 className="text-3xl font-bold mb-4">Welcome to BCWS Time Tracker</h1>
        <div className="flex gap-8">
          <button
            className="px-8 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => router.push("/login")}
          >
            Sign In
          </button>
          <button
            className="px-8 py-3 rounded-lg bg-zinc-200 text-zinc-800 text-lg font-semibold shadow hover:bg-zinc-300 transition"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </main>
  );
}
