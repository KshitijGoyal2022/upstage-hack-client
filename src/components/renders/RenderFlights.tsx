'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { millisecondsToDuration } from '@/helpers';

import { PlaneTakeoff, PlaneLanding, Timer, Leaf, Briefcase } from "lucide-react";


export let currencyFormatter = (currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });

export function FlightCard({
  className,
  ...props
}: {
  className?: string;
  flight: GoogleFlightData['best_flights'][number];
  onPress: () => void; // Use onPress for flight selection functionality
  isAdmin?: boolean;
  isSelected?: boolean;
  currency: string;
}) {
  const [isOpen, setIsOpen] = useState(false); // Modal state

  // Flight details
  const bestFlight = props.flight;
  const from = bestFlight.flights[0].departure_airport.name;
  const to =
    bestFlight.flights[bestFlight.flights.length - 1].arrival_airport.name;

  const handleFlightSelection = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal opening on button click
    props.onPress(); // Call the onPress function when flight is selected
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      {/* Clickable Flight Card */}
      <Card
        className={cn(
          'w-full p-6 border rounded-lg shadow-sm hover:shadow-lg cursor-pointer flex justify-between items-center',
          className
        )}
        onClick={openDialog} // Clicking anywhere opens the modal
      >
        <div className='flex items-center gap-6'>
          {/* Airline logo */}
          <Image
            src={bestFlight.flights[0].airline_logo}
            width={50}
            height={50}
            alt={bestFlight.flights[0].airline}
            className='rounded-full'
          />

          {/* Flight Details */}
          <div className='flex flex-col gap-2'>
            {/* Departure and Arrival Times */}
            <div className='flex items-center gap-4'>
              <p className='text-lg font-semibold'>
                {new Date(
                  bestFlight.flights[0].departure_airport.time
                ).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className='text-sm text-muted-foreground'>YVR</p>
              <p className='text-lg font-semibold'>–</p>
              <p className='text-lg font-semibold'>
                {new Date(
                  bestFlight.flights[
                    bestFlight.flights.length - 1
                  ].arrival_airport.time
                ).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className='text-sm text-muted-foreground'>RUH</p>
            </div>

            {/* Stops and Duration */}
            <div className='text-sm text-muted-foreground'>
              {bestFlight.flights.length - 1 === 0
                ? 'Direct Flight'
                : `${
                    bestFlight.flights.length - 1
                  } stop(s) at ${bestFlight.flights
                    .map((flight) => flight.arrival_airport.code)
                    .join(', ')}`}
            </div>

            <p className='text-sm text-muted-foreground'>
              Flight duration:{' '}
              {millisecondsToDuration(props.flight.total_duration)}
            </p>
          </div>
        </div>

        {/* Price and Select Flight Button */}
        <div className='flex flex-col items-end'>
          <p className='font-bold text-xl'>
            {currencyFormatter(props.currency).format(props.flight.price)}
          </p>
          {props.isAdmin && (
            <Button
              onClick={handleFlightSelection}
              className='mt-2 bg-indigo-500 text-white hover:bg-indigo-600'
              disabled={props.isSelected}
            >
              {props.isSelected ? 'Selected' : 'Select'}
            </Button>
          )}
        </div>
      </Card>

      {/* Modal for Flight Details */}

{isOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 p-10 space-y-8">
      {/* Modal Header */}
      <div className="flex items-center justify-between space-x-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Flight from {from} to {to}</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Total Duration: {millisecondsToDuration(bestFlight.total_duration)}
          </p>
        </div>
        {/* Airline logo */}
        <div className="flex flex-col items-end space-y-2">
          <Image
            src={bestFlight.flights[0].airline_logo}
            width={60}
            height={60}
            alt={bestFlight.flights[0].airline}
            className="rounded-full shadow-lg transition-transform transform hover:scale-110"
          />
          <p className="text-sm font-semibold text-gray-700">
            {bestFlight.flights[0].airline}
          </p>
        </div>
      </div>

      {/* Flight Segments */}
      <div className="space-y-6 divide-y divide-gray-200">
        {bestFlight.flights.map((flight, index) => (
          <div key={index} className="pt-4 space-y-4 hover:bg-gray-50 rounded-md p-4 transition-all duration-300">
            <div className="flex justify-between items-center">
              {/* Departure and Arrival Times */}
              <div>
                <p className="text-xl font-semibold">
                  {flight.departure_airport.name} → {flight.arrival_airport.name}
                </p>
                <p className="text-gray-500">
                  Flight {flight.flight_number} | {flight.airline}
                </p>
              </div>
              {/* Times and Duration */}
              <div className="text-sm text-gray-700 text-right space-y-1">
                <p>
                  <span className="font-medium">Departs:</span> {new Date(flight.departure_airport.time).toLocaleTimeString()} on {new Date(flight.departure_airport.time).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Arrives:</span> {new Date(flight.arrival_airport.time).toLocaleTimeString()} on {new Date(flight.arrival_airport.time).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                  {millisecondsToDuration(flight.duration)} flight
                </p>
              </div>
            </div>

            {/* Flight Details with Icons (Using Lucide Icons) */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <PlaneTakeoff className="mr-2 text-blue-500" />
                  Departure: {new Date(flight.departure_airport.time).toLocaleString()}
                </p>
                <p className="flex items-center text-gray-600">
                  <PlaneLanding className="mr-2 text-green-500" />
                  Arrival: {new Date(flight.arrival_airport.time).toLocaleString()}
                </p>
                <p className="flex items-center text-gray-600">
                  {/* <Airplane className="mr-2 text-gray-500" /> */}
                  Airplane: {flight.airplane}
                </p>
              </div>

              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <Briefcase className="mr-2 text-yellow-500" />
                  Seat Class: {flight.travel_class}
                </p>
                {props.flight.layovers.length > index && (
                  <p className="flex items-center text-gray-600">
                    <Timer className="mr-2 text-red-500" />
                    Layover at {props.flight.layovers[index].name} for {millisecondsToDuration(props.flight.layovers[index].duration)}
                  </p>
                )}
                <p className="flex items-center text-gray-600">
                  <Leaf className="mr-2 text-gray-500" />
                  Carbon Emissions: {bestFlight.carbon_emissions.this_flight}kg CO2
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={closeDialog}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md shadow-lg transform transition-transform hover:scale-105"
        >
          Close
        </Button>
        <Button
          onClick={handleFlightSelection}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md shadow-lg transform transition-transform hover:scale-105"
          disabled={props.isSelected}
        >
          {props.isSelected ? 'Selected' : 'Select Flight'}
        </Button>
      </div>
    </div>
  </div>
)}




    </>
  );

}

import { Skeleton } from '@/components/ui/skeleton';
import { GoogleFlightData, SerpFlight } from '@/types/serp';
import Image from 'next/image';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@radix-ui/react-dialog';
import { DialogHeader, DialogFooter } from '../ui/dialog';

export function FlightSkeleton() {
  return (
    <Card className='w-[380px] shrink-0'>
      <CardHeader>
        <CardTitle>
          <Skeleton className='w-full h-8' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='w-1/2 h-4' />
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <Skeleton className='w-full h-4' />
        <Skeleton className='w-full h-4' />
        <Skeleton className='w-full h-4' />
      </CardContent>
      <CardFooter className='flex-col gap-4'>
        <Skeleton className='w-16 h-4' />
        <Skeleton className='w-full h-12' />
      </CardFooter>
    </Card>
  );
}
