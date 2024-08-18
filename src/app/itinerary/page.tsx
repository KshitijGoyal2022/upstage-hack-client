'use client'
import React, { useState } from 'react'
import BookingsSidebar from '@/components/booking-sidebar'
import Sidebar from '@/components/sidebar'
// import BookingDetails from '@/components/booking-details' // Assuming this component renders booking details

const ItineraryPage = () => {
  const [selectedBooking, setSelectedBooking] = useState(null); // State to hold the selected booking

  // const handleSelectBooking = (booking) => {
  //   setSelectedBooking(booking);
  // };

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <div className="w-1/6 h-full border-r rounded-3xl">
        <Sidebar />
      </div>

      {/* Bookings Sidebar Section */}
      <div className="w-1/6  h-full border-r rounded-3xl">
        <BookingsSidebar /> {/* Pass the select handler */}
      </div>

      {/* Main Content Area */}
      <div className="w-4/6 h-full p-4 overflow-auto">
        {/* {selectedBooking ? (
          <BookingDetails booking={selectedBooking} />
        ) : ( */}
          <div className="text-center text-gray-500">Please select a booking</div>
        {/* )} */}
      </div>
    </div>
  )
}

export default ItineraryPage;
