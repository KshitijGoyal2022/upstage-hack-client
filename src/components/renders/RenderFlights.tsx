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
import { convertISODurationToTime } from "@/helpers";

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
	return (
		<Card className={cn("w-[380px]", className)} {...props}>
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
								{itinerary.segments?.map((segment, index) => (
									<div
										key={index}
										className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
									>
										<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												{segment.departure?.iataCode} -{" "}
												{segment.arrival?.iataCode}
											</p>
											<p className="text-sm text-muted-foreground">
												{new Date(segment.departure?.at).toDateString()} -{" "}
												{new Date(segment.arrival?.at).toDateString()}
											</p>
										</div>
									</div>
								))}
								{/**  Divider */}
								<div className="border-t border-muted-foreground my-4" />
							</div>
						</CardContent>
					</>
				))}
			</div>

			<CardFooter>
				<Button className="w-full">Choose Flight</Button>
			</CardFooter>
		</Card>
	);
}
