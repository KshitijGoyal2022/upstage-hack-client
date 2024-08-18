"use client";

import { socket } from "@/socket";
import { useChat } from "@/socket/chat";
import React from "react";
import { FlightCard } from "./renders/RenderFlights";

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

export default function AiPlayground() {
	const [message, setMessage] = React.useState("");

	const chat = useChat(socket);
	console.log(chat);

	const callbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		chat.sendChat(message);
		setMessage("");
	};
	return (
		<div className="col-span-7 h-full">
			<div className="gap-4 mb-6">
				{chat.chats.length > 0 &&
					[chat.chats[chat.chats.length - 1]].map((chat, index) => {
						return (
							<div key={index} className="space-y-8">
								{chat.flight_offer_search?.length > 0 && (
									<div>
										<h1 className="font-semibold text-2xl mb-8 p-6">
											Here are some flights that we found
										</h1>

										<div className="flex flex-row overflow-x-auto gap-4 px-6 ">
											{chat.flight_offer_search?.map((flight) => {
												return <FlightCard flight={flight} key={flight.id} />;
											})}
										</div>
									</div>
								)}
								{chat.list_hotels_in_city && (
									<div>{chat.list_hotels_in_city[0].name}</div>
								)}
								{chat.points_of_interest && (
									<div>{chat.points_of_interest[0].properties.name}</div>
								)}
							</div>
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
					className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 outline-none"
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
	);
}
