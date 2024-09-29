"use client";
import HotelCard from "@/components/render/HotelCard";
import RestaurantCard from "@/components/render/RestaurantCard";
import { FlightCard } from "@/components/renders/RenderFlights";
import RenderPOIMap from "@/components/renders/RenderPOIMap";
import { ActivityCard } from "@/components/renders/RenderPointOfInterests";
import { googleApi } from "@/google_api";
import {
	GoogleEventsResult,
	GoogleFoodResult,
	GoogleHotelProperty,
	GooglePlacesResult,
} from "@/types/serp";
import { useItinerary } from "@/useItinerary";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { message as amessage } from "antd";
import Image from "next/image";
import { Paperclip, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const restaurant_tags_set = new Set([
	"restaurant",
	"food_and_drink",
	"food",
	"fast_food",
	"breakfast_restaurant",
	"mexican_restaurant",
	"italian_restaurant",
	"diner_restaurant",
	"buffet_restaurant",
	"taco_shop",
	"barbeque_restaurant",
	"steakhouse",
	"snack_bar",
	"sushi_restaurant",
	"french_restaurant",
	"fish_and_chips_restaurant",
	"wings_joint",
	"burger_restaurant",
	"pizza_restaurant",
	"thai_restaurant",
	"chinese_restaurant",
	"greek_restaurant",
	"spanish_restaurant",
	"asian_restaurant",
	"turkish_restaurant",
	"american_restaurant",
	"seafood_restaurant",
	"middle_eastern_restaurant",
	"noodle_restaurant",
	"ramen_restaurant",
	"vietnamese_restaurant",
	"brazilian_restaurant",
	"carribean_restaurant",
	"indonesian_restaurant",
	"filipino_restaurant",
	"creole_restaurant",
	"peruvian_restaurant",
	"korean_restaurant",
	"gluten_free_restaurant",
	"korean_barbeque_restaurant",
	"hawaiian_restaurant",
	"african_restaurant",
	"portuguese_restaurant",
	"cuban_restaurant",
	"english_restaurant",
	"persian_restaurant",
]);

function PreviewPage({ params }: any) {
	const { user, isLoading: authLoading } = useAuth0();
	const { id } = params;
	const { itinerary, isLoading, onRefreshItinerary } = useItinerary(id);

	const callbackRemoveRestaurant = async (restaurant: GoogleFoodResult) => {
		await googleApi.deleteGoogleRestaurant(id, restaurant.title);
		onRefreshItinerary();
		amessage.success(`Removed ${restaurant.title} from your itinerary`);
	};

	const callbackRemoveHotel = async (hotel: GoogleHotelProperty) => {
		await googleApi.deleteGoogleHotel(id, hotel.property_token);
		onRefreshItinerary();
		amessage.success(`Removed ${hotel.name} from your itinerary`);
	};

	const callbackRemoveTopSights = async (
		topSights: GooglePlacesResult["top_sights"]["sights"][number]
	) => {
		await googleApi.deleteGoogleTopSights(id, topSights.title);
		onRefreshItinerary();
		amessage.success(`${topSights.title} removed from itinerary`);
	};

	const callbackRemoveEvent = async (
		event: GoogleEventsResult["events_results"][number]
	) => {
		await googleApi.deleteGoogleEvents(id, event.title);
		onRefreshItinerary();
		amessage.success(`${event.title} removed from itinerary`);
	};

	const callbackRemoveLocalResults = async (
		localResults: GooglePlacesResult["local_results"]["places"][number]
	) => {
		await googleApi.deleteGoogleLocalResults(id, localResults.place_id);
		onRefreshItinerary();
		amessage.success(`${localResults.title} removed from itinerary`);
	};

	const callbackRemoveShoppingResults = async (
		shoppingResults: GooglePlacesResult["shopping_results"][number]
	) => {
		await googleApi.deleteGoogleShopping(id, shoppingResults.title);
		onRefreshItinerary();
		amessage.success(`${shoppingResults.title} removed from itinerary`);
	};

	if (authLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-semibold text-gray-600">Authenticating...</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-semibold text-gray-600">
					Loading itinerary...
				</p>
			</div>
		);
	}

	if (!itinerary) {
		return (
			<div className="flex flex-col items-center justify-center h-screen space-y-4">
				<h2 className="text-2xl font-semibold text-red-600">
					Itinerary Not Found
				</h2>
				<p className="text-lg text-gray-600">
					We could not find the itinerary with this id.
				</p>
			</div>
		);
	}

	if (
		itinerary?.users?.findIndex((u) => u?.user?.provider?.id === user?.sub) ===
		-1
	) {
		return (
			<div className="flex flex-col items-center justify-center h-screen space-y-4">
				<h2 className="text-2xl font-semibold text-red-600">Not a Member</h2>
				<p className="text-lg text-gray-600">
					You are not a member. You need to have access in order to enter.
				</p>
			</div>
		);
	}
	const isAdmin = itinerary?.admin?.provider?.id === user?.sub;

	return (
		<div className="flex flex-row  m-12 gap-8">
			{itinerary?.g_flights?.[0] && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Your Outbound Flight</h2>
					<FlightCard
						flight={itinerary?.g_flights?.[0]}
						isAdmin={isAdmin}
						isSelected
						currency={itinerary?.g_flights?.[0]?.currency || "USD"}
					/>
				</div>
			)}
			{itinerary?.g_flights?.[1] && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Your Return Flight</h2>
					<FlightCard
						flight={itinerary?.g_flights?.[1]}
						isAdmin={isAdmin}
						isSelected
						currency={itinerary?.g_flights?.[1]?.currency || "USD"}
					/>
				</div>
			)}
			{itinerary?.g_hotels?.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Your Hotels</h2>
					<div className=" flex flex-col gap-4">
						{itinerary.g_hotels.map((hotel) => (
							<HotelCard
								hotel={hotel}
								key={hotel.id}
								selected
								onSelect={() => {
									callbackRemoveHotel(hotel);
								}}
							/>
						))}
					</div>
				</div>
			)}
			{itinerary?.g_restaurants?.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4 flex items-center">
						Your Restaurants{" "}
						<span className="text-sm font-normal ml-4">(click to remove)</span>
					</h2>
					<div className=" flex flex-col gap-4">
						{itinerary.g_restaurants.map((restaurant) => (
							<RestaurantCard
								restaurant={restaurant}
								key={restaurant.id}
								onSelect={() => {
									callbackRemoveRestaurant(restaurant);
								}}
							/>
						))}
					</div>
				</div>
			)}
			{itinerary?.g_top_sights?.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4 flex items-center">
						Your Sights{" "}
						<span className="text-sm font-normal ml-4">(click to remove)</span>
					</h2>
					<div className=" flex flex-col gap-4">
						{itinerary.g_top_sights.map((activity) => (
							<div
								key={activity.title}
								className="group relative overflow-hidden border rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 bg-white"
								style={{ minHeight: "480px" }} // Ensures card height
							>
								{/* Image Section with Overlay */}
								<div className="relative w-full h-56 overflow-hidden rounded-t-xl">
									<Image
										src={activity.thumbnail}
										alt={activity.title}
										layout="fill"
										objectFit="cover"
										className="group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-black bg-opacity-25 transition-opacity group-hover:bg-opacity-40"></div>
								</div>

								{/* Information Section */}
								<div className="p-4">
									<h2 className="font-bold text-xl truncate text-gray-900">
										{activity.title}
									</h2>

									{/* Activity Description */}
									<p className="mt-1 text-sm text-gray-600 line-clamp-2">
										{activity.description}
									</p>

									{/* Price */}
									<div className="flex items-center gap-2 mt-3">
										<Tag className="w-4 h-4 text-gray-600" />
										<p className="font-semibold text-lg text-gray-700">
											{activity.price ? `${activity.price}` : "Free"}
										</p>
									</div>

									{/* Rating and Reviews */}
									<div className="flex items-center mt-2 space-x-1 text-yellow-500">
										<Star className="w-5 h-5" />
										<p className="text-sm">{activity.rating}</p>
										<p className="text-sm text-gray-500">
											({activity.reviews} reviews)
										</p>
									</div>

									{/* Divider */}
									<hr className="my-3 border-gray-200" />

									{/* Add/Remove Button */}
									<div className="absolute bottom-4 left-4 right-4">
										<Button
											onClick={() => callbackRemoveTopSights(activity)}
											className={`w-full py-2 text-white transition ${"bg-gray-500 hover:bg-gray-600"}`}
										>
											{"Remove from Itinerary"}
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{itinerary?.g_events?.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4 flex items-center">
						Your events{" "}
					</h2>
					<div className=" flex flex-col gap-4">
						{itinerary.g_events.map((event) => (
							<div
								key={event.title}
								className="group relative overflow-hidden border rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 bg-white"
								style={{ minHeight: "480px" }}
							>
								{/* Event Thumbnail */}
								<div className="relative w-full h-56 overflow-hidden rounded-t-xl">
									<Image
										src={event.thumbnail}
										alt={event.title}
										layout="fill"
										objectFit="cover"
										className="group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-black bg-opacity-25 transition-opacity group-hover:bg-opacity-40"></div>
								</div>

								{/* Event Info */}
								<div className="p-4 space-y-2">
									<h2 className="font-bold text-xl truncate text-gray-900">
										{event.title}
									</h2>
									<p className="text-sm text-gray-600">
										{event.date.start_date} - {event.date.when}
									</p>
									<p className="text-sm text-gray-600 line-clamp-2">
										{event.description}
									</p>

									{/* Ticket Info */}
									<div className="mt-4">
										<a
											href={event.ticket_info[0].link}
											className="text-blue-600 hover:underline flex items-center gap-1"
										>
											<Paperclip className="w-4 h-4" />
											{event.ticket_info[0].source}
										</a>
									</div>
								</div>

								{/* Action Button */}
								<div className="absolute bottom-4 left-4 right-4">
									<Button
										onClick={() => callbackRemoveEvent(event)}
										className={`w-full py-2 text-white transition ${"bg-gray-500 hover:bg-gray-600"}`}
									>
										{"Remove from Itinerary"}
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{itinerary?.g_local_results?.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4 flex items-center">
						Your Local Areas{" "}
					</h2>
					<div className=" flex flex-col gap-4">
						{itinerary.g_local_results.map((activity) => (
							<div
								key={activity.place_id}
								className="border rounded-lg p-4 shadow-md hover:shadow-lg bg-white"
							>
								{/* Thumbnail Image */}
								<div className="relative w-full h-40">
									<Image
										src={activity.thumbnail}
										alt={activity.title}
										layout="fill"
										objectFit="cover"
										className="rounded-lg"
									/>
								</div>

								{/* Activity Title */}
								<h2 className="font-bold mt-4 truncate">{activity.title}</h2>

								{/* Price */}
								<p className="font-semibold text-lg mt-2 text-gray-700">
									{activity.price ? `$${activity.price}` : "Free"}
								</p>

								{/* Provider Name */}
								<p className="text-sm text-gray-500">
									{activity.provider ? activity.provider : "Unknown Provider"}
								</p>

								{/* Rating */}
								<div className="flex items-center mt-2">
									<p className="text-sm text-yellow-500 flex items-center gap-1">
										<Star className="w-4 h-4" />
										{activity.rating}
									</p>
									<p className="text-sm text-gray-500 ml-2">
										({activity.reviews ? activity.reviews : "No Reviews"})
									</p>
								</div>

								{/* Add/Remove Button */}
								<div className="mt-4">
									<Button
										onClick={() => callbackRemoveLocalResults(activity)}
										className={`w-full py-2 text-white transition ${"bg-gray-500 hover:bg-gray-600"}`}
									>
										{"Remove"}
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{itinerary?.g_places_shopping?.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4 flex items-center">
						Your Shopping places{" "}
						<span className="text-sm font-normal ml-4">(click to remove)</span>
					</h2>
					<div className=" flex flex-col gap-4">
						{itinerary.g_places_shopping.map((activity) => (
							<div
								key={activity.title}
								className="group relative overflow-hidden border rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 bg-white"
								style={{ minHeight: "450px" }}
							>
								{/* Activity Thumbnail */}
								<div className="relative w-full h-56 overflow-hidden rounded-t-xl">
									<Image
										src={activity.thumbnail}
										alt={activity.title}
										layout="fill"
										objectFit="cover"
										className="group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-black bg-opacity-25 transition-opacity group-hover:bg-opacity-40"></div>
								</div>

								{/* Activity Info */}
								<div className="p-4 space-y-2">
									<h2 className="font-bold text-xl truncate text-gray-900">
										{activity.title}
									</h2>
									<p className="font-semibold text-lg text-gray-700">
										{activity.price ? `$${activity.price}` : "Free"}
									</p>

									{/* Rating */}
									<div className="flex items-center mt-2 text-yellow-500">
										<Star className="w-4 h-4" />
										<p className="ml-1 text-sm">{activity.rating}</p>
									</div>

									{/* Buy Now Link */}
									<a
										href={activity.link}
										className="mt-2 text-blue-600 hover:underline"
									>
										Buy Now
									</a>
								</div>

								{/* Action Button */}
								<div className="absolute bottom-4 left-4 right-4">
									<Button
										onClick={() => callbackRemoveShoppingResults(activity)}
										className={`w-full py-2 text-white transition ${"bg-gray-500 hover:bg-gray-600"}`}
									>
										{"Remove from Itinerary"}
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default PreviewPage;
