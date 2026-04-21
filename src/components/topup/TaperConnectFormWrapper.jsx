import React from 'react';
import TaperConnectForm from './TaperConnectForm';

// No Stripe wrapper needed — using Square Web Payments SDK
export default function TaperConnectFormWrapper({ initialCountry }) {
  return <TaperConnectForm initialCountry={initialCountry} />;
}