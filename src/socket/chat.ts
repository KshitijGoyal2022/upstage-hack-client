"use client";

import { saveActivity, saveFlight, saveHotel } from "@/apis";
import { FlightOffer$1 } from "@/types/amadeus";
import { PointsOfInterest } from "@/types/mapbox";
import { SerpFlight } from "@/types/serp";
/**
 * Chat socket implementation
 */

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export const useChat = (socket: Socket) => {
	const [chats, setChats] = useState<ChatPayload[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [toolLoading, setToolLoading] = useState<any>({
		functionName: "",
		loading: false,
	});
	useEffect(() => {
		socket.on("chat", (data: ChatPayload) => {
			setChats((prev) => [...prev, data]);
		});

		socket.on("chat:loading", (loading: boolean) => {
			setIsLoading(loading);
		});

		socket.on(
			"chat:loading:tool_call",
			(payload: { funcitonName: string; loading: boolean }) => {
				setToolLoading(payload);
			}
		);
	}, [socket]);

	const sendChat = React.useCallback(
		(value: string) => {
			console.log("SENDING CHAT", value);
			socket.emit("chat", value);
		},
		[socket]
	);

	return React.useMemo(
		() => ({
			chats,
			sendChat,
			isLoading,
			toolLoading,
		}),
		[chats, sendChat, isLoading, toolLoading]
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
	flight_offer_search: SerpFlight;
	list_hotels_in_city: AmadeusHotelOffer[];
	points_of_interest: AmadeusActivityOffer[];
	title: string;
}
