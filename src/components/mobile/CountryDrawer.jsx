import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Search } from 'lucide-react';

export default function CountryDrawer({ open, onOpenChange, countries, value, onSelect, title = "Select Country" }) {
  const [search, setSearch] = useState('');

  const filteredCountries = countries.filter((country) => {
    const name = typeof country === 'string' ? country : country.name;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="dark:bg-slate-900">
        <DrawerHeader>
          <DrawerTitle className="dark:text-white">{title}</DrawerTitle>
          <DrawerDescription className="dark:text-gray-400">Choose from the list below</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {countries.map((country) => {
              const isSelected = typeof country === 'string' 
                ? country === value 
                : country.name === value;
              const displayName = typeof country === 'string' 
                ? country 
                : `${country.flag} ${country.name}`;
              const itemValue = typeof country === 'string' ? country : country.name;
              
              return (
                <button
                  key={itemValue}
                  onClick={() => {
                    onSelect(itemValue);
                    onOpenChange(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300'
                  }`}
                  style={{ userSelect: 'none' }}
                >
                  <span className="font-medium">{displayName}</span>
                  {isSelected && <Check className="w-5 h-5" />}
                </button>
              );
            })}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300" style={{ userSelect: 'none' }}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}