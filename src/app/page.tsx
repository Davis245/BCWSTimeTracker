


import Calendar from "@/components/calendar";
import ETOSummaryCard from "@/components/ETOSummaryCard";
import CTOSummaryCard from "@/components/CTOSummaryCard";

export default function Home() {
	return (
		<main className="flex flex-col items-center pt-8 min-h-screen">
					<div className="flex w-screen gap-4 px-8 justify-center">
						<ETOSummaryCard eto="--" lastLogged={undefined} />
						<CTOSummaryCard cto="--" lastLogged={undefined} />
					</div>

			{/* Calendar below the cards */}
			<div className="mt-12 w-full flex justify-center">
				<Calendar />
			</div>
		</main>
	);
}

