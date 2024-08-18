"use client";

import { confirmPricing } from "@/apis";
import { FlightCard } from "@/components/renders/RenderFlights";
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

	const callbackPricing = async () => {
		setLoadingPricing(true);
		const pricing = await confirmPricing(id);
		setLoadingPricing(false);
		setPricing(pricing);
		console.log(pricing);
	};

	React.useEffect(() => {
		if (itinerary && user?.sub) {
			callbackPricing();
		}
	}, [itinerary, user?.sub]);
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
		<div className="flex flex-row  m-12 gap-8">
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
		</div>
	);
}

export default PricingPage;
