import React, { useEffect } from 'react';
import BottomTabBar from '@/components/mobile/BottomTabBar';

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/d7d75e226_ChatGPTImageDec29202501_48_52PM.png';
    document.head.appendChild(link);

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
      className="flex flex-col"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <style>{`
        html, body {
          overflow: hidden;
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
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
      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: showBottomTabBar ? 'calc(4rem + env(safe-area-inset-bottom, 0px))' : 0 }}
      >
        {children}
      </div>
      {showBottomTabBar && <BottomTabBar />}
    </div>
  );
}