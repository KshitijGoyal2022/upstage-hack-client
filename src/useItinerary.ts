"use client";
import React from "react";
import { getItinerary } from "./apis";

export const useItinerary = (id: string) => {
	const [itinerary, setItinerary] = React.useState<any>(null);
	const [isLoading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		(async () => {
			const itinerary = await getItinerary(id);
			setLoading(false);
			setItinerary(itinerary);
		})();
	}, [id]);

	return {
		itinerary,
		isLoading,
	};
};
