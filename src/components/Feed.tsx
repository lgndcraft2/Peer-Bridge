'use client';

import React, { useState } from 'react';
import { Plus, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import CreatePostModal from '@/components/CreatePostModal';
import { toggleLike } from '@/app/actions/like';

interface Post {
  id: string;
  title: string;
  content: string; // 'preview' in mock was likely derived from content
  user_id: string;
  likes: number;
  created_at: string;
  tags: string[];
  views: number;
  comments_count?: number;
  user_has_liked?: boolean; // We will need to fetch this
  author_name?: string; // We might need to join with profiles or auth metadata
}

interface FeedProps {
  initialPosts: Post[];
  currentUserId?: string;
}

export default function Feed({ initialPosts, currentUserId }: FeedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // We can use optimistic updates here if we want, but for now let's rely on revalidation
  
  // Helper to format time (simple version)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="space-y-8 pb-24 relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Community Feed</h1>
          <p className="text-text-muted">Share your story or support others.</p>
        </div>
      </div>

      {/* Feed */}
      <div className="grid gap-4">
        {initialPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/dashboard/${post.id}`}
            className="bg-surface p-6 rounded-3xl border border-secondary/30 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-primary-dark">
                  {/* Placeholder for author avatar/initial */}
                  {post.author_name ? post.author_name[0] : '?'}
                </div>
                <span className="font-semibold text-sm text-text-muted">{post.author_name || 'Anonymous'}</span>
                <span className="text-xs text-text-muted/60" suppressHydrationWarning>• {formatTime(post.created_at)}</span>
              </div>
              <div className="flex gap-2">
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded-lg bg-bg-soft text-xs font-medium text-primary-dark">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-text-muted mb-4 line-clamp-2">
              {post.content}
            </p>

            <div className="flex items-center gap-6 text-text-muted text-sm">
              <button 
                onClick={(e) => handleLike(e, post.id)}
                className={`flex items-center gap-2 transition-colors ${post.user_has_liked ? 'text-accent' : 'group-hover:text-accent'}`}
              >
                <Heart size={18} fill={post.user_has_liked ? "currentColor" : "none"} />
                <span>{post.likes}</span>
              </button>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="group-hover:text-primary transition-colors" />
                <span>{post.comments_count || 0} comments</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-110 active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
