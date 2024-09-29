"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import nanoid from "nanoid";
import { createNewItinerary } from "@/apis";
import { useAuth0 } from "@auth0/auth0-react";
import Router, { useRouter } from "next/router";
import { useMyItineraries } from "@/useMyItineraries";
import { makeItineraryid } from "@/helpers";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../components/ui/aurora-background";

export function AuroraBackgroundDemo(props) {
	return (
		<AuroraBackground>
			<motion.div
				initial={{ opacity: 0.0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: "easeInOut",
				}}
				className="relative flex flex-col gap-4 items-center justify-center px-4"
			>
				{props.children}
			</motion.div>
		</AuroraBackground>
	);
}

import { FlipWords } from "../components/ui/flip-words";

export function FlipWordsDemo() {
	const words = ["seamlessly", "with confidence", "on the go", "stress-free"];

	return (
		<div className="flex justify-center items-center px-4">
			<div className="text-8xl mx-auto font-bold text-neutral-600 dark:text-neutral-400 text-center">
				Build your itinerary
				<br />
				<FlipWords className="mt-5 text-8xl" words={words} />
			</div>
		</div>
	);
}

export default function Home() {
	const { user } = useAuth0();
	const myItineraries = useMyItineraries();
	const callbackCreateNewItinerary = async () => {
		const title = makeItineraryid(12);
		if (!user?.sub) {
			console.log("User is not authenticated.");
			return;
		}

		const itinerary = await createNewItinerary(user?.sub as string, title);
		console.log(itinerary);

		window.location.href = "/itinerary/" + itinerary._id;
	};
	return (
		<AuroraBackgroundDemo>
			<FlipWordsDemo />
			<div className="flex justify-center items-center mt-10 p-4">
				<div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
					<div
						className="w-full md:w-[400px] flex flex-col p-6 md:p-10 rounded-lg border shadow-slate-100 shadow-xl"
						style={{ backgroundColor: "#F8F9FB" }}
					>
						<div className="flex flex-col">
							<p className="text-lg font-medium">
								Need help deciding where to go, booking, or itinerary planning?
							</p>
							<button
								className="text-gray-600 mt-2 flex items-center"
								onClick={callbackCreateNewItinerary}
							>
								Create a New Itinerary
								<ChevronRight />
							</button>
						</div>
						<div className="flex justify-center mt-4">
							<Image
								src="/chat.svg"
								alt="AI Chat Icon"
								width={120}
								height={120}
							/>
						</div>
					</div>
					{/* OR Text for Small Screens */}
					<div className="flex justify-center items-center sm:block md:hidden text-center ">
						<p className="text-lg ">OR</p>
					</div>
					<div
						className="w-full md:w-[400px] flex flex-col p-6 md:p-10 rounded-lg border shadow-slate-100 shadow-xl"
						style={{ backgroundColor: "#F8F9FB" }}
					>
						<div className="flex flex-col">
							<p className="text-lg font-medium">
								I want to see my existing itinerary and bookings{" "}
							</p>
							<Link
								className="text-gray-600 mt-2 flex items-center"
								href="/itinerary"
							>
								Go to Profile
								<ChevronRight />
							</Link>
						</div>
						<div className="flex justify-center mt-4">
							<Image
								src="/calendar.svg"
								alt="Calendar Icon"
								className=""
								width={80}
								height={80}
							/>
						</div>
					</div>
				</div>
			</div>
		</AuroraBackgroundDemo>
	);
}
