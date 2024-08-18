"use client";
import { CornerDownLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { socket } from "@/socket";

interface Message {
	text: string;
	itinerary: string;
	creator: string | null;
	googleId: string;
}

interface ChatProps {
	itineraryId: string;
}
export default function Chat({ itineraryId }: ChatProps) {
	const { user, isAuthenticated, isLoading } = useAuth0();
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState("");
	const [isConnected, setIsConnected] = useState<boolean>(false);

	useEffect(() => {
		if (isAuthenticated && user) {
			// Now user data should be fully available here
		}

		const fetchMessages = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/messages/messages/${itineraryId}`
				);
				if (response.ok) {
					const data = await response.json();
					setMessages(data);
				} else {
					console.error("Failed to fetch messages", response.statusText);
				}
			} catch (error) {
				console.error("Failed to fetch messages", error);
			}
		};

		fetchMessages();

		socket.on("connect", () => {
			setIsConnected(true);
		});

		socket.on("message", (newMessage: Message) => {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		});

		return () => {
			socket.off("connect");
			socket.off("message");
		};
	}, [itineraryId, isAuthenticated, user]);

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		if (message.trim() && user?.sub) {
			const newMessage: Message = {
				text: message,
				itinerary: itineraryId,
				creator: user.sub,
				googleId: user.sub,
			};

			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/messages/messages`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(newMessage),
					}
				);

				if (response.ok) {
					const savedMessage = await response.json();
					socket.emit("message", savedMessage);
					setMessage("");
				} else {
					console.error("Failed to send message", response.statusText);
				}
			} catch (error) {
				console.error("Failed to send message", error);
			}
		}
	};

	const handleKeyDown = (event: any) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}
	};

	return (
		<div className="flex flex-col rounded-xl lg:col-span-2 p-4">
			<div className="flex-1 min-h-[650px] max-h-[650px] overflow-y-auto p-3">
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`flex items-center p-2 ${
							msg.googleId === user?.sub ? "justify-end" : "justify-start"
						} `}
					>
						{msg.googleId !== user?.sub && (
							<Avatar className="mr-2">
								<AvatarImage
									src={msg.creator?.image || ""}
									alt={msg.creator?.name || "User"}
									className=""
								/>
								<AvatarFallback>{msg.creator?.name?.[0] || "?"}</AvatarFallback>
							</Avatar>
						)}

						<div
							className={`max-w-xs p-3 rounded-t-lg ${
								msg.googleId === user?.sub
									? "rounded-bl-lg bg-gray-800 text-white"
									: "rounded-br-lg bg-white text-gray-800 shadow-md"
							}`}
						>
							<p className="text-sm">{msg.text}</p>
							<span className="block mt-1 text-xs text-gray-500">
								{new Date(msg.createdAt).toLocaleTimeString()}
							</span>
						</div>
						{msg.googleId === user?.sub && user && (
							<Avatar className="ml-2">
								<AvatarImage
									src={user.picture || ""}
									alt={user.name || "You"}
								/>
								<AvatarFallback>{user.name?.[0] || "?"}</AvatarFallback>
							</Avatar>
						)}
					</div>
				))}
			</div>

			{/* Typing Indicator */}
			<div className="px-4 pb-2 text-sm text-gray-500">
				{message && <span>{user?.name} is typing...</span>}
			</div>

			<form
				className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
				onSubmit={handleSubmit}
			>
				<Label htmlFor="message" className="sr-only">
					Message
				</Label>
				<Textarea
					id="message"
					placeholder="Type your message here..."
					className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<div className="flex items-center p-3 pt-0">
					<Button type="submit" size="sm" className="ml-auto gap-1.5">
						Send Message
						<CornerDownLeft className="size-3.5" />
					</Button>
				</div>
			</form>
		</div>
	);
}
