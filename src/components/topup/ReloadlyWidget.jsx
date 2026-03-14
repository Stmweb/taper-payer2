import React, { useEffect } from 'react';

export default function ReloadlyWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.reloadly.com/widget/v2/reloadly-widget.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <reloadly-widget data-widget-id="iyKRR8o7DZYoQkMJgzBXRtqpKET7Ga4BNCMslPm6U"></reloadly-widget>
  );
}