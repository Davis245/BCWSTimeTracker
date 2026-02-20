"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-100">
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center gap-6 border border-zinc-200 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email = (form.elements.namedItem("email") as HTMLInputElement).value;
            const password = (form.elements.namedItem("password") as HTMLInputElement).value;
            await signIn("credentials", { email, password, callbackUrl: "/" });
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="border rounded px-3 py-2 w-full"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="border rounded px-3 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
