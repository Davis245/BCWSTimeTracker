"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="px-6 pt-4">
        <div className="w-full max-w-md mb-2">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 font-medium"><span aria-hidden="true">←</span>&nbsp;Back</Link>
        </div>
      </div>

      <div className="p-8 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign In</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-100 w-full max-w-md">
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              const password = (form.elements.namedItem("password") as HTMLInputElement).value;
              await signIn("credentials", { email, password, callbackUrl: "/" });
            }}
          >
            <div>
              <label className="text-xs text-zinc-500">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full rounded border px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full rounded border px-3 py-2 mt-1"
              />
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex justify-center items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
