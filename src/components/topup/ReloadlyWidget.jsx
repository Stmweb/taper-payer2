import React, { useEffect } from 'react';

export default function ReloadlyWidget() {
  useEffect(() => {
    // Remove any existing script to prevent duplicates
    const existingScript = document.querySelector('script[src="https://cdn.reloadly.com/widget/v2/reloadly-widget.js"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.reloadly.com/widget/v2/reloadly-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <style>{`
      .topup-widget-container {
        max-width: 420px;
        margin: 40px auto;
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        background: #ffffff;
      }
      @media (max-width: 768px) {
        .topup-widget-container {
          max-width: 95%;
          margin: 20px auto;
          padding: 10px;
        }
      }
    `}</style>
    + <div className="topup-widget-container">
      <reloadly-widget data-widget-id="iyKRR8o7DZYoQkMJgzBXRtqpKET7Ga4BNCMslPm6U"></reloadly-widget>
    </div>
  );
}