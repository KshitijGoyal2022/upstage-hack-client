"use client";
import HotelCard from "@/components/render/HotelCard";
import RestaurantCard from "@/components/render/RestaurantCard";
import { FlightCard } from "@/components/renders/RenderFlights";
import RenderPOIMap from "@/components/renders/RenderPOIMap";
import { ActivityCard } from "@/components/renders/RenderPointOfInterests";
import { googleApi } from "@/google_api";
import { GoogleFoodResult, GoogleHotelProperty } from "@/types/serp";
import { useItinerary } from "@/useItinerary";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { message as amessage } from "antd";

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
		</div>
	);
}

export default PreviewPage;
