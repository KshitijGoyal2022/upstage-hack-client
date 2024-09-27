"use client";

import { socket } from "@/socket";
import { useChat } from "@/socket/chat";
import React, { act } from "react";
import { FlightCard, FlightSkeleton } from "./renders/RenderFlights";

import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";

import { saveActivity, saveFlight, saveHotel } from "@/apis";
import { useAuth0 } from "@auth0/auth0-react";
import { generateFlightOfferUniqueId } from "@/helpers";
import Image from "next/image";

export const hotel_tags_set = new Set([
	"lodging",
	"hotel",
	"vacation_rental",
	"campground",
	"motel",
	"hostel",
	"bed_and_breakfast",
	"resort",
	"apartment_or_condo",
	"mountain_hut",
]);

export default function AiPlayground(props: {
	itineraryId: string;
	itinerary: any;
	onRefreshItinerary: () => void;
}) {
	const { user } = useAuth0();
	const [message, setMessage] = React.useState("");

	const chat = useChat(props.itineraryId, socket);
	console.log(chat);

	const callbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		chat.sendChat(message);
		setMessage("");
	};

	const callbackSaveFlight = async (flight: any) => {
		await saveFlight(flight, props.itineraryId);
		props?.onRefreshItinerary();
	};
	const callbackSaveHotel = async (hotel: any) => {
		await saveHotel(hotel, props.itineraryId);
		props?.onRefreshItinerary();
	};

	const callbackSaveActivity = async (activity: any) => {
		await saveActivity(activity, props.itineraryId);
		props?.onRefreshItinerary();
	};

	const isAdmin = props.itinerary?.admin?.provider?.id === user?.sub;
	const selectedActivitiesMapboxIds = new Set([
		...props.itinerary.activities.map(
			(activity) => activity?.properties?.mapbox_id
		),
		...props.itinerary.hotels.map((hotel) => hotel?.properties?.mapbox_id),
	]);
	const flightId = generateFlightOfferUniqueId(props?.itinerary?.flight);

	return (
		<div className="col-span-7 h-full flex flex-col">
			<div className="flex-1 overflow-y-auto  space-y-8 min-h-[650px] max-h-[800px]">
				{chat.chats.length > 0 &&
					chat.chats.map((chat, index) => {
						const plans = [
							...(chat.flight_offer_search?.best_flights || []),
							...(chat.flight_offer_search?.other_flights || []),
						];
						return (
							<div key={index} className="space-y-8">
								{(plans.length > 0 && (
									<div>
										<h1 className="font-semibold text-2xl p-6">{chat.title}</h1>

										<div className="flex flex-row overflow-x-auto gap-4 px-6 ">
											{plans?.map((flight, index) => {
												const currentFlightId =
													generateFlightOfferUniqueId(flight);
												return (
													<FlightCard
														flight={flight}
														key={currentFlightId}
														isAdmin={isAdmin}
														isSelected={currentFlightId === flightId}
														currency={
															chat.flight_offer_search.search_parameters
																?.currency || "USD"
														}
														onPress={() =>
															callbackSaveFlight({
																...flight,
																currency:
																	chat.flight_offer_search.search_parameters
																		?.currency || "USD",
															})
														}
													/>
												);
											})}
										</div>
									</div>
								)) ||
									(chat.flight_offer_search === null && (
										<p className="text-center">
											Sorry, we could not find any flights
										</p>
									))}

								{chat.places_search?.top_sights && (
									<div>
										{chat.places_search.top_sights?.sights?.map((activity) => {
											return (
												<div key={activity.title}>
													<p>
														{activity.title} - {activity.rating}
													</p>
													<p>
														{activity.description} - {activity.price}
													</p>
													<Image
														src={activity.thumbnail}
														alt={activity.title}
														width={70}
														height={70}
													/>
												</div>
											);
										})}
									</div>
								)}
								{/**show me some upcoming events in vancouver */}
								{chat?.event_search?.events_results && (
									<div>
										<h1 className="font-semibold text-2xl p-6">{chat.title}</h1>
										<div className="flex flex-row overflow-x-auto gap-4 px-6 ">
											{chat?.event_search?.events_results?.map((event) => {
												return (
													<div key={event.title}>
														<p>
															{event.title} - {event.date.start_date} -{" "}
															{event.date.when}
														</p>
														<p>{event.description}</p>
														<p>
															<a href={event.ticket_info[0].link}>
																{event.ticket_info[0].source}
															</a>
														</p>
														<Image
															src={event.thumbnail}
															alt={event.title}
															width={70}
															height={70}
														/>
														<Image
															src={event.event_location_map.image}
															alt={event.title}
															width={70}
															height={70}
														/>
													</div>
												);
											})}
										</div>
									</div>
								)}
								{/**show me some hotels to stay in new york from 20 october 2024, to 30 october 2024 */}
								{chat.hotel_search?.properties && (
									<div>
										<h1 className="font-semibold text-2xl p-6">
											{chat.title.replaceAll('"', "")}
										</h1>
										<div className="flex flex-row overflow-x-auto gap-6 pb-12 px-8">
											{chat.hotel_search.properties.map((hotel) => {
												return (
													<div key={hotel.property_token}>
														<div className="w-[340px] h-[540px] relative overflow-hidden rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100">
															<div className="w-full h-[200px] aspect-w-16 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
																<Image
																	src={hotel.images[0].thumbnail}
																	alt="thumbnail"
																	width={100}
																	height={100}
																	objectFit="cover"
																	className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 h-100 w-full`}
																/>
															</div>
															<div className="flex flex-col h-[340px]">
																<div className="p-4 pb-0 flex-1">
																	<h2 className="font-bold my-4 text-lg text-zinc-700">
																		{hotel.name}
																	</h2>
																	<h2 className="font-normal my-4 text-sm text-zinc-500">
																		{hotel.description}
																	</h2>
																	<h2 className="font-normal my-4 text-xs text-zinc-500">
																		{hotel.nearby_places
																			.slice(0, 1)
																			.map((place) => (
																				<div className="flex gap-2 items-center">
																					<svg
																						width="15"
																						height="15"
																						viewBox="0 0 15 15"
																						fill="none"
																						xmlns="http://www.w3.org/2000/svg"
																					>
																						<path
																							d="M7.5 0C7.77614 0 8 0.223858 8 0.5V1.80687C10.6922 2.0935 12.8167 4.28012 13.0068 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H12.9888C12.7094 10.6244 10.6244 12.7094 8 12.9888V14.5C8 14.7761 7.77614 15 7.5 15C7.22386 15 7 14.7761 7 14.5V13.0068C4.28012 12.8167 2.0935 10.6922 1.80687 8H0.5C0.223858 8 0 7.77614 0 7.5C0 7.22386 0.223858 7 0.5 7H1.78886C1.98376 4.21166 4.21166 1.98376 7 1.78886V0.5C7 0.223858 7.22386 0 7.5 0ZM8 12.0322V9.5C8 9.22386 7.77614 9 7.5 9C7.22386 9 7 9.22386 7 9.5V12.054C4.80517 11.8689 3.04222 10.1668 2.76344 8H5.5C5.77614 8 6 7.77614 6 7.5C6 7.22386 5.77614 7 5.5 7H2.7417C2.93252 4.73662 4.73662 2.93252 7 2.7417V5.5C7 5.77614 7.22386 6 7.5 6C7.77614 6 8 5.77614 8 5.5V2.76344C10.1668 3.04222 11.8689 4.80517 12.054 7H9.5C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8H12.0322C11.7621 10.0991 10.0991 11.7621 8 12.0322Z"
																							fill="currentColor"
																							fill-rule="evenodd"
																							clip-rule="evenodd"
																						></path>
																					</svg>
																					Near {place.name}
																				</div>
																			))}
																	</h2>
																</div>
																<div className="flex flex-row justify-between items-center p-4 pt-0 self-baseline w-full">
																	<div>
																		<div className="flex items-center -ml-1 mb-3">
																			{new Array(5).fill(0).map((_, index) => (
																				<svg
																					className={`w-4 h-4 ms-1 ${
																						index < hotel.overall_rating
																							? "text-yellow-300"
																							: "text-gray-300 dark:text-gray-500" // text-yellow-500
																					}`}
																					aria-hidden="true"
																					xmlns="http://www.w3.org/2000/svg"
																					fill="currentColor"
																					viewBox="0 0 22 20"
																				>
																					<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
																				</svg>
																			))}{" "}
																			<span className="text-xs ml-2 text-slate-600">
																				{hotel.overall_rating} ({hotel.reviews})
																			</span>
																		</div>
																		<span className="text-xs text-gray-500">
																			Check-in: {hotel.check_in_time}
																		</span>
																		<br />
																		<span className="text-xs text-gray-500">
																			Check-out: {hotel.check_out_time}
																		</span>
																	</div>
																	<div>
																		<div className="text-sm text-center mb-2 font-medium text-slate-700">
																			{hotel.rate_per_night.lowest} / night
																		</div>
																		<div className="relative z-10 px-6 py-2 bg-black text-white font-bold rounded-xl block text-xs">
																			Read More
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}
								{/**show me some restaurants in new york */}
								{chat.restaurant_search?.local_results && (
									<div>
										{chat.restaurant_search.local_results.map((restaurant) => {
											return (
												<div key={restaurant.restaurant_id}>
													<p>
														{restaurant.title} - {restaurant.rating} (
														{restaurant.reviews})
													</p>
													<p>
														{restaurant.description || ""} - {restaurant.price}
													</p>
													<p>
														{restaurant.address} - {restaurant.type}
													</p>
													<p>
														{restaurant.distance} - {restaurant.hours}
													</p>
													<Image
														src={restaurant.images[0]}
														alt={restaurant.restaurant_id}
														width={70}
														height={70}
													/>
												</div>
											);
										})}
									</div>
								)}
								{/**show me some museums in milan*/}
								{chat.places_search?.shopping_results && (
									<div>
										{chat?.places_search?.shopping_results?.map((activity) => {
											return (
												<div key={activity.title}>
													<p>
														{activity.title} - {activity.rating}{" "}
														{activity.rating}
													</p>
													<p>{activity.price}</p>
													<Image
														src={activity.thumbnail}
														alt={activity.title}
														width={70}
														height={70}
													/>
													<a href={activity.link}>buy</a>
												</div>
											);
										})}
									</div>
								)}

								{/** local results places  sinc as : shopping malls in milan */}
								{chat.places_search?.local_results?.places && (
									<div>
										{chat.places_search.local_results?.places?.map(
											(activity) => {
												return (
													<div key={activity.place_id}>
														<p>
															{activity.title} - {activity.rating}{" "}
															{activity.rating}
														</p>
														<p>{activity.description}</p>
														<p>{activity.address}</p>
														{/** Contains coordinates */}
														<p>{activity.hours}</p>
														<p>{activity.type}</p>
														<Image
															src={activity.thumbnail}
															alt={activity.title}
															width={70}
															height={70}
														/>
													</div>
												);
											}
										)}
									</div>
								)}
							</div>
						);
					})}
			</div>
			{/** Loadimg */}
			{chat.isLoading && !chat.toolLoading.loading && (
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900"></div>
				</div>
			)}
			{chat.toolLoading.functionName && chat.toolLoading.loading && (
				<div>
					<div className="flex flex-row overflow-x-auto gap-4 px-6 ">
						{new Array(5).fill(0).map((_, index) => (
							<FlightSkeleton key={index} />
						))}
					</div>
				</div>
			)}
			{isAdmin && (
				<form
					className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring m-6"
					x-chunk="dashboard-03-chunk-1"
					onSubmit={callbackSubmit}
				>
					<Label htmlFor="message" className="sr-only">
						Message
					</Label>
					<Input
						id="message"
						placeholder="Type your message here..."
						className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 outline-none"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						disabled={chat.isLoading}
					/>
					<div className="flex items-center p-3 pt-0">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon">
										<Paperclip className="size-4" />
										<span className="sr-only">Attach file</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top">Attach File</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon">
										<Mic className="size-4" />
										<span className="sr-only">Use Microphone</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top">Use Microphone</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<Button
							type="submit"
							disabled={chat.isLoading}
							size="sm"
							className="ml-auto gap-1.5 disabled:opacity-40"
						>
							Send Message
							<CornerDownLeft className="size-3.5" />
						</Button>
					</div>
				</form>
			)}
		</div>
	);
}
