"use client";

import { bookItinerary, checkIfAllTravelersInfo, confirmPricing } from "@/apis";
import { FlightCard } from "@/components/renders/RenderFlights";
import { Button } from "@/components/ui/button";
import { useItinerary } from "@/useItinerary";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

interface Tax {
	amount: string;
	code: string;
}

interface FlightPricingDetails {
	currency: string;
	total: string;
	base: string;
	taxes: Tax[];
	refundableTaxes: string;
}

const RenderPricing = (props: { price: FlightPricingDetails }) => {
	const { currency, total, base, taxes, refundableTaxes } = props.price;
	return (
		<>
			{" "}
			<div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Flight Pricing Details</h2>

				<div className="mb-4">
					<div className="text-lg font-medium">Currency:</div>
					<div className="text-xl font-semibold text-gray-800">{currency}</div>
				</div>

				<div className="mb-4">
					<div className="text-lg font-medium">Base Fare:</div>
					<div className="text-xl font-semibold text-gray-800">
						{base} {currency}
					</div>
				</div>

				<div className="mb-4">
					<div className="text-lg font-medium">Taxes:</div>
					<ul className="text-gray-700">
						{taxes.map((tax) => (
							<li v-for="tax in taxes" key="tax.code">
								{tax.code}: {tax.amount} {currency}
							</li>
						))}
					</ul>
				</div>

				<div className="mb-4">
					<div className="text-lg font-medium">Refundable Taxes:</div>
					<div className="text-xl font-semibold text-gray-800">
						{refundableTaxes} {currency}
					</div>
				</div>

				<div className="mt-6">
					<div className="text-lg font-medium">Total Price:</div>
					<div className="text-2xl font-bold text-green-600">
						{total} {currency}
					</div>
				</div>
			</div>
		</>
	);
};

function PricingPage({ params }: { params: any }) {
	const { id } = params;
	const { user, isLoading: authLoading } = useAuth0();
	const { itinerary, isLoading } = useItinerary(id);
	const [loadingPricing, setLoadingPricing] = React.useState(false);
	const [pricing, setPricing] = React.useState<any>();
	const [loadingCheck, setLoadingCheck] = React.useState(false);
	const [loadingBook, setLoadingBook] = React.useState(false);

	const [check, setCheck] = React.useState([]);

	const callbackPricing = async () => {
		setLoadingPricing(true);
		const pricing = await confirmPricing(id);
		setLoadingPricing(false);
		setPricing(pricing);
		console.log(pricing);
	};

	// const callbackCheck = async () => {
	// 	setLoadingCheck(true);
	// 	const result = await checkIfAllTravelersInfo(id);
	// 	setCheck(result);
	// 	setLoadingCheck(false);
	// 	return result;
	// };

	const callbackBook = async () => {
		// const result = await callbackCheck();
		// if (result.length > 0) {
		// 	alert("Please fill in all the traveler information");
		// 	return;
		// }
		setLoadingBook(true);
		const booking = bookItinerary(id);
		const bookingId = booking?.booking?.referenceId;
		if (bookingId) {
			alert("Itinerary successfully booked!");
			window.location.href = `/booking/${bookingId}`;
		} else {
			alert("Itinerary successfully booked!");
		}
		setLoadingBook(false);
	};

	// React.useEffect(() => {
	// 	if (itinerary && user?.sub) {
	// 		callbackPricing();
	// 	}
	// }, [itinerary, user?.sub, callbackPricing]);
	// if (authLoading) {
	// 	return (
	// 		<div className="flex items-center justify-center h-screen">
	// 			<p className="text-lg font-semibold text-gray-600">Authenticating...</p>
	// 		</div>
	// 	);
	// }

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

	if (loadingPricing) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-semibold text-gray-600">
					Loading pricing...
				</p>
			</div>
		);
	}

	const isAdmin = itinerary?.admin?.provider?.id === user?.sub;

	return (
		<div className="m-12">
			<Button onClick={callbackBook} disabled={!isAdmin || loadingBook}>
				{loadingBook
					? "Booking..."
					: !isAdmin
					? "Only admin can create a booking"
					: "Book Flight"}
			</Button>
			{/* {check.length > 0 && (
				<div>
					<h2 className="text-2xl font-semibold mb-4">Errors</h2>
					{check.map((error) => (
						<p key={error} className="text-red-600">
							{error}
						</p>
					))}
				</div>
			)} */}
			{/* <div className="flex flex-row gap-8 mt-4">
				{pricing?.flightOffers?.[0] && (
					<div>
						<FlightCard
							flight={pricing?.flightOffers?.[0]}
							isAdmin={isAdmin}
							isSelected
						/>
					</div>
				)}
				{pricing?.flightOffers?.[0]?.price && (
					<div>
						<h2 className="text-2xl font-semibold mb-4">Your Pricing</h2>
						<RenderPricing
							price={pricing?.flightOffers?.[0]?.travelerPricings?.[0]?.price}
						/>
					</div>
				)}
			</div> */}
		</div>
	);
}

export default PricingPage;
