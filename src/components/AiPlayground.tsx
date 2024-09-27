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
import { Skeleton } from "@/components/ui/skeleton";
import RenderHotelMap from "./renders/RenderHotelMap";
import { saveActivity, saveFlight, saveHotel } from "@/apis";
import { useAuth0 } from "@auth0/auth0-react";
import { generateFlightOfferUniqueId } from "@/helpers";

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
								{(chat.list_hotels_in_city && (
									<div>
										<h1 className="font-semibold text-2xl p-6">{chat.title}</h1>
										<RenderHotelMap hotels={chat.list_hotels_in_city} />
										<div className="flex flex-row overflow-x-auto gap-4 px-6 ">
											{chat.list_hotels_in_city?.map((hotel) => {
												return (
													<HotelCard
														hotel={hotel}
														key={hotel.hotelId}
														isAdmin={isAdmin}
														onPress={() => callbackSaveHotel(hotel)}
													/>
												);
											})}
										</div>
									</div>
								)) ||
									(chat.list_hotels_in_city === null && (
										<p className="text-center">
											Sorry, we could not find any hotel
										</p>
									))}

								{(chat.points_of_interest && (
									<div>
										<h1 className="font-semibold text-2xl p-6">{chat.title}</h1>
										<RenderPOIMap activities={chat.points_of_interest} />

										<div className="flex flex-row overflow-x-auto gap-4 px-6 ">
											{chat.points_of_interest?.map((place) => {
												const mapboxId = place.properties.mapbox_id;
												const isSelected =
													selectedActivitiesMapboxIds.has(mapboxId);
												return (
													<ActivityCard
														activity={place}
														key={place.properties.mapbox_id}
														isAdmin={isAdmin}
														isSelected={isSelected}
														onPress={() => {
															if (
																place.properties.poi_category.some((tag) =>
																	hotel_tags_set.has(tag)
																)
															) {
																callbackSaveHotel(place);
															} else {
																callbackSaveActivity(place);
															}
														}}
													/>
												);
											})}
										</div>
									</div>
								)) ||
									(chat.points_of_interest === null && (
										<p className="text-center">
											Sorry, we could not find any result.
										</p>
									))}
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
