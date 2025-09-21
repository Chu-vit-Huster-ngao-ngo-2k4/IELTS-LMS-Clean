'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, Save, Trash2 } from 'lucide-react';
import { Lesson } from '@/lib/admin-types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


interface LessonEditorProps {
  lesson: Lesson | null;
  courseId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Lesson) => void;
}

export default function LessonEditor({ lesson, courseId, isOpen, onClose, onSave }: LessonEditorProps) {
  const [formData, setFormData] = useState<Lesson>({
    id: 0,
    title: '',
    courseid: courseId,
    orderindex: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lesson) {
      setFormData(lesson);
    } else {
      setFormData({
        id: 0,
        title: '',
        courseid: courseId,
        orderindex: 1
      });
    }
    setError('');
  }, [lesson, courseId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (lesson?.id) {
        // Update existing lesson
        const { error } = await supabase
          .from('lessons')
          .update({
            title: formData.title,
            orderindex: formData.orderindex
          })
          .eq('id', lesson.id);

        if (error) throw error;
      } else {
        // Create new lesson
        const { data, error } = await supabase
          .from('lessons')
          .insert({
            title: formData.title,
            courseid: formData.courseid,
            orderindex: formData.orderindex
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
    if (!lesson?.id) return;
    
    if (!confirm('Are you sure you want to delete this lesson? This will also delete all associated assets.')) {
      return;
    }

    setLoading(true);
    try {
      // First delete all assets
      const { error: assetsError } = await supabase
        .from('assets')
        .delete()
        .eq('lessonid', lesson.id);

      if (assetsError) throw assetsError;

      // Then delete the lesson
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lesson.id);

      if (error) throw error;
      
      onClose();
      window.location.reload(); // Refresh to update the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {lesson?.id ? 'Edit Lesson' : 'Add New Lesson'}
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
              Lesson Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Index
            </label>
            <input
              type="number"
              value={formData.orderindex}
              onChange={(e) => setFormData({ ...formData, orderindex: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              {lesson?.id && (
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
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
