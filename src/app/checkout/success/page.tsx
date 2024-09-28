'use client';

import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  // Automatically stop confetti after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000); // 10 seconds duration for the confetti

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 relative gap-y-4'>
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* Checkmark Icon */}
      <div className='relative'>
        <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 text-purple-500'>
          <div className='w-20 h-20 flex items-center justify-center bg-purple-300 rounded-full'>
            <CheckCircleIcon className='h-12 w-12 text-white' />
          </div>
        </div>
      </div>

      {/* Main Success Message */}
      <h1 className='mt-12 text-4xl font-bold text-gray-800'>
        Congratulations!
      </h1>
      <h2 className='mt-2 text-xl text-gray-600'>
        Your payment was processed successfully.
      </h2>

      {/* Additional Message */}
      <p className='mt-4 text-lg text-gray-500'>
        Thank you for booking with us. We’re excited to help you embark on your next adventure. 
      </p>

      {/* Reference Number */}
      <p className='mt-2 text-md text-gray-500'>
        Your Booking Reference Number: <span className='font-semibold'>#456876543</span>
      </p>

      {/* Back to Home Button */}
      <Button className='mt-6'>
        <Link href='/'>Go Back to Home</Link>
      </Button>
    </div>
  );
}
