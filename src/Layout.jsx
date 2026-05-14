import React, { useEffect } from 'react';
import BottomTabBar from '@/components/mobile/BottomTabBar';

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    // Set favicon
    let faviconLink = document.querySelector("link[rel='icon']");
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.type = 'image/png';
    faviconLink.href = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/d7d75e226_ChatGPTImageDec29202501_48_52PM.png';

    // Set Apple touch icon for iOS
    let appleTouchLink = document.querySelector("link[rel='apple-touch-icon']");
    if (!appleTouchLink) {
      appleTouchLink = document.createElement('link');
      appleTouchLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleTouchLink);
    }
    appleTouchLink.href = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/d7d75e226_ChatGPTImageDec29202501_48_52PM.png';

    document.title = 'Taper Payer - Global Money Transfer';

    // Dark mode support based on system preferences
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  const showBottomTabBar = ![
    'TaperPayerLogin',
    'TaperPayerSignup',
    'TaperPayerContact',
    'AccountSettings'
  ].includes(currentPageName);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <style>{`
        html, body {
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
          position: relative;
        }
        button, a, nav, [role="button"] {
          user-select: none;
          -webkit-user-select: none;
        }
        svg {
          user-select: none;
          -webkit-user-select: none;
          pointer-events: none;
        }
      `}</style>
      <div className={`flex-1 overflow-y-auto${showBottomTabBar ? ' pb-24' : ''}`} style={{ maxHeight: showBottomTabBar ? 'calc(100vh - 5rem)' : 'auto' }}>
        {children}
      </div>
      {showBottomTabBar && <BottomTabBar />}
    </div>
  );
}