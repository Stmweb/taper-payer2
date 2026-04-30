import React from 'react';

export default function TaperPayerLogo({ className = "", height = "h-24 md:h-28" }) {
  return (
    <img 
      src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/1bfa6df02_TaperPayerVeryGood.png"
      alt="Taper Payer"
      className={`${height} w-auto ${className}`}
    />
  );
}