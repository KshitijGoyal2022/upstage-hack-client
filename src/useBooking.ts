"use client";
import React from "react";
import { getBooking, getItinerary } from "./apis";

export const useBooking = (id: string) => {
	const [itinerary, setItinerary] = React.useState<any>(null);
	const [isLoading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		(async () => {
			const itinerary = await getBooking(id);
			setLoading(false);
			setItinerary(itinerary);
		})();
	}, [id]);

	const onRefreshBooking = async () => {
		const itinerary = await getBooking(id);
		setItinerary(itinerary);
	};

	return {
		booking: itinerary,
		isLoading,
		onRefreshBooking,
	};
};
