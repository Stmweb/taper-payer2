import React, { useEffect, useRef } from 'react';

export default function TpayReloadForm() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load Reloadly widget script
    const loadReloadlyScript = () => {
      if (window.ReloadlyWidget) {
        // Script already loaded, initialize
        if (window.ReloadlyWidget.initialize) {
          window.ReloadlyWidget.initialize();
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.reloadly.com/widget/v2/reloadly-widget.js';
      script.async = true;
      script.onload = () => {
        // Widget script loaded, initialize if method exists
        if (window.ReloadlyWidget && window.ReloadlyWidget.initialize) {
          window.ReloadlyWidget.initialize();
        }
      };
      document.body.appendChild(script);
    };

    loadReloadlyScript();
  }, []);

  return (
    <div ref={containerRef}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-400 to-teal-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">R</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Tpay Reload</h3>
      </div>
      <reloadly-widget data-widget-id="iyKRR8o7DZYoQkMJgzBXRtqpKET7Ga4BNCMslPm6U"></reloadly-widget>
    </div>
  );
}