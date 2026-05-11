import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppAuth } from '@/lib/AppAuthContext';

// Pages that are accessible without login
const PUBLIC_PATHS = [
  '/TaperPayerLogin',
  '/TaperPayerSignup',
  '/MoncashReturn',
  '/ThankYou',
  '/PaymentRequest',
  '/SMSOptIn',
  '/ddb00654a29b6bb256d50d1a8ffa84e1.html',
  '/support',
  '/app',
  '/legal/partner-terms',
  '/OrderForm',
  '/TaperPayerFAQ',
  '/TaperPayerTerms',
  '/TaperPayerPrivacy',
  '/TaperPayerCookies',
  '/TaperPayerAML',
  '/TaperPayerCompliance',
];

export default function AppAuthGuard({ children }) {
  const { user, isLoading } = useAppAuth();
  const location = useLocation();

  const isPublic = PUBLIC_PATHS.some(p => location.pathname.startsWith(p));

  return <>{children}</>;
}