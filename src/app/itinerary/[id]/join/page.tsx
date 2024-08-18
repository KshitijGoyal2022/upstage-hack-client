"use client";

import { addNewMemberToItinerary } from "@/apis";
import { useItinerary } from "@/useItinerary";
import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using a styled Button component
import { useToast } from "@/components/ui/use-toast";

function JoinPage({ params }: { params: any }) {
	const { user, isLoading: authLoading } = useAuth0();
	const { id } = params;
	const { itinerary, isLoading } = useItinerary(id);
	const {toast} = useToast();

	const callbackJoin = async () => {
		if (!user?.sub) {
			window.alert("You need to log in ");
			return;
		}
		const response = await addNewMemberToItinerary(id, user?.sub as string);
		window.location.href = "/itinerary/" + response?._id;
	};

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
				<p className="text-lg font-semibold text-gray-600">Loading itinerary...</p>
			</div>
		);
	}

	if (!itinerary?._id) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-semibold text-red-600">Itinerary could not be found.</p>
			</div>
		);
	}

	if (
		itinerary?.users?.findIndex((u) => u?.user?.provider?.id === user?.sub) ===
		-1
	) {
		return (
			<div className="flex flex-col items-center justify-center h-screen space-y-4">
				<h2 className="text-2xl font-semibold text-gray-800">Join the group</h2>
				<Button onClick={callbackJoin} className="w-60">Join</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen space-y-4">
			<h1 className="text-2xl font-semibold text-gray-800">You are already a member.</h1>
			<Link href={"/itinerary/" + itinerary._id}>
				<Button className="w-60">Go to Itinerary</Button>
			</Link>
		</div>
	);
}

export default JoinPage;
