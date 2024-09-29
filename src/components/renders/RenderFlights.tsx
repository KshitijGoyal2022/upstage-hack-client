"use client";
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
import { millisecondsToDuration } from "@/helpers";

export let currencyFormatter = (currency: string) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
	});

export function FlightCard({
	className,
	...props
}: {
	className?: string;
	flight: GoogleFlightData["best_flights"][number];
	onPress: () => void;
	isAdmin?: boolean;
	isSelected?: boolean;
	currency: string;
}) {
	// Utilize new data paths according to SerpFlight structure
	const bestFlight = props.flight; // Assuming displaying the best flight for simplicity
	const from = bestFlight.flights[0].departure_airport.name;
	const to =
		bestFlight.flights[bestFlight.flights.length - 1].arrival_airport.name;

	return (
		<Card className={cn("w-[380px] shrink-0", className)} {...props}>
			<div>
				<CardHeader>
					<CardTitle>
						{bestFlight.flights[0].departure_airport.name} -{" "}
						{
							bestFlight.flights[bestFlight.flights.length - 1].arrival_airport
								.name
						}
					</CardTitle>
					<CardDescription>
						Flight Duration:{" "}
						{millisecondsToDuration(props.flight.total_duration)}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{bestFlight.flights.map((flight, index) => (
						<div className="flex flex-col items-center" key={index}>
							<div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
								<div className="flex flex-col items-center">
									<span className="flex h-2 w-2 translate-y-1 rounded-full bg-black" />
									{/** Line to bottom */}

									<div className="h-full mt-3 w-0.5 bg-black"></div>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium leading-none">
										{flight.departure_airport.name} (Departure)
									</p>
									<p className="text-sm font-medium leading-none">
										{flight.arrival_airport.name} (Arrival)
									</p>
									<p className="text-sm text-muted-foreground">
										{millisecondsToDuration(flight.duration)}
									</p>
									<p className="text-sm text-muted-foreground">
										Departure at:{" "}
										{new Date(
											flight.departure_airport.time
										).toLocaleTimeString()}{" "}
										on{" "}
										{new Date(
											flight.departure_airport.time
										).toLocaleDateString()}
									</p>
									<p className="text-sm text-muted-foreground">
										Arrival at:{" "}
										{new Date(flight.arrival_airport.time).toLocaleTimeString()}{" "}
										on{" "}
										{new Date(flight.arrival_airport.time).toLocaleDateString()}
									</p>
									<div className="flex flex-row gap-2 items-center">
										{flight.airline_logo && (
											<Image
												src={flight.airline_logo}
												width={30}
												height={30}
												alt={flight.airline}
											/>
										)}
										<p className="text-sm text-muted-foreground">
											Airline: {flight.airline}
										</p>
									</div>
									<p className="text-sm text-muted-foreground">
										Flight Number: {flight.flight_number} ({flight.airplane})
									</p>
									<p className="text-sm text-muted-foreground">
										Class: {flight.travel_class}
									</p>

									<div>
										<p className="text-sm text-muted-foreground">
											Carbon emissions for this flight:{" "}
											{bestFlight.carbon_emissions.this_flight}kg CO2
										</p>
									</div>
									{flight.extensions.map((extension, index) => (
										<div key={index}>
											<p className="text-sm text-muted-foreground">
												{extension}
											</p>
										</div>
									))}
								</div>
							</div>
							{index !== props.flight.flights.length - 1 && (
								<div className="w-0.5 h-6 my-4 border border-dashed border-black  self-center" />
							)}

							{props.flight?.layovers?.length > index && (
								<>
									<div className=" grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
										<div className="flex flex-col items-center">
											<span className="flex h-2 w-2 translate-y-1 rounded-full bg-black" />
											{/** Line to bottom */}

											<div className="h-full mt-3 w-0.5 bg-black"></div>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												Layover at {props.flight.layovers[index].name}
												{millisecondsToDuration(
													props.flight.layovers[index].duration
												)}
											</p>
											<p className="text-sm text-muted-foreground">
												Duration:{" "}
												{millisecondsToDuration(
													props.flight.layovers[index].duration
												)}
											</p>
										</div>
									</div>
									<div className="w-0.5 h-6 my-4 border border-dashed border-black  self-center" />
								</>
							)}
						</div>
					))}
					<div className="border-t border-muted-foreground my-4" />
				</CardContent>
			</div>

			{props.isAdmin && (
				<CardFooter className="flex-col">
					<p className="mb-6 text-sm">Total Price:</p>
					<p className="mb-6 font-semibold">
						{currencyFormatter(props.currency).format(props.flight.price)}
					</p>
					<Button
						disabled={props.isSelected}
						onClick={props.onPress}
						className="w-full"
					>
						{props.isSelected ? "Selected" : "Choose Flight"}
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleFlightData, SerpFlight } from "@/types/serp";
import Image from "next/image";

export function FlightSkeleton() {
	return (
		<Card className="w-[380px] shrink-0">
			<CardHeader>
				<CardTitle>
					<Skeleton className="w-full h-8" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="w-1/2 h-4" />
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
			</CardContent>
			<CardFooter className="flex-col gap-4">
				<Skeleton className="w-16 h-4" />
				<Skeleton className="w-full h-12" />
			</CardFooter>
		</Card>
	);
}
