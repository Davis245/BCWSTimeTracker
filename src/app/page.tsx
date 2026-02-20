
import EventsCalendar from "@/components/EventsCalendar";

export default function Home() {
	return (
		<main className="flex flex-col items-center pt-8 min-h-screen">
					<div className="flex w-screen gap-4 px-8 justify-center">
						{/* Replace these with dynamic values from your backend or state */}
						<div className="w-[48%] bg-white rounded-xl shadow p-8 flex flex-col justify-center items-center min-h-[200px] border border-zinc-200">
							<div className="flex items-end gap-2 mb-4">
								<h2 className="text-4xl font-bold">ETO:</h2>
								<span className="text-4xl font-extrabold text-black">--</span>
								<span className="text-2xl text-zinc-600 font-medium">hours</span>
							</div>
							<div className="text-zinc-500 text-sm">Last logged: --</div>
						</div>
						<div className="w-[48%] bg-white rounded-xl shadow p-8 flex flex-col justify-center items-center min-h-[200px] border border-zinc-200">
							<div className="flex items-end gap-2 mb-4">
								<h2 className="text-4xl font-bold">CTO:</h2>
								<span className="text-4xl font-extrabold text-black">--</span>
								<span className="text-2xl text-zinc-600 font-medium">hours</span>
							</div>
							<div className="text-zinc-500 text-sm">Last logged: --</div>
						</div>
					</div>

			{/* Calendar below the cards */}
			<div className="mt-12 w-full flex justify-center">
				<EventsCalendar />
			</div>
		</main>
	);
}

