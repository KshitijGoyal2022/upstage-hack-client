"use client";

import { addNewMemberToItinerary } from "@/apis";
import { useItinerary } from "@/useItinerary";
import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";
import React from "react";

function JoinPage({ params }: { params: any }) {
	const { user, isLoading: authLoading } = useAuth0();
	const { id } = params;
	const { itinerary, isLoading } = useItinerary(id);

	const callbackJoin = async () => {
		if (!user?.sub) {
			window.alert("No sub ID");
			return;
		}
		const response = await addNewMemberToItinerary(id, user?.sub as string);
		window.location.href = "/itinerary/" + response?._id;
	};

	if (authLoading) {
		return <div>Authenticating...</div>;
	}

	if (isLoading) {
		return <div>Loading itinerary...</div>;
	}

	if (!itinerary?._id) return <div>Itinerary could not be found.</div>;

	if (
		itinerary?.users?.findIndex((u) => u?.user?.provider?.id === user?.sub) ===
		-1
	) {
		return (
			<div>
				<div>Join the group</div>
				<button onClick={callbackJoin}>Join</button>
			</div>
		);
	}
	return (
		<div>
			<h1>You are already a member.</h1>
			<Link href={"/itinerary/" + itinerary._id}>Go to Itinerary</Link>
		</div>
	);
}

export default JoinPage;
