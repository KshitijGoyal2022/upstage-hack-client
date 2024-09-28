import axios from "axios";
import {
	GoogleEventsResult,
	GoogleFlightData,
	GoogleFoodResult,
	GoogleHotelProperty,
	GooglePlacesResult,
} from "./types/serp";

const getReturnFlights = async (params: {
	departure_id: string;
	arrival_id: string;
	departure_token: string;
	outbound_date: string;
	return_date: string;
}) => {
	const response = await axios.get(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/return-flights`,
		{
			params,
		}
	);

	return response.data;
};

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
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/restaurants`,
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

const deleteGoogleHotel = async (
	itineraryId: string,
	property_token: string
) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/hotel/${property_token}`
	);

	return response.data;
};

const deleteGoogleTopSights = async (itineraryId: string, title: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/top-sights/${title}`
	);

	return response.data;
};

const deleteGoogleLocalResults = async (
	itineraryId: string,
	placeId: string
) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/local-results/${placeId}`
	);

	return response.data;
};

const deleteGoogleRestaurant = async (itineraryId: string, title: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/restaurants/${title}`
	);

	return response.data;
};

const deleteGoogleShopping = async (itineraryId: string, title: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/shopping/${title}`
	);

	return response.data;
};

const deleteGoogleEvents = async (itineraryId: string, title: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/google/events/${title}`
	);

	return response.data;
};

export const googleApi = {
	getReturnFlights,
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
