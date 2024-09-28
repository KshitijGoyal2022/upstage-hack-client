"use client";

import React, { useState } from "react";
import Chat from "@/components/chat";
import Sidebar from "@/components/sidebar";
import AiPlayground from "@/components/AiPlayground";
import { useAuth0 } from "@auth0/auth0-react";
import { useItinerary } from "@/useItinerary";
import { Button } from "@/components/ui/button";
import { ShareModal } from "@/components/share-modal";
import Link from "next/link";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function MagicButton() {
	return (
		<div className="flex justify-center text-center">
			<HoverBorderGradient
				containerClassName="rounded-full"
				as="button"
				className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
			>
				<AceternityLogo />
				<span>Magic</span>
			</HoverBorderGradient>
		</div>
	);
}

import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { set } from "date-fns";
import { getMagicItinerary } from "@/apis";

const loadingStates = [
	{
		text: "Finding optimal routing",
	},
	{
		text: "Matching restaurants",
	},
	{
		text: "Matching top sights",
	},
	{
		text: "Inserting hotels",
	},
	{
		text: "Your itinerary is ready 🎉",
	},
];

export function MultiStepLoaderDemo(props: {
	loading: boolean;
	onMagicClick: () => void;
}) {
	return (
		<div className="w-full flex items-center justify-center">
			{/* Core Loader Modal */}
			<Loader
				loadingStates={loadingStates}
				loading={props.loading}
				duration={4000}
			/>

			{/* The buttons are for demo only, remove it in your actual code ⬇️ */}
			<button onClick={props.onMagicClick}>
				<MagicButton />
			</button>

			{/* {loading && (
				<button
					className="fixed top-4 right-4 text-black dark:text-white z-[120]"
					onClick={() => setLoading(false)}
				>
					<IconSquareRoundedX className="h-10 w-10" />
				</button>
			)} */}
		</div>
	);
}

const AceternityLogo = () => {
	return (
		<svg
			width="66"
			height="65"
			viewBox="0 0 66 65"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-3 w-3 text-black dark:text-white"
		>
			<path
				d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
				stroke="currentColor"
				strokeWidth="15"
				strokeMiterlimit="3.86874"
				strokeLinecap="round"
			/>
		</svg>
	);
};

const Itinerary = ({ params }: any) => {
	const { user, isLoading: authLoading } = useAuth0();
	const { id } = params;

	const [magicItinerary, setMagicItinerary] = React.useState<any>(null);
	const [magicLoading, setMagicLoading] = React.useState(false);

	const { itinerary, isLoading, onRefreshItinerary } = useItinerary(id);

	const callbackMagicItinerary = async () => {
		setMagicLoading(true);
		const itinerary = await getMagicItinerary(id);

		if (itinerary) {
			setMagicItinerary(itinerary);
		}
		setMagicLoading(false);
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

	console.log(magicItinerary);

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
					<MultiStepLoaderDemo
						loading={magicLoading}
						onMagicClick={callbackMagicItinerary}
					/>
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
