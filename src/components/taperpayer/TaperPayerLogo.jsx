import React from 'react';
import { Zap } from 'lucide-react';

export default function TaperPayerLogo({ className = "", iconSize = "w-8 h-8", textSize = "text-2xl" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2">
          <Zap className={`${iconSize} text-white fill-white`} />
        </div>
      </div>
      <span className={`${textSize} font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
        Taper Payer
      </span>
    </div>
  );
}