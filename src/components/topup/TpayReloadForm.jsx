import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';

export default function TpayReloadForm() {
  useEffect(() => {
    // Load Reloadly widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.reloadly.com/widget/v2/reloadly-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-teal-400 to-teal-500 w-10 h-10 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Tpay Reload</h3>
        </div>
      </div>

      <reloadly-widget data-widget-id="iyKRR8o7DZYoQkMJgzBXRtqpKET7Ga4BNCMslPm6U"></reloadly-widget>
    </div>
  );
}