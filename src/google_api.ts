import axios from "axios";
import {
	GoogleEventsResult,
	GoogleFlightData,
	GoogleFoodResult,
	GoogleHotelProperty,
	GooglePlacesResult,
} from "./types/serp";

const saveOutboundFlight = async (
	itineraryId: string,
	flight: GoogleFlightData["best_flights"][number]
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/outbound-flight`,
		{
			flight,
		}
	);

	return response.data;
};

const saveReturnFlight = async (
	itineraryId: string,
	flight: GoogleFlightData["best_flights"][number]
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/return-flight`,
		{
			flight,
		}
	);

	return response.data;
};

const saveHotel = async (itineraryId: string, hotel: GoogleHotelProperty) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/hotel`,
		{
			hotel,
		}
	);

	return response.data;
};

const saveTopSights = async (
	itineraryId: string,
	topSights: GooglePlacesResult["top_sights"]["sights"][number]
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/top-sights`,
		{
			topSights,
		}
	);

	return response.data;
};

const saveLocalResults = async (
	itineraryId: string,
	localResults: GooglePlacesResult["local_results"]["places"][number]
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/local-results`,
		{
			localResults,
		}
	);

	return response.data;
};

const saveGoogleRestaurant = async (
	itineraryId: string,
	restaurants: GoogleFoodResult
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/restaurant`,
		{
			restaurants,
		}
	);

	return response.data;
};

const saveGoogleShopping = async (
	itineraryId: string,
	shopping: GooglePlacesResult["shopping_results"][number]
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/shopping`,
		{
			shopping,
		}
	);

	return response.data;
};

const saveGoogleEvents = async (
	itineraryId: string,
	events: GoogleEventsResult["events_results"][number]
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/events`,
		{
			events,
		}
	);

	return response.data;
};

const deleteGoogleOutboundFlight = async (itineraryId: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/outbound-flight`
	);

	return response.data;
};

const deleteGoogleReturnFlight = async (itineraryId: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/return-flight`
	);

	return response.data;
};

const deleteGoogleHotel = async (itineraryId: string, hotelId: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/hotel/${hotelId}`
	);

	return response.data;
};

const deleteGoogleTopSights = async (
	itineraryId: string,
	topSightsId: string
) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/top-sights/${topSightsId}`
	);

	return response.data;
};

const deleteGoogleLocalResults = async (
	itineraryId: string,
	localResultsId: string
) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/local-results/${localResultsId}`
	);

	return response.data;
};

const deleteGoogleRestaurant = async (
	itineraryId: string,
	restaurantId: string
) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/restaurant/${restaurantId}`
	);

	return response.data;
};

const deleteGoogleShopping = async (
	itineraryId: string,
	shoppingId: string
) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/shopping/${shoppingId}`
	);

	return response.data;
};

const deleteGoogleEvents = async (itineraryId: string, eventsId: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/events/${eventsId}`
	);

	return response.data;
};

export const googleApi = {
	saveOutboundFlight,
	saveReturnFlight,
	saveHotel,
	saveTopSights,
	saveLocalResults,
	saveGoogleRestaurant,
	saveGoogleShopping,
	saveGoogleEvents,
	deleteGoogleOutboundFlight,
	deleteGoogleReturnFlight,
	deleteGoogleHotel,
	deleteGoogleTopSights,
	deleteGoogleLocalResults,
	deleteGoogleRestaurant,
	deleteGoogleShopping,
	deleteGoogleEvents,
};
