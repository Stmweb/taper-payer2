import React, { useEffect } from 'react';

export default function CalSection() {
  useEffect(() => {
    // Inject Cal.com embed script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function (C, A, L) {
        let p = function (a, ar) { a.q.push(ar); };
        let d = C.document;
        C.Cal = C.Cal || function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");

      Cal("init", "30min", { origin: "https://app.cal.com" });

      Cal.ns["30min"]("inline", {
        elementOrSelector: "#my-cal-inline-30min",
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
        calLink: "taperpayer/30min",
      });

      Cal.ns["30min"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Launch Your Platform?
          </h2>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
            Book a 30-minute call with our team and see how fast you can go live.
          </p>
        </div>

        {/* Cal.com inline embed */}
        <div
          id="my-cal-inline-30min"
          style={{ width: '100%', height: '700px', overflow: 'scroll', borderRadius: '16px' }}
          className="shadow-lg bg-white"
        />
      </div>
    </section>
  );
}