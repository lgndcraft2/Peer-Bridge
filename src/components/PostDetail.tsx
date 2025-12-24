'use client';

import React, { useState } from 'react';
import { ArrowLeft, Send, MoreHorizontal, Heart, Flag, Sparkles, MessageSquare, Share, Repeat, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toggleLike } from '@/app/actions/like';
import { submitComment } from '@/app/actions/chat';
import { submitReport } from '@/app/actions/report';
import { useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  likes: number;
  created_at: string;
  tags: string[];
  views: number;
  user_has_liked?: boolean;
  author_name?: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  isAi: boolean;
  time: string;
}

interface PostDetailProps {
  post: Post;
  initialComments?: Comment[]; // We can fetch comments later or pass them
}

export default function PostDetail({ post, initialComments = [] }: PostDetailProps) {
  const [comments, setComments] = useState(initialComments);
  const [newMessage, setNewMessage] = useState('');
  // Optimistic UI for likes
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(post.user_has_liked);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleLike = async () => {
    // Optimistic update
    const newHasLiked = !hasLiked;
    setHasLiked(newHasLiked);
    setLikes(prev => newHasLiked ? prev + 1 : prev - 1);

    try {
      await toggleLike(post.id);
    } catch (error) {
      // Revert on error
      setHasLiked(!newHasLiked);
      setLikes(prev => !newHasLiked ? prev + 1 : prev - 1);
      console.error('Error toggling like:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage;
    const tempId = Date.now();
    const newComment = {
      id: tempId,
      author: "You", // Current user
      text: messageToSend,
      isAi: false,
      time: "Just now"
    };

    setComments([...comments, newComment]);
    setNewMessage('');

    try {
      await submitComment(post.id, messageToSend);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setComments(prev => prev.filter(c => c.id !== tempId));
      setNewMessage(messageToSend);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    setIsReporting(true);
    try {
      await submitReport(post.id, reportReason);
      setReportSuccess(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccess(false);
        setReportReason('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-secondary/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary-dark">Report Post</h2>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="p-2 hover:bg-secondary/20 rounded-full transition-colors text-text-muted hover:text-text-main"
              >
                <X size={20} />
              </button>
            </div>
            
            {reportSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Flag size={32} />
                </div>
                <h3 className="text-xl font-bold text-text-main">Report Submitted</h3>
                <p className="text-text-muted">Thank you for keeping our community safe. We will review this post shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleReport} className="p-6 space-y-4">
                <p className="text-text-muted text-sm">
                  Please tell us why you are reporting this post. If you are in immediate danger, please contact local emergency services.
                </p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for reporting..."
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none h-32"
                  required
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-text-muted hover:bg-secondary/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReporting || !reportReason.trim()}
                    className="px-6 py-2 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isReporting && <Loader2 size={16} className="animate-spin" />}
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MOBILE LAYOUT (Twitter-like) - Visible only on small screens */}
      <div className="md:hidden max-w-2xl mx-auto min-h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary/30 px-4 py-3 flex items-center gap-6">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-secondary/20 transition-colors">
            <ArrowLeft size={20} className="text-text-main" />
          </Link>
          <h1 className="text-lg font-bold text-text-main">Post</h1>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Main Post */}
          <div className="p-4 border-b border-secondary/30">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-bold">
                {post.author_name ? post.author_name[0] : '?'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-text-main">{post.author_name || 'Anonymous'}</span>
                <span className="text-sm text-text-muted">@{post.author_name || 'Anonymous'}</span>
              </div>
              <button className="ml-auto text-text-muted hover:text-primary p-2">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-text-main mb-2">{post.title}</h2>
              <p className="text-lg text-text-main leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags && post.tags.map(tag => (
                <span key={tag} className="text-primary hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Metadata */}
            <div className="py-4 border-y border-secondary/20 text-text-muted text-sm flex gap-4">
              <span suppressHydrationWarning>{formatTime(post.created_at)}</span>
              <span>•</span>
              <span className="text-text-main font-semibold">{post.views} <span className="font-normal text-text-muted">Views</span></span>
            </div>

            {/* Stats */}
            <div className="py-3 border-b border-secondary/20 flex justify-between px-4">
               <div className="flex gap-6">
                 <span className="font-bold text-text-main">{likes} <span className="font-normal text-text-muted">Likes</span></span>
                 <span className="font-bold text-text-main">0 <span className="font-normal text-text-muted">Reposts</span></span>
               </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between py-2 border-b border-secondary/20">
              <button className="flex-1 flex items-center justify-center p-2 text-text-muted hover:text-primary transition-colors">
                <MessageSquare size={20} />
              </button>
              <button className="flex-1 flex items-center justify-center p-2 text-text-muted hover:text-green-500 transition-colors">
                <Repeat size={20} />
              </button>
              <button 
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center p-2 transition-colors ${hasLiked ? 'text-accent' : 'text-text-muted hover:text-accent'}`}
              >
                <Heart size={20} fill={hasLiked ? "currentColor" : "none"} />
              </button>
              <button className="flex-1 flex items-center justify-center p-2 text-text-muted hover:text-primary transition-colors">
                <Share size={20} />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Replies</h3>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-secondary/50 text-primary-dark">
                    {comment.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text-main">{comment.author}</span>
                      <span className="text-xs text-text-muted">• {comment.time}</span>
                    </div>
                    <p className="text-text-main text-sm leading-relaxed">{comment.text}</p>
                    <div className="flex gap-4 mt-2">
                      <button className="text-text-muted hover:text-accent transition-colors">
                        <Heart size={14} />
                      </button>
                      <button className="text-text-muted hover:text-primary transition-colors">
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white border-t border-secondary/30 p-4 pb-8">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
            <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary-dark font-bold flex-shrink-0">
              Y
            </div>
            <div className="flex-1 bg-bg-soft rounded-2xl p-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Post your reply..."
                rows={1}
                className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none max-h-32 text-text-main placeholder:text-text-muted"
                style={{ minHeight: '24px' }}
              />
            </div>
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* DESKTOP LAYOUT - Placeholder or reuse similar structure */}
      <div className="hidden md:block max-w-4xl mx-auto p-8">
         <Link href="/dashboard" className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Feed</span>
         </Link>
         
         <div className="bg-white rounded-3xl shadow-sm border border-secondary/20 overflow-hidden">
            <div className="p-8 border-b border-secondary/20">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-bold text-xl">
                     {post.author_name ? post.author_name[0] : '?'}
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-text-main">{post.title}</h1>
                     <div className="flex items-center gap-2 text-text-muted">
                        <span className="font-medium text-primary-dark">@{post.author_name || 'Anonymous'}</span>
                        <span>•</span>
                        <span suppressHydrationWarning>{formatTime(post.created_at)}</span>
                     </div>
                  </div>
               </div>

               <p className="text-lg text-text-main leading-relaxed whitespace-pre-wrap mb-6">
                  {post.content}
               </p>

               <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags && post.tags.map(tag => (
                     <span key={tag} className="px-3 py-1 rounded-full bg-bg-soft text-primary font-medium text-sm">
                        #{tag}
                     </span>
                  ))}
               </div>

               <div className="flex items-center gap-6 pt-6 border-t border-secondary/20">
                  <button 
                     onClick={handleLike}
                     className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${hasLiked ? 'bg-accent/10 text-accent' : 'hover:bg-secondary/20 text-text-muted'}`}
                  >
                     <Heart size={20} fill={hasLiked ? "currentColor" : "none"} />
                     <span className="font-medium">{likes} Support</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-secondary/20 text-text-muted transition-colors">
                     <MessageSquare size={20} />
                     <span className="font-medium">{comments.length} Comments</span>
                  </button>
                  <button 
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-secondary/20 text-text-muted transition-colors ml-auto"
                  >
                     <Flag size={20} />
                     <span className="font-medium">Report</span>
                  </button>
               </div>
            </div>

            {/* Desktop Comments */}
            <div className="p-8 bg-bg-soft/30">
               <h3 className="font-bold text-xl mb-6">Discussion</h3>
               
               {/* Desktop Input */}
               <form onSubmit={handleSendMessage} className="flex gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary-dark font-bold flex-shrink-0">
                    Y
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl p-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-secondary/20 mb-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Post your reply..."
                        rows={2}
                        className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-text-main placeholder:text-text-muted"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
               </form>

               <div className="space-y-6">
                  {comments.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Be the first to join the conversation.</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-secondary/50 text-primary-dark">
                            {comment.author[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-text-main">{comment.author}</span>
                                <span className="text-xs text-text-muted">• {comment.time}</span>
                            </div>
                            <p className="text-text-main text-sm leading-relaxed">{comment.text}</p>
                            <div className="flex gap-4 mt-2">
                                <button className="text-text-muted hover:text-accent transition-colors flex items-center gap-1 text-xs font-medium">
                                  <Heart size={14} /> Like
                                </button>
                                <button className="text-text-muted hover:text-primary transition-colors flex items-center gap-1 text-xs font-medium">
                                  <MessageSquare size={14} /> Reply
                                </button>
                            </div>
                          </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
         </div>
      </div>
    </>
  );
}
