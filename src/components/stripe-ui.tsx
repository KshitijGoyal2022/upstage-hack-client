import * as React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from './ui/button';

interface StripeCheckoutProps {
  flightName: string;
  flightPrice: number;
  flightImage: string;
  itineraryId: string;
}

// Load Stripe outside of component render to avoid creating a new instance on every render.
const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
);

const StripeCheckout = ({ flightName, flightPrice, flightImage, itineraryId }: StripeCheckoutProps) => {
  const handleCheckout = React.useCallback(async () => {
    // Fetch the session ID from your backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/create-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flightName, flightPrice, flightImage, itineraryId }),
      }
    );
    const { sessionId } = await response.json();

    const stripe = await stripePromise;

    // Redirect to the Stripe Checkout page
    const { error } = await stripe?.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error('Error redirecting to checkout:', error);
    }
  }, [flightName, flightPrice, flightImage, itineraryId]);

  return (
    <div>
      <Button onClick={handleCheckout}>
        Book Flight
      </Button>
    </div>
  );
};

export default StripeCheckout;
