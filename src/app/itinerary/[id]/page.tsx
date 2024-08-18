"use client";

import React from "react";

import Chat from "@/components/chat";
import Sidebar from "@/components/sidebar";

import AiPlayground from "@/components/AiPlayground";
import { getItinerary } from "@/apis";
import { useAuth0 } from "@auth0/auth0-react";
import { useItinerary } from "@/useItinerary";

const Itinerary = ({ params }: any) => {
	const { user, isLoading: authLoading } = useAuth0();
	const { id } = params;

	const { itinerary, isLoading, onRefreshItinerary } = useItinerary(id);

	if (authLoading) {
		return <div>Authenticating...</div>;
	}

	if (isLoading) {
		return <div>Loading itinerary...</div>;
	}

	if (!itinerary) {
		return <div>We would not find the itinerary with this id.</div>;
	}

	if (
		itinerary?.users?.findIndex((u) => u?.user?.provider?.id === user?.sub) ===
		-1
	) {
		return (
			<div>
				<div>Not a member</div>
				<p>You are not a member. You need to have access in order to enter.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-12 max-h-max relative">
			<div className="col-span-2 border-r h-full sticky top-0">
				<Sidebar />
			</div>

			{/* Main Content - Itinerary Details */}
			<AiPlayground
				itineraryId={id}
				itinerary={itinerary}
				onRefreshItinerary={onRefreshItinerary}
			/>

			{/* Chat Component */}
			<div className="col-span-3 h-full border-l">
				<Chat itineraryId={id} />
			</div>
		</div>
	);
};

export default Itinerary;
