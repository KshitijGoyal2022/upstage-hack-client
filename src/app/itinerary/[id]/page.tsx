'use client';

import React from 'react';
import { useRouter } from 'next/router';

import Chat from '@/components/chat';
import Sidebar from '@/components/sidebar';
import Image from 'next/image';

const Itinerary = ({ params }: any) => {
  const { id } = params;

  return (
    <div className='grid grid-cols-12'>
      <div className='col-span-2 border-r'>
        <Sidebar />
      </div>

      {/* Main Content - Itinerary Details */}
      <div className='col-span-7 p-6'>
        <div className='flex flex-col'>

          <div className='mt-4'>
            <div className='relative h-64'>
              {/* Replace with the Map component */}
              <Image
                src='/Europe-Political-Map.jpg'
                alt='Map'
                className='w-full h-full object-cover'
                width={500}
                height={500}
              />
            </div>
            <div className='mt-6'>
              {/* Itinerary details go here */}
              <ul>
                <li className='mb-4'>
                  <div className='text-gray-700 font-medium'>
                    Jeju International Airport
                  </div>
                  <div className='text-sm text-gray-500'>
                    9:30-10:40am - KE1055
                  </div>
                </li>
                <li className='mb-4'>
                  <div className='text-yellow-600 font-medium'>
                    XYZ Restaurant
                  </div>
                  <div className='text-sm text-gray-500'>11:30-12:30pm</div>
                </li>
                {/* Add other items similarly */}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <div className='col-span-3 border-l'>
        <Chat itineraryId={id} />
      </div>
    </div>
  );
};

export default Itinerary;
