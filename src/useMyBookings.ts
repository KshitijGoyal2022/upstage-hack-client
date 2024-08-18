"use client";

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { getUserBookings, getUserItineraries } from "./apis";

export const useMyBookings = () => {
	const { user } = useAuth0();
	const [itineraries, setItineraries] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (user?.sub) {
			(async () => {
				setLoading(true);
				const results = await getUserBookings(user?.sub as string);
				setItineraries(results);
				setLoading(false);
			})();
		}
	}, [user?.sub]);

	return {
		bookings: itineraries,
		loading,
	};
};
