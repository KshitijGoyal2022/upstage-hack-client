"use client";

import { socket } from "@/socket";
import { useChat } from "@/socket/chat";
import React, { act, useRef } from "react";
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
import HotelCard from "./render/HotelCard";
import RestaurantCard from "./render/RestaurantCard";
import {
	GoogleEventsResult,
	GoogleFlightData,
	GoogleFoodResult,
	GoogleHotelProperty,
	GooglePlacesResult,
} from "@/types/serp";
import { googleApi } from "@/google_api";
import Itinerary from "@/app/itinerary/[id]/page";

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

function groupIntoPairs(arr: any[]) {
	let result = [];

	for (let i = 0; i < arr.length; i += 2) {
		result.push([arr[i], arr[i + 1]]);
	}

	return result;
}

export default function AiPlayground(props: {
	itineraryId: string;
	itinerary: any;
	onRefreshItinerary: () => void;
}) {
	const { user } = useAuth0();
	const [message, setMessage] = React.useState("");

	const viewRef = useRef<HTMLDivElement>(null);

	const [returnFlights, setReturnFlights] =
		React.useState<GoogleFlightData | null>(null);
	const [returnFlightsLoading, setReturnFlightsLoading] =
		React.useState<boolean>(false);

	const chat = useChat(props.itineraryId, socket, viewRef);

	const callbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		chat.sendChat(message);
		setMessage("");
	};

	const callbackSaveFlight = async (
		flight: GoogleFlightData["best_flights"][number],
		date: string
	) => {
		await googleApi.saveOutboundFlight(props.itineraryId, flight, date);
		props?.onRefreshItinerary();
	};

	const callbackSaveRestaurant = async (restaurant: GoogleFoodResult) => {
		await googleApi.saveGoogleRestaurant(props.itineraryId, restaurant);
		props?.onRefreshItinerary();
	};

	const callbackRemoveRestaurant = async (restaurant: GoogleFoodResult) => {
		await googleApi.deleteGoogleRestaurant(props.itineraryId, restaurant.title);
		props?.onRefreshItinerary();
	};

	const callbackSaveHotel = async (hotel: GoogleHotelProperty) => {
		await googleApi.saveHotel(props.itineraryId, hotel);
		props?.onRefreshItinerary();
	};

	const callbackRemoveHotel = async (hotel: GoogleHotelProperty) => {
		await googleApi.deleteGoogleHotel(props.itineraryId, hotel.property_token);
		props?.onRefreshItinerary();
	};

	const callbackSaveTopSights = async (
		topSights: GooglePlacesResult["top_sights"]["sights"][number]
	) => {
		await googleApi.saveTopSights(props.itineraryId, topSights);
		props?.onRefreshItinerary();
	};

	const callbackRemoveTopSights = async (
		topSights: GooglePlacesResult["top_sights"]["sights"][number]
	) => {
		await googleApi.deleteGoogleTopSights(props.itineraryId, topSights.title);
		props?.onRefreshItinerary();
	};

	const callbackSaveLocalResults = async (
		localResults: GooglePlacesResult["local_results"]["places"][number]
	) => {
		await googleApi.saveLocalResults(props.itineraryId, localResults);
		props?.onRefreshItinerary();
	};

	const callbackRemoveLocalResults = async (
		localResults: GooglePlacesResult["local_results"]["places"][number]
	) => {
		await googleApi.deleteGoogleLocalResults(
			props.itineraryId,
			localResults.place_id
		);
		props?.onRefreshItinerary();
	};

	const callbackSaveShoppingResults = async (
		shoppingResults: GooglePlacesResult["shopping_results"][number]
	) => {
		await googleApi.saveGoogleShopping(props.itineraryId, shoppingResults);
		props?.onRefreshItinerary();
	};

	const callbackRemoveShoppingResults = async (
		shoppingResults: GooglePlacesResult["shopping_results"][number]
	) => {
		await googleApi.deleteGoogleShopping(
			props.itineraryId,
			shoppingResults.title
		);
		props?.onRefreshItinerary();
	};

	const callbackSaveEvent = async (
		event: GoogleEventsResult["events_results"][number]
	) => {
		await googleApi.saveGoogleEvents(props.itineraryId, event);
		props?.onRefreshItinerary();
	};

	const callbackRemoveEvent = async (
		event: GoogleEventsResult["events_results"][number]
	) => {
		await googleApi.deleteGoogleEvents(props.itineraryId, event.title);
		props?.onRefreshItinerary();
	};

	const callbackGetReturnFlights = async (params: {
		departure_id: string;
		arrival_id: string;
		departure_token: string;
		outbound_date: string;
		return_date: string;
	}) => {
		setReturnFlightsLoading(true);
		const response = await googleApi.getReturnFlights(params);
		setReturnFlights(response);
		setReturnFlightsLoading(false);
	};

	const callbackSaveReturnFlight = async (
		flight: GoogleFlightData["best_flights"][number],
		date: string
	) => {
		await googleApi.saveReturnFlight(props.itineraryId, flight, date);
		props?.onRefreshItinerary();
	};

	const isAdmin = props.itinerary?.admin?.provider?.id === user?.sub;

	/**
	 * Flight
	 * Hotels x
	 * Top Sights
	 * Events
	 * Restaurants x
	 * Activities
	 * Shopping areas
	 */

	return (
		<div className="col-span-7 h-full flex flex-col">
			<div
				className="flex-1 overflow-y-auto  space-y-8 min-h-[650px] max-h-[800px]"
				ref={viewRef}
			>
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
												return (
													<FlightCard
														flight={flight}
														key={flight?.id}
														isAdmin={isAdmin}
														isSelected={
															flight?.id === props.itinerary?.g_flights?.[0]?.id
														}
														currency={
															chat.flight_offer_search.search_parameters
																?.currency || "USD"
														}
														onPress={() => {
															callbackSaveFlight(
																{
																	...flight,
																	currency:
																		chat.flight_offer_search.search_parameters
																			?.currency || "USD",
																},
																chat.flight_offer_search.search_parameters
																	?.outbound_date
															);

															// fetch return flights
															if (
																chat.flight_offer_search?.search_parameters
																	?.return_date &&
																flight.departure_token
															)
																callbackGetReturnFlights(
																	{
																		departure_id:
																			chat.flight_offer_search
																				?.search_parameters?.departure_id,
																		arrival_id:
																			chat.flight_offer_search
																				?.search_parameters?.arrival_id,
																		departure_token: flight.departure_token,
																		outbound_date:
																			chat.flight_offer_search
																				?.search_parameters?.outbound_date,
																		return_date:
																			chat.flight_offer_search
																				?.search_parameters?.return_date,
																	},
																	chat.flight_offer_search.search_parameters
																		?.return_date
																);
														}}
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
											const selected = props.itinerary?.g_top_sights?.find(
												(h) => h.title === activity.title
											);
											return (
												<div key={activity.title}>
													<p>
														{activity.title} - {activity.rating} (
														{activity.reviews})
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
													<Button
														onClick={() =>
															selected
																? callbackRemoveTopSights(activity)
																: callbackSaveTopSights(activity)
														}
													>
														{selected ? "Remove" : "Add"}
													</Button>
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
												const selected = props.itinerary?.g_events?.find(
													(h) => h.title === event.title
												);
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
														<Button
															onClick={() =>
																selected
																	? callbackRemoveEvent(event)
																	: callbackSaveEvent(event)
															}
														>
															{selected ? "Remove" : "Add"}
														</Button>
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
												const selected = props.itinerary?.g_hotels?.find(
													(h) => h.property_token === hotel.property_token
												);
												return (
													<HotelCard
														hotel={hotel}
														selected={selected}
														key={hotel.property_token}
														onSelect={(hotel) => {
															selected
																? callbackRemoveHotel(hotel)
																: callbackSaveHotel(hotel);
														}}
													/>
												);
											})}
										</div>
									</div>
								)}
								{/**show me some restaurants in new york */}
								{chat.restaurant_search?.local_results && (
									<div>
										<h1 className="font-semibold text-2xl p-6">
											{chat.title.replaceAll('"', "")}
										</h1>
										<div className="px-8 flex flex-row gap-8 overflow-x-auto pb-8">
											{groupIntoPairs(chat.restaurant_search.local_results).map(
												(pair) => {
													return (
														<div className="space-y-8">
															{pair.map((restaurant) => {
																const selected =
																	props.itinerary?.g_restaurants?.find(
																		(h) =>
																			h.restaurant_id ===
																			restaurant.restaurant_id
																	);
																return (
																	<RestaurantCard
																		selected={selected}
																		restaurant={restaurant}
																		onSelect={(restaurant) => {
																			selected
																				? callbackRemoveRestaurant(restaurant)
																				: callbackSaveRestaurant(restaurant);
																		}}
																	/>
																);
															})}
														</div>
													);
												}
											)}
										</div>
									</div>
								)}
								{/**show me some museums in milan*/}
								{chat.places_search?.shopping_results && (
									<div>
										<h1 className="font-semibold text-2xl p-6">{chat.title}</h1>
										{chat?.places_search?.shopping_results?.map((activity) => {
											const selected = props.itinerary?.g_shopping?.find(
												(h) => h.title === activity.title
											);
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

													<Button
														onClick={() =>
															selected
																? callbackRemoveShoppingResults(activity)
																: callbackSaveShoppingResults(activity)
														}
													>
														{selected ? "Remove" : "Add"}
													</Button>
												</div>
											);
										})}
									</div>
								)}

								{/** local results places  sinc as : shopping malls in milan */}
								{chat.places_search?.local_results?.places && (
									<div>
										<h1 className="font-semibold text-2xl p-6">{chat.title}</h1>
										{chat.places_search.local_results?.places?.map(
											(activity) => {
												const selected = props.itinerary?.g_local_results?.find(
													(h) => h.place_id === activity.place_id
												);
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
														<Button
															onClick={() =>
																selected
																	? callbackRemoveLocalResults(activity)
																	: callbackSaveLocalResults(activity)
															}
														>
															{selected ? "Remove" : "Add"}
														</Button>
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
