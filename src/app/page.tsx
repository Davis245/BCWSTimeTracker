


import Calendar from "@/components/calendar";
import ETOSummaryCard from "@/components/ETOSummaryCard";
import CTOSummaryCard from "@/components/CTOSummaryCard";
import { TimeEntryRefreshProvider } from "@/components/TimeEntryRefreshContext";

export default function Home() {
	return (
		<TimeEntryRefreshProvider>
			<main className="flex flex-col items-center pt-8 min-h-screen">
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

