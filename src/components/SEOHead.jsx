import { useEffect } from 'react';

export default function SEOHead(config = {}) {
  const defaults = {
    title: 'Taper Payer - Global Money Transfer & Mobile Top-Up Services',
    description: 'Fast, secure international money transfer and mobile recharge services. Send money globally, top up mobile phones instantly, and access remittance solutions in 150+ countries.',
    keywords: 'money transfer, remittance, mobile top-up, international payments, airtime recharge, funds transfer, send money online, global payments',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png',
    url: 'https://taperpayer.com/',
    ...config,
  };

  useEffect(() => {
    document.title = defaults.title;

    const updateMeta = (name, content, property = false) => {
      let element = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(property ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', defaults.description);
    updateMeta('keywords', defaults.keywords);
    updateMeta('og:title', defaults.title, true);
    updateMeta('og:description', defaults.description, true);
    updateMeta('og:image', defaults.image, true);
    updateMeta('og:url', defaults.url, true);
    updateMeta('twitter:title', defaults.title, true);
    updateMeta('twitter:description', defaults.description, true);
    updateMeta('twitter:image', defaults.image, true);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = defaults.url;
  }, [defaults]);

  return null;
}

export function useSEO(config) {
  SEOHead(config);
}