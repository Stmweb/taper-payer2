import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, DollarSign, HelpCircle, UserCircle } from 'lucide-react';

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    { name: 'Home', icon: Home, path: createPageUrl('TaperPayerHome') },
    { name: 'Rates', icon: DollarSign, path: createPageUrl('TaperPayerRates') },
    { name: 'How It Works', icon: HelpCircle, path: createPageUrl('TaperPayerHowItWorks') },
    { name: 'Profile', icon: UserCircle, path: createPageUrl('TaperPayerLogin') }
  ];

  const isActive = (path) => location.pathname === path || location.pathname === path + '.html';

  const handleTabPress = (e, tab) => {
    if (isActive(tab.path)) {
      // Already on this tab — scroll to top (reset)
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex justify-around items-center h-16" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <Link
              key={tab.name}
              to={tab.path}
              onClick={(e) => handleTabPress(e, tab)}
              role="tab"
              aria-selected={active}
              aria-current={active ? 'page' : undefined}
              aria-label={tab.name}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[56px] transition-colors ${
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation' }}
            >
              <Icon className={`w-6 h-6 mb-1 transition-transform ${active ? 'scale-110' : ''}`} aria-hidden="true" />
              <span className="text-xs font-medium leading-tight">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}