"use client";

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { getUserItineraries } from "./apis";

export const useMyItineraries = () => {
	const { user } = useAuth0();
	const [itineraries, setItineraries] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (user?.sub) {
			(async () => {
				setLoading(true);
				const results = await getUserItineraries(user?.sub as string);
				setItineraries(results);
				setLoading(false);
			})();
		}
	}, [user?.sub]);

	return {
		itineraries,
		loading,
	};
};
