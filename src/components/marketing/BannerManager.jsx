import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Loader2, Trash2, Edit2, Plus, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageEditor from './ImageEditor';

const BANNER_SIZES = [
  { id: 'mobile', label: 'Mobile (540 × 960)', ratio: '9:16' },
  { id: 'tablet', label: 'Tablet (864 × 1080)', ratio: '4:5' },
  { id: 'desktop', label: 'Desktop (1600 × 900)', ratio: '16:9' },
  { id: 'wide', label: 'Billboard (1500 × 500)', ratio: '3:1' },
];

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    cta_text: '',
    cta_link: '',
    target_size: 'desktop',
    image_url: '',
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [editingImage, setEditingImage] = useState(null); // raw uploaded URL pending editor

  // Load banners
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const result = await base44.entities.PromotionalBanner.list();
        setBanners(result.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
      } catch (e) {
        setError('Failed to load banners');
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      // Open editor with the raw uploaded URL
      setEditingImage(response.file_url);
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEditorSave = async (blob) => {
    setUploading(true);
    try {
      const file = new File([blob], 'banner.jpg', { type: 'image/jpeg' });
      const response = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: response.file_url }));
      setEditingImage(null);
    } catch (err) {
      setError('Failed to save adjusted image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      setError('Title and image are required');
      return;
    }

    setLoading(true);
    try {
      if (editing) {
        await base44.entities.PromotionalBanner.update(editing.id, formData);
        setBanners(banners.map(b => b.id === editing.id ? { ...b, ...formData } : b));
      } else {
        const newBanner = await base44.entities.PromotionalBanner.create({
          ...formData,
          display_order: banners.length,
          is_active: true,
        });
        setBanners([...banners, newBanner]);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ title: '', cta_text: '', cta_link: '', target_size: 'desktop', image_url: '' });
      setError(null);
    } catch (err) {
      setError('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await base44.entities.PromotionalBanner.delete(id);
      setBanners(banners.filter(b => b.id !== id));
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  const handleEdit = (banner) => {
    setEditing(banner);
    setFormData({
      title: banner.title,
      cta_text: banner.cta_text || '',
      cta_link: banner.cta_link || '',
      target_size: banner.target_size || 'desktop',
      image_url: banner.image_url,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ title: '', cta_text: '', cta_link: '', target_size: 'desktop', image_url: '' });
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Promotional Banners</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage banners for the Top-Up page</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            Create Banner
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            {editing ? 'Edit Banner' : 'Create New Banner'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Banner Title
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Summer Promotion"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Target Size
                </label>
                <select
                  value={formData.target_size}
                  onChange={e => setFormData(prev => ({ ...prev, target_size: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {BANNER_SIZES.map(size => (
                    <option key={size.id} value={size.id}>{size.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  CTA Text
                </label>
                <Input
                  type="text"
                  value={formData.cta_text}
                  onChange={e => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                  placeholder="e.g. Top Up Now"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  CTA Link
                </label>
                <Input
                  type="url"
                  value={formData.cta_link}
                  onChange={e => setFormData(prev => ({ ...prev, cta_link: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Banner Image
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-700 dark:text-slate-300 font-medium">Click to upload or drag & drop</p>
                      <p className="text-slate-500 text-sm">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>

                {formData.image_url && !editingImage && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 h-48 group">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingImage(formData.image_url)}
                      className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium"
                    >
                      <SlidersHorizontal className="w-4 h-4" /> Adjust Image
                    </button>
                  </div>
                )}

                {/* Inline Image Editor */}
                {editingImage && (
                  <div className="border border-blue-300 dark:border-blue-600 rounded-xl p-4 bg-white dark:bg-slate-900">
                    <ImageEditor
                      imageUrl={editingImage}
                      onSave={handleEditorSave}
                      onCancel={() => {
                        // If there's already a saved image_url, just close editor; else clear
                        if (formData.image_url) {
                          setEditingImage(null);
                        } else {
                          setEditingImage(null);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2 bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editing ? 'Update Banner' : 'Create Banner'}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Banners Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">All Banners ({banners.length})</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : banners.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-500">No banners yet. Create one to get started!</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {banners.map((banner) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">{banner.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {BANNER_SIZES.find(s => s.id === banner.target_size)?.label || banner.target_size}
                    </Badge>
                    {banner.is_active && (
                      <Badge className="text-xs bg-green-100 text-green-800">Active</Badge>
                    )}
                  </div>
                  {banner.cta_text && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">CTA: {banner.cta_text}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}