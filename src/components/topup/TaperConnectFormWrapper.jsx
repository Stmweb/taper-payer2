import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { base44 } from '@/api/base44Client';
import TaperConnectForm from './TaperConnectForm';

let stripePromise;

async function getStripePromise() {
  if (!stripePromise) {
    try {
      const res = await base44.functions.invoke('getStripeKey', {});
      stripePromise = loadStripe(res.data.publicKey);
    } catch (e) {
      console.error('Failed to load Stripe key:', e);
    }
  }
  return stripePromise;
}

export default function TaperConnectFormWrapper() {
  const [stripePromiseValue, setStripePromiseValue] = React.useState(null);

  React.useEffect(() => {
    getStripePromise().then(setStripePromiseValue);
  }, []);

  if (!stripePromiseValue) {
    return <div className="text-center py-8">Loading payment system...</div>;
  }

  return (
    <Elements stripe={stripePromiseValue}>
      <TaperConnectForm />
    </Elements>
  );
}