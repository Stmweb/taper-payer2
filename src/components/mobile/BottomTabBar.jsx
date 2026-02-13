import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, DollarSign, HelpCircle, Info } from 'lucide-react';

export default function BottomTabBar() {
  const location = useLocation();
  
  const tabs = [
    { name: 'Home', icon: Home, path: createPageUrl('TaperPayerHome') },
    { name: 'Rates', icon: DollarSign, path: createPageUrl('TaperPayerRates') },
    { name: 'How It Works', icon: HelpCircle, path: createPageUrl('TaperPayerHowItWorks') },
    { name: 'About', icon: Info, path: createPageUrl('TaperPayerAbout') }
  ];

  const isActive = (path) => location.pathname === path || location.pathname === path + '.html';

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 z-50"
      style={{
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
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                active 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              style={{ userSelect: 'none' }}
            >
              <Icon className={`w-6 h-6 mb-1 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}