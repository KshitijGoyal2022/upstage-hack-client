import { ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='grid grid-cols-2 gap-4'>
        <div
          className='w-[400px] flex flex-col justify-between p-10 rounded-lg'
          style={{ backgroundColor: '#F8F9FB' }}
        >
          <div className='flex flex-col mb-4'>
            <p className='text-lg font-medium'>
              Need help deciding where to go, booking, or itinerary planning?
            </p>
            <p className='text-gray-600 mt-2 flex items-center'>
              Talk to our AI
              <ChevronRight />
            </p>
          </div>
          <div className='flex justify-start'>
            {/* <img
              src="/path/to/your/first-icon.png" 
              alt="AI Chat Icon"
              className="h-10 w-10"
            /> */}
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <div
            className='flex justify-between items-center p-10 rounded-lg'
            style={{ backgroundColor: '#F8F9FB' }}
          >
            <div>
              <p className='text-lg font-medium'>I just want to browse</p>
              <p className='text-gray-600 mt-2 flex'>
                <span>Go to Home</span> <ChevronRight />
              </p>
            </div>
            {/* <img
              src="/path/to/your/second-icon.png"
              alt="Browse Icon"
              className="h-10 w-10"
            /> */}
          </div>

          <div
            className='flex justify-between items-center p-10 rounded-lg'
            style={{ backgroundColor: '#F8F9FB' }}
          >
            <div>
              <p className='text-lg font-medium'>I want to see my plans</p>
              <p className='flex text-gray-600 mt-2'>
                <span> Bookings and itinerary </span> <ChevronRight />
              </p>
            </div>
            {/* <img
              src="/path/to/your/third-icon.png"
              alt="Plans Icon"
              className="h-10 w-10"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
