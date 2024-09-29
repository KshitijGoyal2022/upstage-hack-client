import {
	GoogleEventsResult,
	GoogleFlightData,
	GoogleFoodResult,
	GoogleHotelProperty,
	GooglePlacesResult,
} from "@/types/serp";
import { BlurredModal } from "./ui/blurred-modal";
import { EventKeys } from "recharts/types/util/types";
import Image from "next/image";
import { millisecondsToDuration } from "@/helpers";

interface Itinerary {
	day: number;
	events: {
		id: string;
		type: string;
		start_time: string;
		end_time: string;
		transfer_time: string;
		original_data: any | any[];
	}[];
}

const findFlight = (id: string, wholeItinerary: any) => {
	const flight = wholeItinerary?.g_flights?.find(
		(flight: any) => flight.id === id
	);
	return flight;
};

const findRestaurant = (restaurant_id: string, wholeItinerary: any) => {
	const restaurant = wholeItinerary?.g_restaurants?.find(
		(restaurant: any) => restaurant.restaurant_id === restaurant_id
	);
	return restaurant;
};

const findHotel = (property_token: string, wholeItinerary: any) => {
	const hotel = wholeItinerary?.g_hotels?.find(
		(hotel: any) => hotel.property_token === property_token
	);
	return hotel;
};

const findLocalResults = (id: string, wholeItinerary: any) => {
	const localResults = wholeItinerary?.g_local_results?.find(
		(localResult: any) => localResult.title === id
	);
	return localResults;
};

const findEvent = (id: string, wholeItinerary: any) => {
	const event = wholeItinerary?.g_events?.find(
		(event: any) => event.title === id
	);
	return event;
};

const findTopSight = (id: string, wholeItinerary: any) => {
	const topSight = wholeItinerary?.g_top_sights?.find(
		(topSight: any) => topSight.title === id
	);
	return topSight;
};

