"use client";

import { saveActivity, saveFlight, saveHotel } from "@/apis";
import { FlightOffer$1 } from "@/types/amadeus";
import { PointsOfInterest } from "@/types/mapbox";
import {
	GoogleEventsResult,
	GoogleFlightData,
	GoogleFoodResponse,
	GoogleHotels,
	GooglePlacesResult,
	SerpFlight,
} from "@/types/serp";
/**
 * Chat socket implementation
 */

import React, { RefObject, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export const useChat = (
	id: string,
	socket: Socket,
	viewRef: RefObject<HTMLDivElement>
) => {
	const [chats, setChats] = useState<ChatPayload[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [toolLoading, setToolLoading] = useState<any>({
		functionName: "",
		loading: false,
	});
	useEffect(() => {
		socket.on("chat", (data: ChatPayload) => {
			setChats((prev) => [...prev, data]);
			// scroll to bottom
			if (viewRef.current) {
				viewRef.current.scrollTop = viewRef.current.scrollHeight;
			}
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
			socket.emit("chat", {
				id,
				value,
			});
		},
		[socket, id]
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
	flight_offer_search: GoogleFlightData;
	hotel_search: GoogleHotels;
	restaurant_search: GoogleFoodResponse;
	event_search: GoogleEventsResult;
	places_search: GooglePlacesResult;
	title: string;
}
