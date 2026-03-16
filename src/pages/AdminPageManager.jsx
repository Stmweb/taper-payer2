import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, Trash2, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

const PAGES = [
  'TaperPayerHome',
  'TaperPayerTopUp',
  'TaperPayerRates',
  'TaperPayerHowItWorks',
  'TaperPayerAbout',
];

const PREDEFINED_ELEMENTS = {
  'TaperPayerHome': [
    { id: 'download-app-btn', label: 'Download App Button' },
    { id: 'tpay-mobile-btn', label: 'Tpay Mobile Button' },
    { id: 'why-choose-section', label: 'Why Choose Us Section' },
    { id: 'services-section', label: 'Our Services Section' },
    { id: 'membership-section', label: 'Membership Section' },
    { id: 'app-download-section', label: 'Get the App Section' },
  ],
  'TaperPayerTopUp': [
    { id: 'top-up-now-btn', label: 'Top Up Now Button' },
    { id: 'tpay-mobile-btn-hero', label: 'Tpay Mobile Button (Hero)' },
    { id: 'how-it-works-section', label: 'How It Works Section' },
    { id: 'why-choose-section', label: 'Why Choose Section' },
    { id: 'testimonial-section', label: 'Testimonial Section' },
    { id: 'get-started-cta', label: 'Get Started CTA Section' },
  ],
  'TaperPayerRates': [
    { id: 'exchange-rate-cards', label: 'Exchange Rate Cards' },
    { id: 'refresh-rates-btn', label: 'Refresh Rates Button' },
  ],
  'TaperPayerHowItWorks': [
    { id: 'step-guides', label: 'Step Guides Section' },
    { id: 'features-section', label: 'Features Section' },
    { id: 'methods-section', label: 'Delivery Methods Section' },
  ],
  'TaperPayerAbout': [
    { id: 'about-hero', label: 'Hero Section' },
    { id: 'values-section', label: 'Values Section' },
    { id: 'services-section', label: 'Services Section' },
    { id: 'timeline-section', label: 'Timeline Section' },
  ],
};

const BACKGROUND_POSITIONS = [
  'top', 'center', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
];

const BACKGROUND_SIZES = ['cover', 'contain', 'auto'];

