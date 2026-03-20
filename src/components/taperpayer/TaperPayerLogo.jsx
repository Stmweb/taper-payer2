import React from 'react';

export default function TaperPayerLogo({ className = "", height = "h-16 md:h-20" }) {
  return (
    <img 
      src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png"
      alt="Taper Payer"
      className={`${height} w-auto ${className}`}
    />
  );
}