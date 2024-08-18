"use client";

import React from "react";
import Chat from "@/components/chat";
import Sidebar from "@/components/sidebar";
import AiPlayground from "@/components/AiPlayground";
import { useAuth0 } from "@auth0/auth0-react";
import { useItinerary } from "@/useItinerary";
import { Button } from "@/components/ui/button";
import { ShareModal } from "@/components/share-modal";
import Link from "next/link";

const Itinerary = ({ params }: any) => {
	const { user, isLoading: authLoading } = useAuth0();
	const { id } = params;

	const { itinerary, isLoading, onRefreshItinerary } = useItinerary(id);
	if (authLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-semibold text-gray-600">Authenticating...</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-semibold text-gray-600">
					Loading itinerary...
				</p>
			</div>
		);
	}

	if (!itinerary) {
		return (
			<div className="flex flex-col items-center justify-center h-screen space-y-4">
				<h2 className="text-2xl font-semibold text-red-600">
					Itinerary Not Found
				</h2>
				<p className="text-lg text-gray-600">
					We could not find the itinerary with this id.
				</p>
			</div>
		);
	}

	if (
		itinerary?.users?.findIndex((u) => u?.user?.provider?.id === user?.sub) ===
		-1
	) {
		return (
			<div className="flex flex-col items-center justify-center h-screen space-y-4">
				<h2 className="text-2xl font-semibold text-red-600">Not a Member</h2>
				<p className="text-lg text-gray-600">
					You are not a member. You need to have access in order to enter.
				</p>
			</div>
		);
	}

	const shareLink = `${window.location.href}/join`;

	return (
		<div className="grid grid-cols-12 max-h-max relative">
			{/* Top Bar with Buttons */}
			<div className="col-span-12 flex justify-end items-center p-6 border-b bg-white sticky top-0 z-10 border-t">
				<div className="flex space-x-4">
					<ShareModal shareLink={shareLink} />
					<Link href={`${id}/book-info`} passHref>
						<Button className="w-40">Book</Button>
					</Link>
					<Link href={`${id}/preview`} passHref>
						<Button className="w-40">Preview</Button>
					</Link>
				</div>
			</div>

			{/* Sidebar Section */}
			<div className="col-span-2 border-r h-full sticky top-0">
				<Sidebar />
			</div>

			{/* Main Content - Group AI Playground */}
			<div className="col-span-7">
				<h2 className="mt-2 text-xl font-semibold p-4 flex justify-center">
					Group AI Playground
				</h2>
				<AiPlayground
					itineraryId={id}
					itinerary={itinerary}
					onRefreshItinerary={onRefreshItinerary}
				/>
			</div>

			{/* Group Chat Section */}
			<div className="col-span-3 h-full border-l flex flex-col">
				<h2 className="mt-2 text-xl font-semibold p-4 flex justify-center">
					Group Chat
				</h2>
				<Chat itineraryId={id} />
			</div>
		</div>
	);
};

export default Itinerary;
