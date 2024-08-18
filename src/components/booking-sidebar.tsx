import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { useMyBookings } from '@/useMyBookings'; // Assuming you have a hook to fetch bookings
// import { createNewBooking } from '@/apis'; // Assuming you have an API call to create bookings
// import { makeBookingId } from '@/helpers'; // Assuming you have a helper function to generate booking IDs
import { useAuth0 } from "@auth0/auth0-react";
import { useMyBookings } from "@/useMyBookings";

const bookings = [
	{
		_id: "123",
		title: "Booking 1",
	},
	{
		_id: "124",
		title: "Booking 2",
	},
	{
		_id: "125",
		title: "Booking 3",
	},
];

const BookingsSidebar = () => {
	const { user, isAuthenticated, isLoading } = useAuth0();
	const { bookings } = useMyBookings();
	//   const { bookings, loading } = useMyBookings(); // Fetch user's bookings

	// window.location.href = '/booking/' + booking._id;
	return (
		<div className="p-4 space-y-4 h-full">
			<h2 className="mt-2 text-xl font-semibold p-4 flex justify-center">
				Your Bookings
			</h2>
			<ul className="space-y-2">
				{bookings.map((booking, index) => (
					<li key={booking._id}>
						<Link href={`/booking/${booking.booking.referenceId}`} passHref>
							<Button
								variant="ghost"
								className="w-full flex items-center justify-start gap-2 rounded-lg p-2 text-gray-800 hover:bg-muted"
							>
								<Avatar className="h-8 w-8 bg-green-100">
									<AvatarFallback>
										{booking.booking.referenceId[0]}
									</AvatarFallback>
								</Avatar>
								<span className="truncate">{booking.booking.referenceId}</span>
							</Button>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default BookingsSidebar;
