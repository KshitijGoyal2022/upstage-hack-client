import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMyItineraries } from "@/useMyItineraries";
import { createNewItinerary } from "@/apis";
import { makeItineraryid } from "@/helpers";
import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";

const Sidebar = () => {
	const { user, isAuthenticated, isLoading } = useAuth0();

	const { itineraries, loading } = useMyItineraries();

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
		<div className="p-4 space-y-4 h-full">
			<h2 className="mt-2 text-xl font-semibold p-4 flex justify-center">
				Your Itineraries
			</h2>
			<Button
				variant="outline"
				className="w-full flex items-center justify-start gap-2 rounded-lg p-2 hover:bg-muted"
				onClick={callbackCreateNewItinerary}
			>
				<Avatar className="h-8 w-8 bg-muted">
					<AvatarFallback>+</AvatarFallback>
				</Avatar>
				<span className="text-gray-700">New Itinerary</span>
			</Button>
			<ul className="space-y-2">
				{itineraries.map((itinerary, index) => {
					const hasTitle = itinerary?.arrival && itinerary?.departure;
					const airlineTitle =
						"Trip to " +
						itinerary?.g_flights?.[0]?.flights?.[0]?.departure_airport?.name +
						" - " +
						itinerary?.g_flights?.[0]?.flights?.[0]?.arrival_airport?.name;
					const title = hasTitle
						? itinerary.departure + " - " + itinerary.arrival
						: itinerary?.g_flights?.[0]?.flights?.[0]?.departure_airport?.name
						? airlineTitle
						: itinerary.title;

					const airlineImage =
						itinerary.g_flights?.[0]?.flights?.[0]?.airline_logo;
					return (
						<li key={itinerary._id}>
							<Link href={`/itinerary/${itinerary._id}`} passHref>
								<Button
									variant="ghost"
									className="w-full flex items-center justify-start gap-2 rounded-lg p-2 text-gray-800 hover:bg-muted"
								>
									<Avatar className="h-8 w-8 bg-blue-100">
										<AvatarFallback>
											{airlineImage ? (
												<Image
													src={airlineImage}
													width={20}
													height={20}
													alt="Airlie image"
													objectFit="contain"
												/>
											) : (
												title[0]
											)}
										</AvatarFallback>
									</Avatar>
									<span className="truncate">{title}</span>
								</Button>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Sidebar;
