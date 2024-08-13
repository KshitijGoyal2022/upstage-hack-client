import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='grid grid-cols-2 gap-4'>
        <div
          className='w-[400px] flex flex-col p-10 rounded-lg'
          style={{ backgroundColor: '#F8F9FB' }}
        >
          <div className='flex flex-col'>
            <p className='text-lg font-medium'>
              Need help deciding where to go, booking, or itinerary planning?
            </p>
            <Link className='text-gray-600 mt-2 flex items-center' href='/'>
              Talk to our AI
              <ChevronRight />
            </Link>
          </div>
          <div className='flex justify-center'>
            <Image
              src="/chat.svg" 
              alt="AI Chat Icon"
              width={120}
              height={120}
            />
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <div
            className='flex justify-between items-center p-10 rounded-lg'
            style={{ backgroundColor: '#F8F9FB' }}
          >
            <div>
              <p className='text-lg font-medium'>I just want to browse</p>
              <Link className='text-gray-600 mt-2 flex' href='/'>
                <span>Go to Home</span> <ChevronRight />
              </Link>
            </div>
            <Image
              src="/browse.svg" 
              alt="AI Chat Icon"
              className=""
              width={60}
              height={60}
            />
          </div>

          <div
            className='flex justify-between items-center p-10 rounded-lg'
            style={{ backgroundColor: '#F8F9FB' }}
          >
            <div>
              <p className='text-lg font-medium'>I want to see my plans</p>
              <Link className='flex text-gray-600 mt-2' href='/'>
                <span> Bookings and itinerary </span> <ChevronRight />
              </Link>
            </div>
            <Image
              src="/calendar.svg" 
              alt="AI Chat Icon"
              className=""
              width={60}
              height={60}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
