
import EventsCalendar from "@/components/EventsCalendar";

export default function Home() {
	return (
		<main className="flex flex-col items-center pt-8 min-h-screen">
					<div className="flex w-screen gap-4 px-8 justify-center">
						<div className="w-[48%] bg-white rounded-xl shadow p-8 flex flex-col justify-center items-center min-h-[200px] border border-zinc-200">
							<h2 className="text-xl font-semibold mb-2">Card 1</h2>
							<p className="text-zinc-600">Content for the first card.</p>
						</div>
						<div className="w-[48%] bg-white rounded-xl shadow p-8 flex flex-col justify-center items-center min-h-[200px] border border-zinc-200">
							<h2 className="text-xl font-semibold mb-2">Card 2</h2>
							<p className="text-zinc-600">Content for the second card.</p>
						</div>
					</div>

			{/* Calendar below the cards */}
			<div className="mt-12 w-full flex justify-center">
				<EventsCalendar />
			</div>
		</main>
	);
}

