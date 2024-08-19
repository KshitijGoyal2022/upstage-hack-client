import { AmadeusFlightOffer } from "./socket/chat";
import { SerpFlight } from "./types/serp";

export function convertISODurationToTime(isoDuration: string) {
	// Use a regular expression to extract days, hours, and minutes from the ISO 8601 duration
	const regex = /P(?:T(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?)/;
	const matches = isoDuration.match(regex) as any;

	let days = 0;
	let hours = 0;
	let minutes = 0;

	if (matches[1]) {
		// Convert days to hours (24 hours per day)
		days = parseInt(matches[1], 10) * 24;
	}

	if (matches[2]) {
		// Convert string hours to integer
		hours = parseInt(matches[2], 10);
	}

	if (matches[3]) {
		// Convert string minutes to integer
		minutes = parseInt(matches[3], 10);
	}

	// Total hours calculation including days converted to hours
	hours += days;

	// Format the time string; pad with zeros if necessary
	const formattedTime = `${hours.toString().padStart(2, "0")}h ${minutes
		.toString()
		.padStart(2, "0")}m`;
	return formattedTime;
}

export function millisecondsToDuration(minutes: number) {
	// Convert milliseconds to total seconds

	// Calculate hours
	const hours = Math.floor(minutes / 60);

	// Calculate remaining minutes

	// Calculate remaining seconds

	// Format the hours, minutes, and seconds to always have two digits
	const formattedHours = String(hours).padStart(2, "0");
	const formattedMinutes = String((minutes % hours) * 60).padStart(2, "0");

	// Combine them into the HH:MM:SS format
	return `${formattedHours}h ${formattedMinutes}min`;
}

export const generateFlightOfferUniqueId = (
	flight: SerpFlight["best_flights"][number]
) => {
	if (!flight?.flights?.length) {
		return "";
	}
	const idParts = flight.flights.map(
		(flight) =>
			`${flight.departure_airport.id}-${flight.arrival_airport.id}-${flight.flight_number}-${flight.departure_airport.time}`
	);

	// Join all parts into one string
	const rawId = idParts.join("|");

	return rawId;
};
export function makeItineraryid(length) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}
