import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Sidebar = () => {
	const itineraries = [
		{ id: "1", name: "Jeju Island" },
		{ id: "2", name: "Paris, Barcelona" },
	];

	return (
		<div className="p-4 space-y-4 h-full">
			<Button
				variant="outline"
				className="w-full flex items-center justify-start gap-2 rounded-lg p-2 hover:bg-muted"
			>
				<Avatar className="h-8 w-8 bg-muted">
					<AvatarFallback>+</AvatarFallback>
				</Avatar>
				<span className="text-gray-700">New Itinerary</span>
			</Button>
			<ul className="space-y-2">
				{itineraries.map((itinerary) => (
					<li key={itinerary.id}>
						<Link href={`/itinerary/${itinerary.id}`} passHref>
							<Button
								variant="ghost"
								className="w-full flex items-center justify-start gap-2 rounded-lg p-2 text-gray-800 hover:bg-muted"
							>
								<Avatar className="h-8 w-8 bg-blue-100">
									<AvatarFallback>{itinerary.name[0]}</AvatarFallback>
								</Avatar>
								<span className="truncate">{itinerary.name}</span>
							</Button>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
