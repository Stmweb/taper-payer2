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
    <div className="w-full min-h-screen">
      <reloadly-widget data-widget-id="iyKRR8o7DZYoQkMJgzBXRtqpKET7Ga4BNCMslPm6U"></reloadly-widget>
    </div>
  );
}