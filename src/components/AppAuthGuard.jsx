import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppAuth } from '@/lib/AppAuthContext';

// Pages accessible without login (on mobile too)
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function AppAuthGuard({ children }) {
  const { user, isLoading } = useAppAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const isPublic = PUBLIC_PATHS.some(p => location.pathname.startsWith(p));

  useEffect(() => {
    // Only enforce auth on mobile, and only on non-public paths
    if (!isLoading && isMobile && !user && !isPublic) {
      navigate(`/TaperPayerLogin?from=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [isLoading, isMobile, user, isPublic, navigate, location.pathname]);

  // On mobile, show nothing while we figure out auth (prevents flash)
  if (isMobile && isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // On mobile, if not logged in and not on a public path, render nothing (redirect in progress)
  if (isMobile && !user && !isPublic) {
    return null;
  }

  return <>{children}</>;
}