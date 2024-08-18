import axios from "axios";
import { AmadeusActivityOffer, AmadeusFlightOffer } from "./socket/chat";

export const saveFlight = async (
	flight: AmadeusFlightOffer,
	itineraryId: string
) => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/${itineraryId}/flights`,
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
		`${process.env.NEXT_PUBLIC_SERVER_URL}/${itineraryId}/hotel`,
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
		`${process.env.NEXT_PUBLIC_SERVER_URL}/${itineraryId}/activity`,
		{
			activity,
		}
	);

	return response.data;
};

export const removeFlight = async (itineraryId: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/${itineraryId}/flights/`
	);

	return response.data;
};

export const removeHotel = async (hotelId: string, itineraryId: string) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/${itineraryId}/hotel/${hotelId}`
	);

	return response.data;
};

export const removeActivity = async (
	activityId: string,
	itineraryId: string
) => {
	const response = await axios.delete(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/${itineraryId}/activity/${activityId}`
	);

	return response.data;
};
