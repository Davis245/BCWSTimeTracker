import type { Metadata } from "next";
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
        <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">BCWS Time Tracker</div>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Crew</a>
            <a href="#" className="text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Profile</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
