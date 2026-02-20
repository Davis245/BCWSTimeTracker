"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

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
        setError(data.error || "Registration failed");
      } catch {
        setError("Registration failed: Unexpected server response");
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-100">
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center gap-6 border border-zinc-200 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Register</h1>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleRegister}>
          <input name="firstName" type="text" placeholder="First Name" required className="border rounded px-3 py-2 w-full" />
          <input name="lastName" type="text" placeholder="Last Name" required className="border rounded px-3 py-2 w-full" />
          <input name="crew" type="text" placeholder="Crew Name" required className="border rounded px-3 py-2 w-full" />
          <input name="email" type="email" placeholder="Email" required className="border rounded px-3 py-2 w-full" />
          <input name="password" type="password" placeholder="Password" required className="border rounded px-3 py-2 w-full" />
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition">Register</button>
        </form>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </div>
    </main>
  );
}
