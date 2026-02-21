"use client";

import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export default function EditProfileButton({ className }: Props) {
  const router = useRouter();
  const base =
    "inline-flex justify-center items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-4 py-2 font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200";
  return (
    <button
      onClick={() => router.push("/profile/edit")}
      className={`${base} ${className ?? ""}`.trim()}
    >
      Edit
    </button>
  );
}
