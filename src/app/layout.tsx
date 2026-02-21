import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BCWS Time Tracker",
  description: "ETO/CTO time tracking for BCWS employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
          <Link href="/" className="text-lg font-bold text-zinc-900">BCWS Time Tracker</Link>
          <div className="flex gap-6">
            <a href="/crew" className="text-zinc-700 hover:text-blue-600 font-medium">Crew</a>
            <a href="/profile" className="text-zinc-700 hover:text-blue-600 font-medium">Profile</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
