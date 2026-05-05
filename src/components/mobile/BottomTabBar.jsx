import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, TrendingUp, HelpCircle, UserCircle } from 'lucide-react';

const tabs = [
  { name: 'Home',         icon: Home,        path: createPageUrl('TaperPayerHome') },
  { name: 'Rates',        icon: TrendingUp,  path: createPageUrl('TaperPayerRates') },
  { name: 'How It Works', icon: HelpCircle,  path: createPageUrl('TaperPayerHowItWorks') },
  { name: 'Profile',      icon: UserCircle,  path: '/MobileProfile' },
];

export default function BottomTabBar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname === path + '.html';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <Link
              key={tab.name}
              to={tab.path}
              onClick={(e) => {
                if (active) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative"
              style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation' }}
            >
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 52,
                    height: 38,
                    borderRadius: 14,
                    background: 'rgba(36,121,194,0.1)',
                    pointerEvents: 'none',
                  }}
                />
              )}
              <Icon
                className="w-6 h-6 mb-0.5 transition-all duration-200"
                style={{
                  color: active ? '#2479C2' : '#9ca3af',
                  strokeWidth: active ? 2.2 : 1.8,
                  transform: active ? 'translateY(-1px)' : 'none',
                }}
              />
              <span
                className="text-[10px] font-semibold leading-none transition-all duration-200"
                style={{ color: active ? '#2479C2' : '#9ca3af' }}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}