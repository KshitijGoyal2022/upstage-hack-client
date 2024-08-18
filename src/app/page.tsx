'use client';

import LoginButton from '@/components/login';
import LogoutButton from '@/components/logout';
import Navbar from '@/components/navbar';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className='flex justify-center items-center min-h-screen p-4'>
        <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-4'>
          <div
            className='w-full md:w-[400px] flex flex-col p-6 md:p-10 rounded-lg'
            style={{ backgroundColor: '#F8F9FB' }}
          >
            <div className='flex flex-col'>
              <p className='text-lg font-medium'>
                Need help deciding where to go, booking, or itinerary planning?
              </p>
              <Link
                className='text-gray-600 mt-2 flex items-center'
                href='/ai-chat'
              >
                Talk to our AI
                <ChevronRight />
              </Link>
            </div>
            <div className='flex justify-center mt-4'>
              <Image
                src='/chat.svg'
                alt='AI Chat Icon'
                width={120}
                height={120}
              />
            </div>
          </div>
          {/* OR Text for Small Screens */}
          <div className='flex justify-center items-center sm:block md:hidden'>
            <p className='text-lg '>OR</p>
          </div>
          <div
            className='w-full md:w-[400px] flex flex-col p-6 md:p-10 rounded-lg'
            style={{ backgroundColor: '#F8F9FB' }}
          >
            <div className='flex flex-col'>
              <p className='text-lg font-medium'>I want to see my existing itinerary and bookings </p>
              <Link
                className='text-gray-600 mt-2 flex items-center'
                href='/itinerary/66c1655b48bb8abd73b8b840'
              >
                Go to Profile
                <ChevronRight />
              </Link>
            </div>
            <div className='flex justify-center mt-4'>
              <Image
                src='/calendar.svg'
                alt='Calendar Icon'
                className=''
                width={80}
                height={80}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
