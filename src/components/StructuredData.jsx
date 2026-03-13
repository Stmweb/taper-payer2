import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    // Add Organization structured data
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Taper Payer",
      "url": "https://taperpayer.com",
      "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/ab6777bfd_ChatGPTImageJan11202608_58_36PM.png",
      "description": "Fast, secure international money transfer and mobile top-up services",
      "sameAs": [
        "https://facebook.com/taperpayer",
        "https://twitter.com/taperpayer",
        "https://linkedin.com/company/taperpayer"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "telephone": "1-800-827-3772",
        "email": "Support@taperpayer.com"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "254 Chapman Rd, Ste 208 #26415",
        "addressLocality": "Newark",
        "addressRegion": "Delaware",
        "postalCode": "19702",
        "addressCountry": "US"
      }
    };

    // Add Service structured data
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "International Money Transfer",
      "provider": {
        "@type": "Organization",
        "name": "Taper Payer"
      },
      "areaServed": "Worldwide",
      "availableLanguage": "en"
    };

    const addSchema = (schema) => {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    };

    addSchema(orgSchema);

    return () => {
      // Cleanup handled by browser
    };
  }, []);

  return null;
}