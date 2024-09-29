"use client";

import { bookItinerary } from "@/apis";
import { BlurredModal } from "@/components/ui/blurred-modal";
import { Button } from "@/components/ui/button";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

export default function SuccessPage() {
	const [showConfetti, setShowConfetti] = useState(true);

	const itineraryId = useSearchParams().get("itineraryId");
	const [loadingBook, setLoadingBook] = useState(true);

	const [booking, setBooking] = useState(null);

	const callbackBook = async () => {
		// const result = await callbackCheck();
		// if (result.length > 0) {
		// 	alert("Please fill in all the traveler information");
		// 	return;
		// }

		setLoadingBook(true);
		try {
			const booking = await bookItinerary(itineraryId as string);
			const bookingId = booking?.booking?.referenceId;

			if (bookingId) {
				setBooking(booking?.booking);
			}
			setLoadingBook(false);
		} catch (err) {
			setLoadingBook(false);
		}
	};

	useEffect(() => {
		// Fetch the itinerary details from the server
		callbackBook();
	}, []);

	// Automatically stop confetti after 10 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowConfetti(false);
		}, 10000); // 10 seconds duration for the confetti

		return () => clearTimeout(timer); // Cleanup timer
	}, []);

	return (
		<div>
			<MultiStepLoader
				loadingStates={[{ text: "Hang tight! Creating your booking..." }]}
				loop={true}
				loading={loadingBook || !booking}
				duration={3000}
			/>
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 relative gap-y-4">
				{showConfetti && booking && (
					<Confetti width={window.innerWidth} height={window.innerHeight} />
				)}

				{/* Checkmark Icon */}
				{booking && (
					<div className="relative">
						<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-500">
							<div className="w-20 h-20 flex items-center justify-center bg-blue-300 rounded-full">
								<CheckCircleIcon className="h-12 w-12 text-white" />
							</div>
						</div>
					</div>
				)}

				{/* Main Success Message */}
				<h1 className="mt-12 text-4xl font-bold text-gray-800">
					Congratulations!
				</h1>
				<h2 className="mt-2 text-xl text-gray-600">
					Your payment was processed successfully.
				</h2>

				{/* Additional Message */}
				<p className="mt-4 text-lg text-gray-500">
					Thank you for booking with us. We’re excited to help you embark on
					your next adventure.
				</p>

				{/* Reference Number */}
				{booking && (
					<p className="mt-2 text-md text-gray-500">
						Your Booking Reference Number:{" "}
						<span className="font-semibold">#{booking?.referenceId}</span>
					</p>
				)}

				{/** Loading spinner */}

				{/* Back to Home Button */}
				{booking && (
					<Button className="mt-6">
						<Link href={`/booking/${booking?.referenceId}`}>
							Go Back to Home
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
