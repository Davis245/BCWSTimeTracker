"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value;
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement).value;
    const crew = (form.elements.namedItem("crew") as HTMLInputElement).value;

    // Call API route to register
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName, crew }),
    });
    if (res.ok) {
      router.push("/login");
    } else {
      try {
        const data = await res.json();
        // Handle error - ensure it's a string
        const errorMsg = typeof data.error === 'string' ? data.error : "Registration failed";
        setError(errorMsg);
      } catch {
        setError("Registration failed: Unexpected server response");
      }
    }
  }

  return (
    <>
      <div className="px-6 pt-4">
        <div className="w-full max-w-md mb-2">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 font-medium"><span aria-hidden="true">←</span>&nbsp;Back</Link>
        </div>
      </div>

      <div className="p-8 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100 w-full max-w-md">
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <div>
              <label className="text-xs text-zinc-500">First Name</label>
              <input name="firstName" type="text" placeholder="First Name" required className="w-full rounded border px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs text-zinc-500">Last Name</label>
              <input name="lastName" type="text" placeholder="Last Name" required className="w-full rounded border px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs text-zinc-500">Crew Code (optional)</label>
              <input name="crew" type="text" placeholder="Crew Code (optional)" className="w-full rounded border px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs text-zinc-500">Email</label>
              <input name="email" type="email" placeholder="Email" required className="w-full rounded border px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-xs text-zinc-500">Password</label>
              <input name="password" type="password" placeholder="Password" required className="w-full rounded border px-3 py-2 mt-1" />
            </div>
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
            <button type="submit" className="mt-4 inline-flex justify-center items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200">Register</button>
          </form>
        </div>
      </div>
    </>
  );
}
