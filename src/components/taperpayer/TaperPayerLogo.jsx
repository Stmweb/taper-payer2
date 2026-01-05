import React from 'react';

export default function TaperPayerLogo({ className = "", height = "h-8" }) {
  return (
    <img 
      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/899b5ea8a_ChatGPTImageJan5202603_27_37PM.png"
      alt="Taper Payer"
      className={`${height} w-auto ${className}`}
    />
  );
}