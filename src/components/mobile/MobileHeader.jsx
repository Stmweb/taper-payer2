import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MobileHeader({ title, showBack = false }) {
  const navigate = useNavigate();

  return (
    <header 
      className="md:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="flex items-center h-14 px-4">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2 dark:text-gray-300"
            style={{ userSelect: 'none' }}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <h1 className="text-lg font-semibold dark:text-white">{title}</h1>
      </div>
    </header>
  );
}