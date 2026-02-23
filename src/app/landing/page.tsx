"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Landing() {
  const router = useRouter();

  // Hide the global nav while this landing page is mounted, restore on unmount
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) {
      const prev = nav.style.display;
      nav.style.display = "none";
      return () => {
        nav.style.display = prev || "";
      };
    }
    return () => {};
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 px-6">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-center">BCWS Time Tracker</h1>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          className="inline-flex justify-center items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          onClick={() => router.push("/login")}
        >
          Sign In
        </button>
        <button
          className="inline-flex justify-center items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          onClick={() => router.push("/register")}
        >
          Register
        </button>
      </div>
    </main>
  );
}
