import axios from "axios";
import { AmadeusActivityOffer, AmadeusFlightOffer } from "./socket/chat";

export const saveFlight = async (
	flight: AmadeusFlightOffer,
	itineraryId: string
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/flights`,
		{
			flight,
		}
	);

	return response.data;
};

export const saveHotel = async (
	hotel: AmadeusActivityOffer,
	itineraryId: string
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/hotel`,
		{
			hotel,
		}
	);

	return response.data;
};

export const saveActivity = async (
	activity: AmadeusActivityOffer,
	itineraryId: string
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/activity`,
		{
			activity,
		}
	);

	return response.data;
};

export const removeFlight = async (itineraryId: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/flights/`
	);

	return response.data;
};

export const removeHotel = async (hotelId: string, itineraryId: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/hotel/${hotelId}`
	);

	return response.data;
};

export const removeActivity = async (
	activityId: string,
	itineraryId: string
) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/activity/${activityId}`
	);

	return response.data;
};

export const getItinerary = async (itineraryId: string) => {
	const response = await axios.get(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}`
	);

	return response.data;
};

export const getUserItineraries = async (userId: string) => {
	const response = await axios.get(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/user/${userId}`
	);

	return response.data;
};

export const createNewItinerary = async (userId: string, title: string) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/`,
		{
			userId,
			title,
		}
	);

	return response.data;
};

export const addNewMemberToItinerary = async (
	itineraryId: string,
	userId: string
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/new-member`,
		{
			userId,
		}
	);

	return response.data;
};

export type TravelerInfo = {
	dateOfBirth: string;
	name: {
		firstName: string;
		lastName: string;
	};
	gender: "MALE" | "FEMALE";
	contact: {
		emailAddress: string;
		phones: {
			deviceType: "MOBILE";
			countryCallingCode: string;
			number: string;
		}[];
	};
	documents: {
		documentType: "PASSPORT" | "ID_CARD" | "VISA" | "OTHER";
		birthPlace: string;
		issuanceLocation: string;
		issuanceDate: string;
		number: string;
		expiryDate: string;
		issuanceCountry: string;
		validityCountry: string;
		nationality: string;
		holder: boolean;
	}[];
};

export const updateTravelerInfo = async (
	ItineraryId: string,
	userId: string,
	travelerInfo: TravelerInfo
) => {
	const response = await axios.put(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${ItineraryId}/user/${userId}`,
		{
			travelerInfo,
		}
	);

	return response.data;
};

export const checkIfAllTravelersInfo = async (itineraryId: string) => {
	const response = await axios.get(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/check-travelers-info`
	);

	return response.data;
};

export const confirmPricing = async (itineraryId: string) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/itinerary/${itineraryId}/confirm-pricing`
	);

	return response.data;
};

export const bookItinerary = async (itineraryId: string) => {};
