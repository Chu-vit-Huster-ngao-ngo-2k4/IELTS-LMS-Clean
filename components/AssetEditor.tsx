'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Save, Trash2, Upload, Link } from 'lucide-react';
import { Asset } from '@/lib/admin-types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


interface AssetEditorProps {
  asset: Asset | null;
  lessonId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
}

const ASSET_TYPES = [
  { value: 'video', label: 'Video', mimetypes: ['video/mp4', 'video/avi', 'video/mov'] },
  { value: 'audio', label: 'Audio', mimetypes: ['audio/mp3', 'audio/wav', 'audio/mpeg'] },
  { value: 'document', label: 'Document', mimetypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
  { value: 'image', label: 'Image', mimetypes: ['image/jpeg', 'image/png', 'image/gif'] }
];

export default function AssetEditor({ asset, lessonId, isOpen, onClose, onSave }: AssetEditorProps) {
  const [formData, setFormData] = useState<Asset>({
    id: 0,
    title: '',
    assettype: 'video',
    providerkey: '',
    mimetype: 'video/mp4',
    sizebytes: 0,
    lessonid: lessonId
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (asset) {
      setFormData(asset);
    } else {
      setFormData({
        id: 0,
        title: '',
        assettype: 'video',
        providerkey: '',
        mimetype: 'video/mp4',
        sizebytes: 0,
        lessonid: lessonId
      });
    }
    setError('');
  }, [asset, lessonId, isOpen]);

  const handleAssetTypeChange = (type: string) => {
    const assetType = ASSET_TYPES.find(t => t.value === type);
    setFormData({
      ...formData,
      assettype: type,
      mimetype: assetType?.mimetypes[0] || 'video/mp4'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (asset?.id) {
        // Update existing asset
        const { error } = await supabase
          .from('assets')
          .update({
            title: formData.title,
            assettype: formData.assettype,
            providerkey: formData.providerkey,
            mimetype: formData.mimetype,
            sizebytes: formData.sizebytes
          })
          .eq('id', asset.id);

        if (error) throw error;
      } else {
        // Create new asset
        const { data, error } = await supabase
          .from('assets')
          .insert({
            title: formData.title,
            assettype: formData.assettype,
            providerkey: formData.providerkey,
            mimetype: formData.mimetype,
            sizebytes: formData.sizebytes,
            lessonid: formData.lessonid
          })
          .select()
          .single();

        if (error) throw error;
        formData.id = data.id;
      }

      onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!asset?.id) return;
    
    if (!confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', asset.id);

      if (error) throw error;
      
      onClose();
      window.location.reload(); // Refresh to update the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateR2Path = () => {
    const courseName = 'foundation'; // This should be dynamic based on course
    const lessonNumber = lessonId.toString().padStart(2, '0');
    const extension = formData.mimetype.split('/')[1];
    
    let path = `courses/${courseName}/lesson-${lessonNumber}/lesson-${lessonNumber}-${formData.assettype}`;
    
    if (formData.assettype === 'video') {
      path += '.mp4';
    } else if (formData.assettype === 'audio') {
      path += '.mp3';
    } else if (formData.assettype === 'document') {
      if (formData.mimetype.includes('pdf')) {
        path += '.pdf';
      } else {
        path += '.docx';
      }
    } else if (formData.assettype === 'image') {
      path += '.jpg';
    }
    
    setFormData({ ...formData, providerkey: path });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {asset?.id ? 'Edit Asset' : 'Add New Asset'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Type
            </label>
            <select
              value={formData.assettype}
              onChange={(e) => handleAssetTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ASSET_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MIME Type
            </label>
            <select
              value={formData.mimetype}
              onChange={(e) => setFormData({ ...formData, mimetype: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ASSET_TYPES.find(t => t.value === formData.assettype)?.mimetypes.map((mime) => (
                <option key={mime} value={mime}>
                  {mime}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              R2 Path (Provider Key)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.providerkey}
                onChange={(e) => setFormData({ ...formData, providerkey: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="courses/foundation/lesson-01/lesson-01-video.mp4"
                required
              />
              <button
                type="button"
                onClick={generateR2Path}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                title="Generate R2 path"
              >
                <Link className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Size (bytes)
            </label>
            <input
              type="number"
              value={formData.sizebytes}
              onChange={(e) => setFormData({ ...formData, sizebytes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {(formData.sizebytes / 1024).toFixed(1)} KB
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {asset?.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
