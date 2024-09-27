'use client';

import StripeCheckout from '@/components/stripe-ui';

export default function CheckoutPage() {
  const data ={
    flightImage: 'https://source.unsplash.com/1600x900/?airplane',
    flightName: 'Flight to the Moon',
    flightPrice: 100,
  }
  return (
    <div className=''>
      <div className=''>
        <StripeCheckout flightImage={data.flightImage} flightName={data.flightName} flightPrice={data.flightPrice}/>
      </div>
    </div>
  );
}
