'use client';

import { socket } from '@/socket';
import { useChat } from '@/socket/chat';
import React, { act, useRef } from 'react';
import { FlightCard, FlightSkeleton } from './renders/RenderFlights';

import {
  CornerDownLeft,
  MapPin,
  Mic,
  Paperclip,
  Star,
  Tag,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

import { saveActivity, saveFlight, saveHotel } from '@/apis';
import { useAuth0 } from '@auth0/auth0-react';
import { generateFlightOfferUniqueId } from '@/helpers';
import Image from 'next/image';
import HotelCard from './render/HotelCard';
import RestaurantCard from './render/RestaurantCard';
import {
  GoogleEventsResult,
  GoogleFlightData,
  GoogleFoodResult,
  GoogleHotelProperty,
  GooglePlacesResult,
} from '@/types/serp';
import { googleApi } from '@/google_api';
import Itinerary from '@/app/itinerary/[id]/page';

export const hotel_tags_set = new Set([
  'lodging',
  'hotel',
  'vacation_rental',
  'campground',
  'motel',
  'hostel',
  'bed_and_breakfast',
  'resort',
  'apartment_or_condo',
  'mountain_hut',
]);

function groupIntoPairs(arr: any[]) {
  let result = [];

  for (let i = 0; i < arr.length; i += 2) {
    result.push([arr[i], arr[i + 1]]);
  }

  return result;
}

export default function AiPlayground(props: {
  itineraryId: string;
  itinerary: any;
  onRefreshItinerary: () => void;
}) {
  const { user } = useAuth0();
  const [message, setMessage] = React.useState('');

  const viewRef = useRef<HTMLDivElement>(null);

  const [returnFlights, setReturnFlights] =
    React.useState<GoogleFlightData | null>(null);
  const [returnFlightsLoading, setReturnFlightsLoading] =
    React.useState<boolean>(false);

  const chat = useChat(props.itineraryId, socket, viewRef);

  const callbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    chat.sendChat(message);
    setMessage('');
  };

  const callbackSaveFlight = async (
    flight: GoogleFlightData['best_flights'][number],
    date: string
  ) => {
    await googleApi.saveOutboundFlight(props.itineraryId, flight, date);
    props?.onRefreshItinerary();
  };

  const callbackSaveRestaurant = async (restaurant: GoogleFoodResult) => {
    await googleApi.saveGoogleRestaurant(props.itineraryId, restaurant);
    props?.onRefreshItinerary();
  };

  const callbackRemoveRestaurant = async (restaurant: GoogleFoodResult) => {
    await googleApi.deleteGoogleRestaurant(props.itineraryId, restaurant.title);
    props?.onRefreshItinerary();
  };

  const callbackSaveHotel = async (hotel: GoogleHotelProperty) => {
    await googleApi.saveHotel(props.itineraryId, hotel);
    props?.onRefreshItinerary();
  };

  const callbackRemoveHotel = async (hotel: GoogleHotelProperty) => {
    await googleApi.deleteGoogleHotel(props.itineraryId, hotel.property_token);
    props?.onRefreshItinerary();
  };

  const callbackSaveTopSights = async (
    topSights: GooglePlacesResult['top_sights']['sights'][number]
  ) => {
    await googleApi.saveTopSights(props.itineraryId, topSights);
    props?.onRefreshItinerary();
  };

  const callbackRemoveTopSights = async (
    topSights: GooglePlacesResult['top_sights']['sights'][number]
  ) => {
    await googleApi.deleteGoogleTopSights(props.itineraryId, topSights.title);
    props?.onRefreshItinerary();
  };

  const callbackSaveLocalResults = async (
    localResults: GooglePlacesResult['local_results']['places'][number]
  ) => {
    await googleApi.saveLocalResults(props.itineraryId, localResults);
    props?.onRefreshItinerary();
  };

  const callbackRemoveLocalResults = async (
    localResults: GooglePlacesResult['local_results']['places'][number]
  ) => {
    await googleApi.deleteGoogleLocalResults(
      props.itineraryId,
      localResults.place_id
    );
    props?.onRefreshItinerary();
  };

  const callbackSaveShoppingResults = async (
    shoppingResults: GooglePlacesResult['shopping_results'][number]
  ) => {
    await googleApi.saveGoogleShopping(props.itineraryId, shoppingResults);
    props?.onRefreshItinerary();
  };

  const callbackRemoveShoppingResults = async (
    shoppingResults: GooglePlacesResult['shopping_results'][number]
  ) => {
    await googleApi.deleteGoogleShopping(
      props.itineraryId,
      shoppingResults.title
    );
    props?.onRefreshItinerary();
  };

  const callbackSaveEvent = async (
    event: GoogleEventsResult['events_results'][number]
  ) => {
    await googleApi.saveGoogleEvents(props.itineraryId, event);
    props?.onRefreshItinerary();
  };

  const callbackRemoveEvent = async (
    event: GoogleEventsResult['events_results'][number]
  ) => {
    await googleApi.deleteGoogleEvents(props.itineraryId, event.title);
    props?.onRefreshItinerary();
  };

  const callbackGetReturnFlights = async (params: {
    departure_id: string;
    arrival_id: string;
    departure_token: string;
    outbound_date: string;
    return_date: string;
  }) => {
    setReturnFlightsLoading(true);
    const response = await googleApi.getReturnFlights(params);
    setReturnFlights(response);
    setReturnFlightsLoading(false);
  };

  const callbackSaveReturnFlight = async (
    flight: GoogleFlightData['best_flights'][number],
    date: string
  ) => {
    await googleApi.saveReturnFlight(props.itineraryId, flight, date);
    props?.onRefreshItinerary();
  };

  const isAdmin = props.itinerary?.admin?.provider?.id === user?.sub;

  /**
   * Flight
   * Hotels x
   * Top Sights
   * Events
   * Restaurants x
   * Activities
   * Shopping areas
   */

  return (
    <div className='col-span-7 h-full flex flex-col'>
      <div
        className='flex-1 overflow-y-auto  space-y-8 min-h-[650px] max-h-[800px]'
        ref={viewRef}
      >
        {chat.chats.length > 0 &&
          chat.chats.map((chat, index) => {
            const plans = [
              ...(chat.flight_offer_search?.best_flights || []),
              ...(chat.flight_offer_search?.other_flights || []),
            ];
            return (
              <div key={index} className='space-y-8'>
                {(plans.length > 0 && (
                  <div>
                    <h1 className='font-semibold text-2xl p-6'>{chat.title}</h1>

                    <div className='flex flex-row overflow-x-auto gap-4 px-6 '>
                      {plans?.map((flight, index) => {
                        return (
                          <FlightCard
                            flight={flight}
                            key={flight?.id}
                            isAdmin={isAdmin}
                            isSelected={
                              flight?.id === props.itinerary?.g_flights?.[0]?.id
                            }
                            currency={
                              chat.flight_offer_search.search_parameters
                                ?.currency || 'USD'
                            }
                            onPress={() => {
                              callbackSaveFlight(
                                {
                                  ...flight,
                                  currency:
                                    chat.flight_offer_search.search_parameters
                                      ?.currency || 'USD',
                                },
                                chat.flight_offer_search.search_parameters
                                  ?.outbound_date
                              );

                              // fetch return flights
                              if (
                                chat.flight_offer_search?.search_parameters
                                  ?.return_date &&
                                flight.departure_token
                              )
                                callbackGetReturnFlights(
                                  {
                                    departure_id:
                                      chat.flight_offer_search
                                        ?.search_parameters?.departure_id,
                                    arrival_id:
                                      chat.flight_offer_search
                                        ?.search_parameters?.arrival_id,
                                    departure_token: flight.departure_token,
                                    outbound_date:
                                      chat.flight_offer_search
                                        ?.search_parameters?.outbound_date,
                                    return_date:
                                      chat.flight_offer_search
                                        ?.search_parameters?.return_date,
                                  },
                                  chat.flight_offer_search.search_parameters
                                    ?.return_date
                                );
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )) ||
                  (chat.flight_offer_search === null && (
                    <p className='text-center'>
                      Sorry, we could not find any flights
                    </p>
                  ))}

                {chat.places_search?.top_sights && (
                  <div className='p-6'>
                    <h1 className='font-semibold text-3xl mb-6 text-gray-800'>
                      Explore Top Sights
                    </h1>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {chat.places_search.top_sights?.sights?.map(
                        (activity) => {
                          const selected = props.itinerary?.g_top_sights?.find(
                            (h) => h.title === activity.title
                          );

                          return (
                            <div
                              key={activity.title}
                              className='group relative overflow-hidden border rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 bg-white'
                              style={{ minHeight: '480px' }} // Ensures card height
                            >
                              {/* Image Section with Overlay */}
                              <div className='relative w-full h-56 overflow-hidden rounded-t-xl'>
                                <Image
                                  src={activity.thumbnail}
                                  alt={activity.title}
                                  layout='fill'
                                  objectFit='cover'
                                  className='group-hover:scale-105 transition-transform duration-500'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-25 transition-opacity group-hover:bg-opacity-40'></div>
                              </div>

                              {/* Information Section */}
                              <div className='p-4'>
                                <h2 className='font-bold text-xl truncate text-gray-900'>
                                  {activity.title}
                                </h2>

                                {/* Activity Description */}
                                <p className='mt-1 text-sm text-gray-600 line-clamp-2'>
                                  {activity.description}
                                </p>

                                {/* Price */}
                                <div className='flex items-center gap-2 mt-3'>
                                  <Tag className='w-4 h-4 text-gray-600' />
                                  <p className='font-semibold text-lg text-gray-700'>
                                    {activity.price
                                      ? `${activity.price}`
                                      : 'Free'}
                                  </p>
                                </div>

                                {/* Rating and Reviews */}
                                <div className='flex items-center mt-2 space-x-1 text-yellow-500'>
                                  <Star className='w-5 h-5' />
                                  <p className='text-sm'>{activity.rating}</p>
                                  <p className='text-sm text-gray-500'>
                                    ({activity.reviews} reviews)
                                  </p>
                                </div>

                                {/* Location */}
                                <div className='flex items-center gap-2 mt-3'>
                                  <MapPin className='w-4 h-4 text-gray-600' />
                                  <p className='text-sm text-gray-500'>
                                    Location: {activity.location || 'Unknown'}
                                  </p>
                                </div>

                                {/* Divider */}
                                <hr className='my-3 border-gray-200' />

                                {/* Add/Remove Button */}
                                <div className='absolute bottom-4 left-4 right-4'>
                                  <Button
                                    onClick={() =>
                                      selected
                                        ? callbackRemoveTopSights(activity)
                                        : callbackSaveTopSights(activity)
                                    }
                                    className={`w-full py-2 text-white transition ${
                                      selected
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                  >
                                    {selected
                                      ? 'Remove from Itinerary'
                                      : 'Add to Itinerary'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/**show me some upcoming events in vancouver */}
                {chat?.event_search?.events_results && (
                  <div className='p-6'>
                    <h1 className='font-semibold text-3xl mb-6 text-gray-800'>
                      Upcoming Events
                    </h1>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {chat?.event_search?.events_results?.map((event) => {
                        const selected = props.itinerary?.g_events?.find(
                          (h) => h.title === event.title
                        );

                        return (
                          <div
                            key={event.title}
                            className='group relative overflow-hidden border rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 bg-white'
                            style={{ minHeight: '450px' }}
                          >
                            {/* Event Thumbnail */}
                            <div className='relative w-full h-56 overflow-hidden rounded-t-xl'>
                              <Image
                                src={event.thumbnail}
                                alt={event.title}
                                layout='fill'
                                objectFit='cover'
                                className='group-hover:scale-105 transition-transform duration-500'
                              />
                              <div className='absolute inset-0 bg-black bg-opacity-25 transition-opacity group-hover:bg-opacity-40'></div>
                            </div>

                            {/* Event Info */}
                            <div className='p-4 space-y-2'>
                              <h2 className='font-bold text-xl truncate text-gray-900'>
                                {event.title}
                              </h2>
                              <p className='text-sm text-gray-600'>
                                {event.date.start_date} - {event.date.when}
                              </p>
                              <p className='text-sm text-gray-600 line-clamp-2'>
                                {event.description}
                              </p>

                              {/* Ticket Info */}
                              <div className='mt-4'>
                                <a
                                  href={event.ticket_info[0].link}
                                  className='text-blue-600 hover:underline flex items-center gap-1'
                                >
                                  <Paperclip className='w-4 h-4' />
                                  {event.ticket_info[0].source}
                                </a>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className='absolute bottom-4 left-4 right-4'>
                              <Button
                                onClick={() =>
                                  selected
                                    ? callbackRemoveEvent(event)
                                    : callbackSaveEvent(event)
                                }
                                className={`w-full py-2 text-white transition ${
                                  selected
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                              >
                                {selected
                                  ? 'Remove from Itinerary'
                                  : 'Add to Itinerary'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/**show me some hotels to stay in new york from 20 october 2024, to 30 october 2024 */}
                {chat.hotel_search?.properties && (
                  <div>
                    <h1 className='font-semibold text-2xl p-6'>
                      {chat.title.replaceAll('"', '')}
                    </h1>
                    <div className='flex flex-row overflow-x-auto gap-6 pb-12 px-8'>
                      {chat.hotel_search.properties.map((hotel) => {
                        const selected = props.itinerary?.g_hotels?.find(
                          (h) => h.property_token === hotel.property_token
                        );
                        return (
                          <HotelCard
                            hotel={hotel}
                            selected={selected}
                            key={hotel.property_token}
                            onSelect={(hotel) => {
                              selected
                                ? callbackRemoveHotel(hotel)
                                : callbackSaveHotel(hotel);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {/**show me some restaurants in new york */}
                {chat.places_search?.local_results?.places && (
                  <div className='p-6'>
                    <h1 className='font-semibold text-3xl mb-6 text-gray-800'>
                      Explore Local Places
                    </h1>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {chat.places_search.local_results?.places?.map(
                        (activity) => {
                          const selected =
                            props.itinerary?.g_local_results?.find(
                              (h) => h.place_id === activity.place_id
                            );

                          return (
                            <div
                              key={activity.place_id}
                              className='group relative overflow-hidden border rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 bg-white'
                              style={{ minHeight: '450px' }}
                            >
                              {/* Thumbnail Image */}
                              <div className='relative w-full h-56 overflow-hidden rounded-t-xl'>
                                <Image
                                  src={activity.thumbnail}
                                  alt={activity.title}
                                  layout='fill'
                                  objectFit='cover'
                                  className='group-hover:scale-105 transition-transform duration-500'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-25 transition-opacity group-hover:bg-opacity-40'></div>
                              </div>

                              {/* Activity Info */}
                              <div className='p-4 space-y-2'>
                                <h2 className='font-bold text-xl truncate text-gray-900'>
                                  {activity.title}
                                </h2>
                                <p className='font-semibold text-lg text-gray-700'>
                                  {activity.price
                                    ? `$${activity.price}`
                                    : 'Free'}
                                </p>

                                {/* Provider Name */}
                                <p className='text-sm text-gray-500'>
                                  {activity.provider || 'Unknown Provider'}
                                </p>

                                {/* Rating */}
                                <div className='flex items-center mt-2 text-yellow-500'>
                                  <Star className='w-5 h-5' />
                                  <p className='text-sm'>{activity.rating}</p>
                                  <p className='text-sm text-gray-500 ml-2'>
                                    ({activity.reviews} reviews)
                                  </p>
                                </div>
                              </div>

                              {/* Action Button */}
                              <div className='absolute bottom-4 left-4 right-4'>
                                <Button
                                  onClick={() =>
                                    selected
                                      ? callbackRemoveLocalResults(activity)
                                      : callbackSaveLocalResults(activity)
                                  }
                                  className={`w-full py-2 text-white transition ${
                                    selected
                                      ? 'bg-red-500 hover:bg-red-600'
                                      : 'bg-blue-500 hover:bg-blue-600'
                                  }`}
                                >
                                  {selected
                                    ? 'Remove from Itinerary'
                                    : 'Add to Itinerary'}
                                </Button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/**show me some museums in milan*/}
                {chat.places_search?.shopping_results && (
                  <div className='p-6'>
                    <h1 className='font-semibold text-3xl mb-6 text-gray-800'>
                      Shopping in Milan
                    </h1>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {chat?.places_search?.shopping_results?.map(
                        (activity) => {
                          const selected = props.itinerary?.g_shopping?.find(
                            (h) => h.title === activity.title
                          );

                          return (
                            <div
                              key={activity.title}
                              className='group relative overflow-hidden border rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 bg-white'
                              style={{ minHeight: '450px' }}
                            >
                              {/* Activity Thumbnail */}
                              <div className='relative w-full h-56 overflow-hidden rounded-t-xl'>
                                <Image
                                  src={activity.thumbnail}
                                  alt={activity.title}
                                  layout='fill'
                                  objectFit='cover'
                                  className='group-hover:scale-105 transition-transform duration-500'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-25 transition-opacity group-hover:bg-opacity-40'></div>
                              </div>

                              {/* Activity Info */}
                              <div className='p-4 space-y-2'>
                                <h2 className='font-bold text-xl truncate text-gray-900'>
                                  {activity.title}
                                </h2>
                                <p className='font-semibold text-lg text-gray-700'>
                                  {activity.price
                                    ? `$${activity.price}`
                                    : 'Free'}
                                </p>

                                {/* Rating */}
                                <div className='flex items-center mt-2 text-yellow-500'>
                                  <Star className='w-4 h-4' />
                                  <p className='ml-1 text-sm'>
                                    {activity.rating}
                                  </p>
                                </div>

                                {/* Buy Now Link */}
                                <a
                                  href={activity.link}
                                  className='mt-2 text-blue-600 hover:underline'
                                >
                                  Buy Now
                                </a>
                              </div>

                              {/* Action Button */}
                              <div className='absolute bottom-4 left-4 right-4'>
                                <Button
                                  onClick={() =>
                                    selected
                                      ? callbackRemoveShoppingResults(activity)
                                      : callbackSaveShoppingResults(activity)
                                  }
                                  className={`w-full py-2 text-white transition ${
                                    selected
                                      ? 'bg-red-500 hover:bg-red-600'
                                      : 'bg-blue-500 hover:bg-blue-600'
                                  }`}
                                >
                                  {selected
                                    ? 'Remove from Itinerary'
                                    : 'Add to Itinerary'}
                                </Button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/** local results places  sinc as : shopping malls in milan */}
                {chat.places_search?.local_results?.places && (
                  <div>
                    <h1 className='font-semibold text-2xl p-6'>{chat.title}</h1>

                    {/* Container for the activity cards */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                      {chat.places_search.local_results?.places?.map(
                        (activity) => {
                          const selected =
                            props.itinerary?.g_local_results?.find(
                              (h) => h.place_id === activity.place_id
                            );
                          return (
                            <div
                              key={activity.place_id}
                              className='border rounded-lg p-4 shadow-md hover:shadow-lg bg-white'
                            >
                              {/* Thumbnail Image */}
                              <div className='relative w-full h-40'>
                                <Image
                                  src={activity.thumbnail}
                                  alt={activity.title}
                                  layout='fill'
                                  objectFit='cover'
                                  className='rounded-lg'
                                />
                              </div>

                              {/* Activity Title */}
                              <h2 className='font-bold mt-4 truncate'>
                                {activity.title}
                              </h2>

                              {/* Price */}
                              <p className='font-semibold text-lg mt-2 text-gray-700'>
                                {activity.price ? `$${activity.price}` : 'Free'}
                              </p>

                              {/* Provider Name */}
                              <p className='text-sm text-gray-500'>
                                {activity.provider
                                  ? activity.provider
                                  : 'Unknown Provider'}
                              </p>

                              {/* Rating */}
                              <div className='flex items-center mt-2'>
                                <p className='text-sm text-yellow-500 flex items-center gap-1'>
                                  <Star className='w-4 h-4' />
                                  {activity.rating}
                                </p>
                                <p className='text-sm text-gray-500 ml-2'>
                                  (
                                  {activity.reviews
                                    ? activity.reviews
                                    : 'No Reviews'}
                                  )
                                </p>
                              </div>

                              {/* Add/Remove Button */}
                              <div className='mt-4'>
                                <Button
                                  onClick={() =>
                                    selected
                                      ? callbackRemoveLocalResults(activity)
                                      : callbackSaveLocalResults(activity)
                                  }
                                  className='w-full bg-blue-500 text-white hover:bg-blue-600'
                                >
                                  {selected ? 'Remove' : 'Add'}
                                </Button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      {/** Loadimg */}
      {chat.isLoading && !chat.toolLoading.loading && (
        <div className='flex items-center justify-center'>
          <div className='animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900'></div>
        </div>
      )}
      {chat.toolLoading.functionName && chat.toolLoading.loading && (
        <div>
          <div className='flex flex-row overflow-x-auto gap-4 px-6 '>
            {new Array(5).fill(0).map((_, index) => (
              <FlightSkeleton key={index} />
            ))}
          </div>
        </div>
      )}
      {isAdmin && (
        <form
          className='relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring m-6'
          x-chunk='dashboard-03-chunk-1'
          onSubmit={callbackSubmit}
        >
          <Label htmlFor='message' className='sr-only'>
            Message
          </Label>
          <Input
            id='message'
            placeholder='Type your message here...'
            className='min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 outline-none'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={chat.isLoading}
          />
          <div className='flex items-center p-3 pt-0'>
            <Button
              type='submit'
              disabled={chat.isLoading}
              size='sm'
              className='ml-auto gap-1.5 disabled:opacity-40'
            >
              Send Message
              <CornerDownLeft className='size-3.5' />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
