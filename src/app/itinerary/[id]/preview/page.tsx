"use client";
import { FlightCard } from "@/components/renders/RenderFlights";
import { HotelCard } from "@/components/renders/RenderHotels";
import RenderPOIMap from "@/components/renders/RenderPOIMap";
import { ActivityCard } from "@/components/renders/RenderPointOfInterests";
import { useItinerary } from "@/useItinerary";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

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

	const { itinerary, isLoading } = useItinerary(id);
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

	const flightOffer = itinerary?.flight;
	const hotelOffers = itinerary?.hotels;
	const activityOffers = itinerary?.activities;

	const restaurantsOffers = activityOffers.filter((activity) =>
		activity.properties.poi_category.some((category) =>
			restaurant_tags_set.has(category)
		)
	);
	const activitiesWithoutRestaurants = activityOffers.filter(
		(activity) =>
			!activity.properties.poi_category.some((category) =>
				restaurant_tags_set.has(category)
			)
	);

	return (
		<div className="flex flex-row  m-12 gap-8">
			{flightOffer && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Your Flights</h2>
					<FlightCard
						flight={flightOffer}
						isAdmin={isAdmin}
						isSelected
						currency={flightOffer?.currency || "USD"}
					/>
				</div>
			)}

			{hotelOffers.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Your Hotels</h2>
					<RenderPOIMap activities={hotelOffers} />
					{hotelOffers.map((hotel) => (
						<ActivityCard
							activity={hotel}
							key={hotel.properties.mapbox_id}
							isAdmin={isAdmin}
							isSelected
						/>
					))}
				</div>
			)}
			{activitiesWithoutRestaurants.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Your Activities</h2>
					<>
						<RenderPOIMap activities={activitiesWithoutRestaurants} />
						{activitiesWithoutRestaurants.map((activity) => (
							<ActivityCard
								activity={activity}
								key={activity.properties.mapbox_id}
								isAdmin={isAdmin}
								isSelected
							/>
						))}
					</>
				</div>
			)}
			{restaurantsOffers.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Your Dinings</h2>
					<RenderPOIMap activities={restaurantsOffers} />
					{restaurantsOffers.map((activity) => (
						<ActivityCard
							activity={activity}
							key={activity.properties.mapbox_id}
							isAdmin={isAdmin}
							isSelected
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default PreviewPage;
