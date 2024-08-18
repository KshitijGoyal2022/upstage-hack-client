"use client";

import React from "react";

import Chat from "@/components/chat";
import Sidebar from "@/components/sidebar";

import AiPlayground from "@/components/AiPlayground";

const Itinerary = ({ params }: any) => {
	const { id } = params;

	return (
		<div className="grid grid-cols-12 h-max">
			<div className="col-span-2 border-r h-full">
				<Sidebar />
			</div>

			{/* Main Content - Itinerary Details */}
			<AiPlayground />

			{/* Chat Component */}
			<div className="col-span-3 h-full border-l">
				<Chat itineraryId={id} />
			</div>
		</div>
	);
};

export default Itinerary;
