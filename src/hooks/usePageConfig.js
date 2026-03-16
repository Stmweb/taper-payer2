import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function usePageConfig(pageName) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const result = await base44.entities.PageConfig.filter({ page_name: pageName, is_active: true });
        if (result.length > 0) {
          setConfig(result[0]);
        }
      } catch (e) {
        console.error('Failed to load page config:', e);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [pageName]);

  const isElementHidden = (elementId) => {
    return config?.hidden_elements?.includes(elementId) || false;
  };

  const isSectionHidden = (sectionId) => {
    return config?.hidden_sections?.includes(sectionId) || false;
  };

  const getContentOverride = (blockId) => {
    return config?.content_overrides?.[blockId] || null;
  };

  const backgroundStyle = config?.background_image ? {
    backgroundImage: `url(${config.background_image})`,
    backgroundPosition: config.background_position || 'center',
    backgroundSize: config.background_size || 'cover',
    backgroundAttachment: 'fixed',
  } : null;

  return {
    config,
    loading,
    isElementHidden,
    isSectionHidden,
    getContentOverride,
    backgroundStyle,
  };
}