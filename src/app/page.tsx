

"use client";

import Calendar from "@/components/calendar";
import ETOSummaryCard from "@/components/ETOSummaryCard";
import CTOSummaryCard from "@/components/CTOSummaryCard";
import { TimeEntryRefreshProvider } from "@/components/TimeEntryRefreshContext";
import { useState } from "react";
import HowToModal from "@/components/HowToModal";
import { Info } from "lucide-react";

export default function Home() {
	const [howOpen, setHowOpen] = useState(false);
	return (
		<TimeEntryRefreshProvider>
			<main className="flex flex-col items-center min-h-screen">
				{/* How-to button (top-left of page content; not fixed) */}
				<button
					onClick={() => setHowOpen(true)}
					className="self-start ml-2 mt-2 inline-flex items-center gap-2 rounded-md bg-white text-zinc-700 border border-zinc-200 px-3 py-2 text-sm shadow-sm hover:bg-zinc-50"
					aria-label="How to"
				>
					<Info className="h-4 w-4" />
					<span className="sr-only">How to</span>
				</button>
				<HowToModal open={howOpen} onClose={() => setHowOpen(false)} />
				<div className="flex flex-col sm:flex-row w-full max-w-5xl px-4 sm:px-8 gap-4 justify-center">
					<ETOSummaryCard />
					<CTOSummaryCard />
				</div>

				{/* Calendar below the cards */}
				<div className="mt-12 w-full flex justify-center">
					<Calendar />
				</div>
			</main>
		</TimeEntryRefreshProvider>
	);
}

