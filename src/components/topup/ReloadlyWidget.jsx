import React, { useEffect } from 'react';

export default function ReloadlyWidget() {
  useEffect(() => {
    // Load Reloadly widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.reloadly.com/reloadly.min.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.Reloadly) {
        window.Reloadly.init({
          clientId: 'YOUR_CLIENT_ID',
          containerId: 'reloadly-widget'
        });
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div id="reloadly-widget" className="reloadly-widget-container"></div>
    </div>
  );
}