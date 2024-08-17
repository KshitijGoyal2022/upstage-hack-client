"use client";

import { FlightOffer$1 } from "@/types/amadeus";
import { PointsOfInterest } from "@/types/mapbox";
/**
 * Chat socket implementation
 */

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export const useChat = (socket: Socket) => {
	const [chats, setChats] = useState<ChatPayload[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	useEffect(() => {
		socket.on("chat", (data: ChatPayload) => {
			setChats((prev) => [...prev, data]);
		});

		socket.on("chat:loading", (loading: boolean) => {
			setIsLoading(loading);
		});
	}, [socket]);

	const sendChat = React.useCallback(
		(value: string) => {
			console.log("SENDING CHAT", value);
			socket.emit("chat", value);
		},
		[socket]
	);

	return React.useMemo(
		() => ({ chats, sendChat, isLoading }),
		[chats, sendChat, isLoading]
	);
};

export type AmadeusFlightOffer = FlightOffer$1;
export interface AmadeusHotelOffer {
	chainCode: string;
	iataCode: string;
	dupeId: number;
	name: string;
	hotelId: string;
	geoCode: {
		latitude: number;
		longitude: number;
	};
	address: { countryCode: string };
	lastUpdate: string;
}
export type AmadeusActivityOffer = PointsOfInterest;

interface ChatPayload {
	flight_offer_search: AmadeusFlightOffer[];
	list_hotels_in_city: AmadeusHotelOffer[];
	points_of_interest: AmadeusActivityOffer[];
}
