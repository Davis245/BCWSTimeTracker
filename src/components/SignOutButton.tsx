"use client";

import { signOut } from "next-auth/react";
type Props = {
  className?: string;
};

export default function SignOutButton({ className }: Props) {
  const base =
    "inline-flex justify-center items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200";
  return (
    <button onClick={() => signOut({ callbackUrl: "/landing" })} className={`${base} ${className ?? ""}`.trim()}>
      Sign out
    </button>
  );
}
