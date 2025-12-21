'use client';
import React, { useState } from 'react';
import { Plus, Heart, MessageSquare, Hash } from 'lucide-react';
import Link from 'next/link';
import CreatePostModal from '@/components/CreatePostModal';

// Mock Data
const MOCK_POSTS = [
  {
    id: '1',
    title: "Feeling a bit lost today",
    preview: "It's been a tough week at work and I feel like I'm not making any progress...",
    author: "WanderingStar_99",
    likes: 12,
    comments: 4,
    tags: ["Anxiety", "Work"],
    time: "2h ago"
  },
  {
    id: '2',
    title: "Small victory!",
    preview: "Finally managed to clean my room after putting it off for a month. Baby steps.",
    author: "Hopeful_Panda",
    likes: 45,
    comments: 8,
    tags: ["Success", "Depression"],
    time: "4h ago"
  },
  {
    id: '3',
    title: "Need advice on setting boundaries",
    preview: "My friend keeps asking for money and I don't know how to say no without ruining the friendship.",
    author: "QuietRiver",
    likes: 8,
    comments: 15,
    tags: ["Relationships", "Advice"],
    time: "6h ago"
  }
];

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {MOCK_POSTS.map((post) => (
          <Link 
            key={post.id} 
            href={`/dashboard/${post.id}`}
            className="bg-surface p-6 rounded-3xl border border-secondary/30 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-primary-dark">
                  {post.author[0]}
                </div>
                <span className="font-semibold text-sm text-text-muted">{post.author}</span>
                <span className="text-xs text-text-muted/60">• {post.time}</span>
              </div>
              <div className="flex gap-2">
                {post.tags.map(tag => (
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
              {post.preview}
            </p>

            <div className="flex items-center gap-6 text-text-muted text-sm">
              <div className="flex items-center gap-2">
                <Heart size={18} className="group-hover:text-accent transition-colors" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="group-hover:text-primary transition-colors" />
                <span>{post.comments} comments</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-emerald-500/30 flex items-center gap-3 transition-all hover:scale-105"
        >
          <Plus size={28} />
          <span className="text-lg">New Post</span>
        </button>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
