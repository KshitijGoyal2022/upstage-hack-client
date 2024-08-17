"use client";

import React from "react";
import { useRouter } from "next/router";

import Chat from "@/components/chat";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { useChat } from "@/socket/chat";
import { socket } from "@/socket";
import { FlightCard } from "@/components/renders/RenderFlights";

const Itinerary = ({ params }: any) => {
	const { id } = params;
	const [message, setMessage] = React.useState("");

	const chat = useChat(socket);
	console.log(chat);

	const callbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("submit", message);
		chat.sendChat(message);
	};

	return (
		<div className="grid grid-cols-12 h-max">
			<div className="col-span-2 border-r h-full">
				<Sidebar />
			</div>

			{/* Main Content - Itinerary Details */}
			<div className="col-span-6 p-6 h-full">
				<div className="gap-4 mb-6">
					{chat.chats.map((chat) => {
						return (
							<>
								{chat.flight_offer_search?.map((flight) => {
									return <FlightCard flight={flight} key={flight.id} />;
								})}
								{chat.list_hotels_in_city && (
									<div>{chat.list_hotels_in_city[0].name}</div>
								)}
								{chat.points_of_interest && (
									<div>{chat.points_of_interest[0].properties.name}</div>
								)}
							</>
						);
					})}
				</div>
				<form
					className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
					x-chunk="dashboard-03-chunk-1"
					onSubmit={callbackSubmit}
				>
					<Label htmlFor="message" className="sr-only">
						Message
					</Label>
					<Input
						id="message"
						placeholder="Type your message here..."
						className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						disabled={chat.isLoading}
					/>
					<div className="flex items-center p-3 pt-0">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon">
										<Paperclip className="size-4" />
										<span className="sr-only">Attach file</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top">Attach File</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon">
										<Mic className="size-4" />
										<span className="sr-only">Use Microphone</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top">Use Microphone</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<Button
							type="submit"
							disabled={chat.isLoading}
							size="sm"
							className="ml-auto gap-1.5 disabled:opacity-40"
						>
							Send Message
							<CornerDownLeft className="size-3.5" />
						</Button>
					</div>
				</form>
			</div>

			{/* Chat Component */}
			<div className="col-span-3 h-full border-l">
				<Chat itineraryId={id} />
			</div>
		</div>
	);
};

export default Itinerary;
