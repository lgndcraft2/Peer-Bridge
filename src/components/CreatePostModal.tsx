'use client';

import React, { useState } from 'react';
import { X, Hash, Loader2 } from 'lucide-react';
import { createPost } from '@/app/actions/post';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createPost(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      // Ideally show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-secondary/20 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-dark">Create New Post</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary/20 rounded-full transition-colors text-text-muted hover:text-text-main"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-text-main ml-1">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              placeholder="Give your post a title..."
              className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-bold text-text-main ml-1">Content</label>
            <textarea
              name="content"
              id="content"
              required
              rows={5}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-bold text-text-main ml-1 flex items-center gap-1">
              <Hash size={14} /> Tags
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              placeholder="anxiety, work, advice (comma separated)"
              className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-text-muted hover:bg-secondary/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