export default function AdminPageManager() {
  const [selectedPage, setSelectedPage] = useState(PAGES[0]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hiddenElements, setHiddenElements] = useState([]);
  const [hiddenSections, setHiddenSections] = useState([]);
  const [contentOverrides, setContentOverrides] = useState({});
  const [newElement, setNewElement] = useState('');
  const [newSection, setNewSection] = useState('');
  const [contentBlockId, setContentBlockId] = useState('');
  const [contentBlockData, setContentBlockData] = useState({ title: '', body: '', imageUrl: '', html: '' });
  const [buttonOverrides, setButtonOverrides] = useState({});
  const [editingButtonId, setEditingButtonId] = useState('');
  const [editingButtonData, setEditingButtonData] = useState({ label: '', color: '#3D7BB7' });

  // Load config for selected page
  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        const result = await base44.entities.PageConfig.filter({ page_name: selectedPage });
        if (result.length > 0) {
          setConfig(result[0]);
          setHiddenElements(result[0].hidden_elements || []);
          setHiddenSections(result[0].hidden_sections || []);
          setContentOverrides(result[0].content_overrides || {});
        } else {
          setConfig(null);
          setHiddenElements([]);
          setHiddenSections([]);
          setContentOverrides({});
        }
      } catch (e) {
        toast.error('Failed to load config');
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [selectedPage]);

  const saveConfig = async () => {
    setSaving(true);
    try {
      const data = {
        page_name: selectedPage,
        background_image: config?.background_image || '',
        background_position: config?.background_position || 'center',
        background_size: config?.background_size || 'cover',
        hidden_elements: hiddenElements,
        hidden_sections: hiddenSections,
        content_overrides: contentOverrides,
        is_active: config?.is_active ?? true,
      };

      if (config?.id) {
        await base44.entities.PageConfig.update(config.id, data);
        toast.success('Configuration updated');
      } else {
        await base44.entities.PageConfig.create(data);
        toast.success('Configuration created');
      }
    } catch (e) {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleAddElement = () => {
    if (newElement.trim() && !hiddenElements.includes(newElement)) {
      setHiddenElements([...hiddenElements, newElement]);
      setNewElement('');
    }
  };

  const handleRemoveElement = (elem) => {
    setHiddenElements(hiddenElements.filter(e => e !== elem));
  };

  const handleAddSection = () => {
    if (newSection.trim() && !hiddenSections.includes(newSection)) {
      setHiddenSections([...hiddenSections, newSection]);
      setNewSection('');
    }
  };

  const handleRemoveSection = (sec) => {
    setHiddenSections(hiddenSections.filter(s => s !== sec));
  };

  const handleAddContentBlock = () => {
    if (contentBlockId.trim() && (contentBlockData.title || contentBlockData.body || contentBlockData.html)) {
      setContentOverrides({
        ...contentOverrides,
        [contentBlockId]: contentBlockData,
      });
      setContentBlockId('');
      setContentBlockData({ title: '', body: '', imageUrl: '', html: '' });
    }
  };

  const handleRemoveContentBlock = (blockId) => {
    const newOverrides = { ...contentOverrides };
    delete newOverrides[blockId];
    setContentOverrides(newOverrides);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Page Manager</h1>

        {/* Page Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Page</h2>
          <div className="grid grid-cols-2 gap-3">
            {PAGES.map((page) => (
              <button
                key={page}
                onClick={() => setSelectedPage(page)}
                className={`p-3 rounded-lg border-2 transition-all text-left font-medium ${
                  selectedPage === page
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Background Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Background Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Background Image URL</label>
                <Input
                  placeholder="https://..."
                  value={config?.background_image || ''}
                  onChange={(e) => setConfig({ ...config, background_image: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                <select
                  value={config?.background_position || 'center'}
                  onChange={(e) => setConfig({ ...config, background_position: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                >
                  {BACKGROUND_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                <select
                  value={config?.background_size || 'cover'}
                  onChange={(e) => setConfig({ ...config, background_size: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                >
                  {BACKGROUND_SIZES.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {config?.background_image && (
                <div className="mt-4 p-3 bg-slate-100 rounded-lg h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${config.background_image})`,
                    backgroundPosition: config.background_position,
                    backgroundSize: config.background_size,
                  }}
                />
              )}
            </div>
          </div>

          {/* Hidden Elements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Hide Buttons & Components</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Quick Select</label>
                <div className="grid grid-cols-2 gap-2">
                  {(PREDEFINED_ELEMENTS[selectedPage] || []).map((elem) => (
                    <button
                      key={elem.id}
                      onClick={() => {
                        if (!hiddenElements.includes(elem.id)) {
                          setHiddenElements([...hiddenElements, elem.id]);
                        }
                      }}
                      disabled={hiddenElements.includes(elem.id)}
                      className={`text-xs p-2 rounded-lg border transition-all text-left ${
                        hiddenElements.includes(elem.id)
                          ? 'border-red-300 bg-red-50 text-red-700 cursor-not-allowed'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {elem.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <label className="block text-xs font-medium text-slate-600 mb-2">Custom ID</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Custom element ID"
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value)}
                    className="text-xs"
                  />
                  <Button onClick={handleAddElement} size="icon" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {hiddenElements.map((elem) => (
                  <div key={elem} className="flex items-center justify-between bg-red-50 p-2 rounded-lg border border-red-200">
                    <span className="text-xs text-slate-700 font-mono truncate">{elem}</span>
                    <button onClick={() => handleRemoveElement(elem)} className="text-red-600 hover:text-red-700 flex-shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Sections */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Hide Sections</h2>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Custom section ID"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              />
              <Button onClick={handleAddSection} size="icon" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {hiddenSections.length > 0 && (
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {hiddenSections.map((sec) => (
                  <div key={sec} className="flex items-center justify-between bg-red-50 p-2 rounded-lg border border-red-200">
                    <span className="text-xs text-slate-700 font-mono truncate">{sec}</span>
                    <button onClick={() => handleRemoveSection(sec)} className="text-red-600 hover:text-red-700 flex-shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Overrides */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Content Blocks</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Block ID</label>
              <Input
                placeholder="e.g., hero-title, features-section"
                value={contentBlockId}
                onChange={(e) => setContentBlockId(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <Input
                  placeholder="Title text"
                  value={contentBlockData.title}
                  onChange={(e) => setContentBlockData({ ...contentBlockData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <Input
                  placeholder="https://..."
                  value={contentBlockData.imageUrl}
                  onChange={(e) => setContentBlockData({ ...contentBlockData, imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Body Text</label>
              <textarea
                placeholder="Content text"
                value={contentBlockData.body}
                onChange={(e) => setContentBlockData({ ...contentBlockData, body: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Custom HTML</label>
              <textarea
                placeholder="<div>...</div>"
                value={contentBlockData.html}
                onChange={(e) => setContentBlockData({ ...contentBlockData, html: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm h-24 font-mono text-xs"
              />
            </div>

            <Button onClick={handleAddContentBlock} className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Add Content Block
            </Button>

            {/* Display Added Content Blocks */}
            <div className="space-y-2 mt-4">
              {Object.entries(contentOverrides).map(([blockId, data]) => (
                <div key={blockId} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs text-slate-600">{blockId}</p>
                      {data.title && <p className="font-semibold text-slate-800 mt-1">{data.title}</p>}
                      {data.body && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{data.body}</p>}
                    </div>
                    <button onClick={() => handleRemoveContentBlock(blockId)} className="text-red-600 hover:text-red-700 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 mt-8">
          <Button
            onClick={saveConfig}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Configuration</>}
          </Button>
        </div>
      </div>
    </div>
  );
}