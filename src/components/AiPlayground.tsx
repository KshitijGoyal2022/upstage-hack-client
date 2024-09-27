"use client";

import { socket } from "@/socket";
import { useChat } from "@/socket/chat";
import React from "react";
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
import { HotelCard } from "./renders/RenderHotels";
import { ActivityCard } from "./renders/RenderPointOfInterests";
import RenderPOIMap from "./renders/RenderPOIMap";
import RenderHotelMap from "./renders/RenderHotelMap";
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

	const chat = useChat(socket);
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
			<div className="flex-1 overflow-y-auto p-4 space-y-8 min-h-[650px] max-h-[800px]">
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
										{chat.hotel_search.properties.map((hotel) => {
											return (
												<div key={hotel.property_token}>
													<p>
														{hotel.name} - {hotel.overall_rating} (
														{hotel.reviews})
													</p>
													<p>Ameneties: {hotel.amenities.toString()}</p>
													<p>Check in: {hotel.check_in_time}</p>
													<p>Check out: {hotel.check_out_time}</p>
													<p>Info: {hotel.essential_info?.toString()}</p>
													<p>
														Price: {hotel.rate_per_night.lowest} - Total:{" "}
														{hotel.total_rate.lowest}
													</p>
													<Image
														src={hotel.images[0].thumbnail}
														alt={hotel.name}
														width={70}
														height={70}
													/>
													<a href={hotel.link}>Buy</a>
												</div>
											);
										})}
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
								{/**show me some activities in vancouver */}
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
