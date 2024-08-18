"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import nanoid from "nanoid";
import { createNewItinerary } from "@/apis";
import { useAuth0 } from "@auth0/auth0-react";
import Router, { useRouter } from "next/router";
import { useMyItineraries } from "@/useMyItineraries";
import { makeItineraryid } from "@/helpers";

export default function Home() {
	const { user } = useAuth0();
	const callbackCreateNewItinerary = async () => {
		const title = makeItineraryid(12);
		if (!user?.sub) {
			console.log("User is not authenticated.");
			return;
		}

		const itinerary = await createNewItinerary(user?.sub as string, title);
		console.log(itinerary);

		window.location.href = "/itinerary/" + itinerary._id;
	};
	return (
		<div>
			<div className="flex justify-center items-center mt-40 p-4">
				<div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
					<div
						className="w-full md:w-[400px] flex flex-col p-6 md:p-10 rounded-lg"
						style={{ backgroundColor: "#F8F9FB" }}
					>
						<div className="flex flex-col">
							<p className="text-lg font-medium">
								Need help deciding where to go, booking, or itinerary planning?
							</p>
							<button
								className="text-gray-600 mt-2 flex items-center"
								onClick={callbackCreateNewItinerary}
							>
								Create a New Itinerary
								<ChevronRight />
							</button>
						</div>
						<div className="flex justify-center mt-4">
							<Image
								src="/chat.svg"
								alt="AI Chat Icon"
								width={120}
								height={120}
							/>
						</div>
					</div>
					{/* OR Text for Small Screens */}
					<div className="flex justify-center items-center sm:block md:hidden">
						<p className="text-lg ">OR</p>
					</div>
					<div
						className="w-full md:w-[400px] flex flex-col p-6 md:p-10 rounded-lg"
						style={{ backgroundColor: "#F8F9FB" }}
					>
						<div className="flex flex-col">
							<p className="text-lg font-medium">
								I want to see my existing itinerary and bookings{" "}
							</p>
							<Link
								className="text-gray-600 mt-2 flex items-center"
								href="/itinerary"
							>
								Go to Profile
								<ChevronRight />
							</Link>
						</div>
						<div className="flex justify-center mt-4">
							<Image
								src="/calendar.svg"
								alt="Calendar Icon"
								className=""
								width={80}
								height={80}
							/>
						</div>
					</div>
				</div>
			</div>
			<div>
				<h3>My itineraries</h3>
				{myItineraries.itineraries?.map((itinerary) => {
					return (
						<div key={itinerary._id}>
							<Link href={"/itinerary/" + itinerary._id}>
								{itinerary.title}
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
}
