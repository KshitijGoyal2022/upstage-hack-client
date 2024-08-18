import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AmadeusFlightOffer } from "@/socket/chat";
import Amadeus from "@/types/amadeus";
import { convertISODurationToTime, millisecondsToDuration } from "@/helpers";
// carrier code to name: https://www.npmjs.com/package/airline-codes

const notifications = [
	{
		title: "From YVR,  Terminal M",
		description: "TIME HERE",
	},
	{
		title: "ARRIVAL at YYZ",
		description: "1 hour ago",
	},
];

export function FlightCard({
	className,
	...props
}: {
	className?: string;
	flight: AmadeusFlightOffer;
}) {
	const from = props.flight.itineraries?.[0].segments?.[0].departure?.iataCode;
	const to =
		props.flight.itineraries?.[0]?.segments?.[
			(props.flight.itineraries?.[0]?.segments?.length || 1) - 1
		].arrival?.iataCode;

	const route = [from, to];

	return (
		<Card className={cn("w-[380px] shrink-0", className)} {...props}>
			{/* <div className=" flex items-center space-x-4 rounded-md border p-4">
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium leading-none">
							Push Notifications
						</p>
						<p className="text-sm text-muted-foreground">
							Send notifications to device.
						</p>
					</div>
					<Switch />
				</div> */}
			<div>
				{props.flight?.itineraries?.map((itinerary, index) => (
					<>
						<CardHeader>
							<CardTitle>
								{itinerary.segments[0].departure.iataCode} -{" "}
								{
									itinerary.segments[itinerary?.segments?.length - 1].arrival
										.iataCode
								}
							</CardTitle>
							<CardDescription>
								{convertISODurationToTime(itinerary.duration)}
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							<div key={index}>
								{itinerary.segments?.map((segment, index) => {
									const carrierCode = segment.carrierCode;
									const details =
										props.flight.travelerPricings?.[0]?.fareDetailsBySegment?.find(
											(a) => a.segmentId === segment.id
										);
									return (
										<>
											<div
												key={index}
												className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
											>
												<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
												<div className="space-y-1">
													<p className="text-sm font-medium leading-none">
														{segment.departure?.iataCode} (Terminal{" "}
														{segment?.departure?.terminal}) -{" "}
														{segment.arrival?.iataCode} (Terminal{" "}
														{segment?.arrival?.terminal})
													</p>
													<p className="text-sm text-muted-foreground">
														<p>
															Departure at:{" "}
															{new Date(
																segment.departure.at
															).toLocaleTimeString()}{" "}
															on{" "}
															{new Date(
																segment.departure.at
															).toLocaleDateString()}
														</p>
														<p>
															Arrival at:{" "}
															{new Date(
																segment.arrival.at
															).toLocaleTimeString()}{" "}
															on{" "}
															{new Date(
																segment.arrival.at
															).toLocaleDateString()}
														</p>
													</p>
													<br />
													<div>
														{/** List of things that are included */}
														<p className="text-sm text-muted-foreground">
															Class: {details?.cabin}
														</p>
														<p className="text-sm text-muted-foreground">
															Checked bags included:
															{details?.includedCheckedBags?.quantity}
														</p>
														{details?.amenities
															?.filter((e) => !e?.isChargeable)
															.map((amenity) => (
																<p className="text-sm text-muted-foreground">
																	{amenity?.description}:{" "}
																	{amenity?.isChargeable ? "No" : "Yes"}
																</p>
															))}
													</div>
												</div>
											</div>
											{/* Lay over calculation: take the next segment and do the subtraction of time */}
											{index + 1 < itinerary.segments?.length && (
												<div
													key={index}
													className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
												>
													<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
													<div className="space-y-1">
														<p className="text-sm font-medium leading-none">
															Layover at {segment.arrival?.iataCode}
														</p>
														<p className="text-sm text-muted-foreground">
															<p>
																Duration:{" "}
																{millisecondsToDuration(
																	new Date(
																		itinerary.segments[index + 1].departure?.at
																	) - new Date(segment.arrival?.at)
																)}
															</p>
														</p>
													</div>
												</div>
											)}
										</>
									);
								})}
								{/**  Divider */}
								<div className="border-t border-muted-foreground my-4" />
							</div>
						</CardContent>
					</>
				))}
			</div>

			<CardFooter className="flex-col">
				<p className="mb-6">
					{props.flight.price?.grandTotal} {props.flight.price?.currency}
				</p>
				<Button className="w-full">Choose Flight</Button>
			</CardFooter>
		</Card>
	);
}
