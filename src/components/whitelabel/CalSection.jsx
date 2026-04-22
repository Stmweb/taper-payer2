import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export default function CalSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to Launch Your Platform?
        </h2>
        <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Book a 30-minute call with our team and see how fast you can go live.
        </p>
        <Button
          size="lg"
          className="px-8 py-6 text-lg"
          style={{ backgroundColor: '#2479C2' }}
          onClick={() => window.open('https://cal.com/taperpayer/30min', '_blank')}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Book a 30-Min Call
        </Button>
      </div>
    </section>
  );
}