export default function ItineraryRender(props: {
	open: boolean;
	itinerary: Itinerary[];
	onClose: () => void;
	wholeItinerary: any;
}) {
	const { open, itinerary } = props;

	let c = 0;
	return (
		<BlurredModal open={open} onClose={props.onClose}>
			<h1 className="font-bold text-3xl mb-8">Your itinerary</h1>
			{itinerary?.map((day) => {
				return (
					<div key={day.day} className="mb-16">
						<h2 className="font-bold text-xl mb-4 flex flex-row items-center gap-4">
							Day {day.day}{" "}
							<span className="font-normal text-base">
								{day.events[0].start_time}-
								{day.events[day.events.length - 1].end_time}
							</span>
						</h2>
						<div className="grid grid-cols-1 gap-8">
							{day.events.map((event) => {
								if (event.type === "g_outbound_flight") {
									const flight = findFlight(
										event.id,
										props.wholeItinerary
									) as GoogleFlightData["best_flights"][0];

									return (
										<div key={flight?.id}>
											{/* <p>{event.type}</p> */}

											<div className="flex flex-col gap-8">
												{flight?.flights?.map((f, index) => {
													c++;
													return (
														<>
															<div
																key={f.airline}
																className="flex flex-row gap-4"
															>
																<Image
																	src={f.airline_logo}
																	width={60}
																	height={60}
																	objectFit="cover"
																	alt="restaurant"
																	className="w-[72px] h-[72px] rounded-md"
																/>
																<div className="flex flex-col items-center gap-2">
																	<div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-400">
																		<p className="text-sm">{c}</p>
																	</div>
																	<div className="w-[2px] h-8 bg-slate-300"></div>
																</div>
																<div className="-mt-1.5">
																	<h1 className="font-bold text-lg">
																		{f.departure_airport?.name} -{" "}
																		{f.arrival_airport?.name}{" "}
																	</h1>
																	<p className="text-sm text-slate-500 mb-2">
																		Flight
																	</p>
																	<p className="text-slate-700 text-sm">
																		{f.departure_airport?.time} -{" "}
																		{f.arrival_airport?.time}
																	</p>
																	<p className="text-slate-700 text-sm">
																		Duration:{" "}
																		{millisecondsToDuration(f.duration)}
																	</p>
																</div>
															</div>
															{flight?.layovers?.length > index && (
																<>
																	<div className=" grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
																		<div className="flex flex-col items-center">
																			<span className="flex h-2 w-2 translate-y-1 rounded-full bg-black" />
																			{/** Line to bottom */}

																			<div className="h-full mt-3 w-0.5 bg-black"></div>
																		</div>
																		<div className="space-y-1">
																			<p className="text-sm font-medium leading-none">
																				Layover at {flight.layovers[index].name}
																			</p>
																			<p className="text-sm text-muted-foreground">
																				Duration:{" "}
																				{millisecondsToDuration(
																					flight.layovers[index].duration
																				)}
																			</p>
																		</div>
																	</div>
																</>
															)}
														</>
													);
												})}
											</div>
										</div>
									);
								} else if (event.type === "g_return_flight") {
									const flight = findFlight(
										event.id,
										props.wholeItinerary
									) as GoogleFlightData["best_flights"][0];

									return (
										<div key={flight?.id}>
											{/* <p>{event.type}</p> */}

											<div className="flex flex-col gap-8">
												{flight?.flights?.map((f, index) => {
													c++;
													return (
														<>
															<div
																key={f.airline}
																className="flex flex-row gap-4"
															>
																<Image
																	src={f.airline_logo}
																	width={60}
																	height={60}
																	objectFit="cover"
																	alt="restaurant"
																	className="w-[72px] h-[72px] rounded-md"
																/>
																<div className="flex flex-col items-center gap-2">
																	<div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-400">
																		<p className="text-sm">{c}</p>
																	</div>
																	<div className="w-[2px] h-8 bg-slate-300"></div>
																</div>
																<div className="-mt-1.5">
																	<h1 className="font-bold text-lg">
																		{f.departure_airport?.name} -{" "}
																		{f.arrival_airport?.name}{" "}
																	</h1>
																	<p className="text-sm text-slate-500 mb-2">
																		Flight
																	</p>
																	<p className="text-slate-700 text-sm">
																		{f.departure_airport?.time} -{" "}
																		{f.arrival_airport?.time}
																	</p>
																	<p className="text-slate-700 text-sm">
																		Duration:{" "}
																		{millisecondsToDuration(f.duration)}
																	</p>
																</div>
															</div>
															{flight?.layovers?.length > index && (
																<>
																	<div className=" grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
																		<div className="flex flex-col items-center">
																			<span className="flex h-2 w-2 translate-y-1 rounded-full bg-black" />
																			{/** Line to bottom */}

																			<div className="h-full mt-3 w-0.5 bg-black"></div>
																		</div>
																		<div className="space-y-1">
																			<p className="text-sm font-medium leading-none">
																				Layover at {flight.layovers[index].name}
																			</p>
																			<p className="text-sm text-muted-foreground">
																				Duration:{" "}
																				{millisecondsToDuration(
																					flight.layovers[index].duration
																				)}
																			</p>
																		</div>
																	</div>
																</>
															)}
														</>
													);
												})}
											</div>
										</div>
									);
								} else if (event.type === "g_restaurants" && event.id) {
									const restaurant = findRestaurant(
										event.id,
										props.wholeItinerary
									) as GoogleFoodResult;
									c++;

									return (
										<div
											key={restaurant.restaurant_id}
											className="flex flex-row gap-4"
										>
											<Image
												src={restaurant.images[0]}
												width={60}
												height={60}
												objectFit="cover"
												alt="restaurant"
												className="w-[72px] h-[72px] rounded-md"
											/>
											<div className="flex flex-col items-center gap-2">
												<div className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-500">
													<p className="text-sm">{c}</p>
												</div>
												<div className="w-[2px] h-8 bg-slate-300"></div>
											</div>
											<div className="-mt-1.5">
												<h1 className="font-bold text-lg">
													{restaurant.title}
												</h1>
												<p className="text-sm text-slate-500 mb-2">
													Restaurant
												</p>
												<p className="text-slate-700 text-sm">
													{event.start_time} to {event.end_time} @{" "}
													{restaurant.address}
												</p>
												<p className="text-slate-700 text-sm">
													Price: {restaurant.price}
												</p>
											</div>
										</div>
									);
								} else if (event.type === "g_hotels" && event.id) {
									const hotel = findHotel(
										event.id,
										props.wholeItinerary
									) as GoogleHotelProperty;
									c++;

									return (
										<div
											key={hotel?.property_token}
											className="flex flex-row gap-4"
										>
											{/* {event.type} */}

											<Image
												src={hotel?.images[0]?.thumbnail}
												width={60}
												height={60}
												objectFit="cover"
												alt="restaurant"
												className="w-[72px] h-[72px] rounded-md"
											/>
											<div className="flex flex-col items-center gap-2">
												<div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-400">
													<p className="text-sm">{c}</p>
												</div>
												<div className="w-[2px] h-8 bg-slate-300"></div>
											</div>
											<div className="-mt-1.5">
												<h1 className="font-bold text-lg">{hotel?.name}</h1>
												<p className="text-sm text-slate-500 mb-2">Hotel</p>
												<p className="text-slate-700 text-sm">
													{event.start_time} to {event.end_time} @ Check-in:{" "}
													{hotel?.check_in_time}
												</p>
												<p className="text-slate-700 text-sm">
													Price: {hotel?.rate_per_night?.lowest} / night
												</p>
											</div>
										</div>
									);
								} else if (event.type === "g_local_results" && event.id) {
									const localResults = findLocalResults(
										event.id,
										props.wholeItinerary
									) as GooglePlacesResult["local_results"]["places"][0];
									c++;

									return (
										<div
											key={localResults.title}
											className="flex flex-row gap-4"
										>
											{/* {event.type} */}

											<Image
												src={localResults.thumbnail}
												width={60}
												height={60}
												objectFit="cover"
												alt="restaurant"
												className="w-[72px] h-[72px] rounded-md"
											/>
											<div className="flex flex-col items-center gap-2">
												<div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-400">
													<p className="text-sm">{c}</p>
												</div>
												<div className="w-[2px] h-8 bg-slate-300"></div>
											</div>
											<div className="-mt-1.5">
												<h1 className="font-bold text-lg">
													{localResults?.title}
												</h1>
												<p className="text-sm text-slate-500 mb-2">
													Local Place
												</p>
												<p className="text-slate-700 text-sm">
													{event.start_time} to {event.end_time} @{" "}
													{localResults?.address}
												</p>
											</div>
										</div>
									);
								} else if (event.type === "g_events" && event.id) {
									const localResults = findEvent(
										event.id,
										props.wholeItinerary
									) as GoogleEventsResult["events_results"][0];
									c++;

									return (
										<div
											key={localResults.title}
											className="flex flex-row gap-4"
										>
											{/* {event.type} */}

											<Image
												src={localResults.thumbnail}
												width={60}
												height={60}
												objectFit="cover"
												alt="restaurant"
												className="w-[72px] h-[72px] rounded-md"
											/>
											<div className="flex flex-col items-center gap-2">
												<div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-400">
													<p className="text-sm">{c}</p>
												</div>
												<div className="w-[2px] h-8 bg-slate-300"></div>
											</div>
											<div className="-mt-1.5">
												<h1 className="font-bold text-lg">
													{localResults?.title}
												</h1>
												<p className="text-sm text-slate-500 mb-2">Event</p>
												<p className="text-slate-700 text-sm">
													{event.start_time} to {event.end_time} @{" "}
													{localResults?.address}
												</p>
											</div>
										</div>
									);
								} else if (event.type === "g_top_sights" && event.id) {
									const topSight = findTopSight(
										event.id,
										props.wholeItinerary
									) as GooglePlacesResult["top_sights"]["sights"][0];
									c++;

									return (
										<div key={topSight.title} className="flex flex-row gap-4">
											{/* {event.type} */}

											<Image
												src={topSight?.thumbnail}
												width={60}
												height={60}
												objectFit="cover"
												alt="restaurant"
												className="w-[72px] h-[72px] rounded-md"
											/>
											<div className="flex flex-col items-center gap-2">
												<div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-400">
													<p className="text-sm">{c}</p>
												</div>
												<div className="w-[2px] h-8 bg-slate-300"></div>
											</div>
											<div className="-mt-1.5">
												<h1 className="font-bold text-lg">{topSight?.title}</h1>
												<p className="text-sm text-slate-500 mb-2">Top Sight</p>
												<p className="text-slate-700 text-sm">
													{event.start_time} to {event.end_time}
												</p>
												<p className="text-slate-700 text-sm">
													Price: {topSight?.price}
												</p>
											</div>
										</div>
									);
								} else {
									c++;
								}
								return (
									<div
										key={event.id}
										className="bg-white dark:bg-black rounded-lg p-4"
									>
										<h3 className="font-bold text-lg">{event.type}</h3>
										<p>
											{event.start_time} - {event.end_time}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</BlurredModal>
	);
}
