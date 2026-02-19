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
        {children}
      </body>
    </html>
  );
}
