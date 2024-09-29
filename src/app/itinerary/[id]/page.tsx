'use client';

import React, { useState } from 'react';
import Chat from '@/components/chat';
import Sidebar from '@/components/sidebar';
import AiPlayground from '@/components/AiPlayground';
import { useAuth0 } from '@auth0/auth0-react';
import { useItinerary } from '@/useItinerary';
import { Button } from '@/components/ui/button';
import { ShareModal } from '@/components/share-modal';
import Link from 'next/link';

import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export function MagicButton({ text = 'Magic' }) {
	return (
	  <HoverBorderGradient
		as='button'
		className='w-full dark:bg-black bg-white text-black dark:text-white flex items-center justify-center space-x-2'
	  >
		<AceternityLogo />
		<span>{text}</span>
	  </HoverBorderGradient>
	);
  }
  
  export function BookButton() {
	return (
	  <HoverBorderGradient
		as='button'
		className='w-full dark:bg-black bg-white text-black dark:text-white flex items-center justify-center space-x-2'
	  >
		<AceternityLogo />
		<span>Book</span>
	  </HoverBorderGradient>
	);
  }
  
  export function PreviewButton() {
	return (
	  <HoverBorderGradient
		as='button'
		className='w-full dark:bg-black bg-white text-black dark:text-white flex items-center justify-center space-x-2'
	  >
		<AceternityLogo />
		<span>Preview</span>
	  </HoverBorderGradient>
	);
  }

import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader';
import { IconSquareRoundedX } from '@tabler/icons-react';
import { set } from 'date-fns';
import { getMagicItinerary } from '@/apis';
import { BlurredModal } from '@/components/ui/blurred-modal';
import ItineraryRender from '@/components/itinerary-render';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

const loadingStates = [
  {
    text: 'Finding optimal routing',
  },
  {
    text: 'Matching restaurants',
  },
  {
    text: 'Matching top sights',
  },
  {
    text: 'Inserting hotels',
  },
  {
    text: 'Your itinerary is ready 🎉',
  },
];

export function MultiStepLoaderDemo(props: {
  loading: boolean;
  onMagicClick: () => void;
}) {
  return (
    <div className='w-full flex items-center justify-center'>
      {/* Core Loader Modal */}
      <Loader
        loadingStates={loadingStates}
        loading={props.loading}
        duration={5000}
        loop={false}
      />

      {/* The buttons are for demo only, remove it in your actual code ⬇️ */}
      <button onClick={props.onMagicClick}>
        <MagicButton />
      </button>

      {/* {loading && (
				<button
					className="fixed top-4 right-4 text-black dark:text-white z-[120]"
					onClick={() => setLoading(false)}
				>
					<IconSquareRoundedX className="h-10 w-10" />
				</button>
			)} */}
    </div>
  );
}

const AceternityLogo = () => {
  return (
    <svg
      width='66'
      height='65'
      viewBox='0 0 66 65'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='h-3 w-3 text-black dark:text-white'
    >
      <path
        d='M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696'
        stroke='currentColor'
        strokeWidth='15'
        strokeMiterlimit='3.86874'
        strokeLinecap='round'
      />
    </svg>
  );
};

const Itinerary = ({ params }: any) => {
  const { user, isLoading: authLoading } = useAuth0();
  const { id } = params;

  const [magicItinerary, setMagicItinerary] = React.useState<any>(null);
  const [magicLoading, setMagicLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const { itinerary, isLoading, onRefreshItinerary } = useItinerary(id);

  const callbackMagicItinerary = async () => {
    setMagicLoading(true);
    const itinerary = await getMagicItinerary(id);

    if (itinerary) {
      setMagicItinerary(itinerary);
      setOpen(true);
    }
    setMagicLoading(false);
  };

  if (authLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-600'>Authenticating...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-600'>
          Loading itinerary...
        </p>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className='flex flex-col items-center justify-center h-screen space-y-4'>
        <h2 className='text-2xl font-semibold text-red-600'>
          Itinerary Not Found
        </h2>
        <p className='text-lg text-gray-600'>
          We could not find the itinerary with this id.
        </p>
      </div>
    );
  }

  if (
    itinerary?.users?.findIndex((u) => u?.user?.provider?.id === user?.sub) ===
    -1
  ) {
    return (
      <div className='flex flex-col items-center justify-center h-screen space-y-4'>
        <h2 className='text-2xl font-semibold text-red-600'>Not a Member</h2>
        <p className='text-lg text-gray-600'>
          You are not a member. You need to have access in order to enter.
        </p>
      </div>
    );
  }

  const shareLink = `${window.location.href}/join`;

  console.log(magicItinerary);

  return (
    <div className='grid grid-cols-12 relative'>
      <ItineraryRender
        open={(!!magicItinerary || itinerary?.magic) && open}
        itinerary={magicItinerary || itinerary?.magic}
        onClose={() => setOpen(false)}
        wholeItinerary={itinerary}
      />
      {/* Sidebar Section */}
      <div className='col-span-2 border-r h-full sticky top-0'>
        <Sidebar />
      </div>
      <div className='col-span-7'>
        {/* Group AI Playground heading with 3 dots menu */}
        <div className="flex justify-between items-center p-4">
          <h2 className='mt-2 text-xl font-semibold text-center'>AI-Powered Itinerary Planning Hub</h2>
          
          {/* 3 vertical dots dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <MoreVertical className="w-6 h-6 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem className="w-full">
                <Link href={`${id}/book-info`} className="w-full" passHref>
                  <BookButton />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full">
                <Link href={`${id}/preview`} className="w-full" passHref>
                  <PreviewButton />
                </Link>
              </DropdownMenuItem>
              {!magicItinerary && !itinerary?.magic && (
                <DropdownMenuItem className="w-full">
                  <MultiStepLoaderDemo
                    loading={magicLoading}
                    onMagicClick={callbackMagicItinerary}
                  />
                </DropdownMenuItem>
              )}
              {itinerary?.magic && (
                <DropdownMenuItem className="w-full">
                  <Button onClick={() => setOpen(true)}>Open Magic</Button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AiPlayground
          itineraryId={id}
          itinerary={itinerary}
          onRefreshItinerary={onRefreshItinerary}
        />
      </div>

      {/* Group Chat Section */}
      <div className='col-span-3 h-full border-l flex flex-col'>
        <div className='flex justify-between'>
          <h2 className='mt-2 text-xl font-semibold p-4 flex justify-center'>
            Group Chat
          </h2>
          <div className='p-4'>
            <ShareModal shareLink={shareLink} />
          </div>
        </div>
        <Chat itineraryId={id} />
      </div>
    </div>
  );
};

export default Itinerary;
