"use client";

import { AmadeusActivityOffer } from "@/socket/chat";
import Image from "next/image";
import React from "react";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";

type CardProps = {
	activity: AmadeusActivityOffer;
	onPress: () => void;
	isAdmin?: boolean;
	isSelected?: boolean;
};

export function ActivityCard(props: CardProps) {
	return (
		<div className="max-w-sm rounded overflow-hidden shadow-lg shrink-0 flex flex-col justify-between">
			<div>
				<div className="px-6 py-4">
					<div className="font-bold text-xl mb-2">
						{props.activity.properties.name}
					</div>
					<p className="text-gray-700 text-base">
						{props.activity.properties.full_address}
					</p>
					{props.activity.properties.metadata?.phone && (
						<p className="text-gray-700 text-base">
							Phone number: {props.activity.properties.metadata?.phone}
						</p>
					)}
					{props.activity.properties.metadata?.website && (
						<p className="text-gray-700 text-base">
							Website: {props.activity.properties.metadata?.website}
						</p>
					)}
				</div>
				<div className="px-6 pt-4 pb-2">
					{props.activity.properties.poi_category.map((category, index) => (
						<span
							key={category}
							className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
						>
							{category}
						</span>
					))}
				</div>
			</div>

			{props.isAdmin && (
				<CardFooter className="flex-col">
					<Button
						disabled={props.isSelected}
						onClick={props.onPress}
						className="w-full"
					>
						{props.isSelected ? "Selected" : "Add to itinerary"}
					</Button>
				</CardFooter>
			)}
		</div>
	);
}

function RenderPointOfInterests() {
	return <div>RenderPointOfInterests</div>;
}

export default RenderPointOfInterests;
