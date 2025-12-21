'use client';
import React, { useState, use } from 'react';
import { ArrowLeft, Send, MoreHorizontal, Heart, Flag, Sparkles, MessageSquare, Share, Repeat } from 'lucide-react';
import Link from 'next/link';

// Mock Data (In a real app, fetch based on ID)
const POST_DETAILS = {
  id: '1',
  title: "Feeling a bit lost today",
  content: "It's been a tough week at work and I feel like I'm not making any progress. Everyone else seems to have it together, but I'm just struggling to keep up. Does anyone else feel like they're just pretending to be an adult?",
  author: "WanderingStar_99",
  time: "2h ago",
  tags: ["Anxiety", "Work"],
  likes: 12,
  reposts: 3,
  views: "1.2k"
};

const INITIAL_COMMENTS = [
  { id: 1, author: "Peer_Bridge_AI", text: "Thank you for sharing your vulnerability. Remember, comparison is the thief of joy. You are on your own unique path.", isAi: true, time: "1h ago" },
  { id: 2, author: "KindSoul_24", text: "I totally get that. I felt the same way last week. Imposter syndrome is real!", isAi: false, time: "55m ago" },
  { id: 3, author: "SunnySide", text: "You're definitely not alone. Take it one day at a time.", isAi: false, time: "30m ago" },
];

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: "You", // Current user
      text: newMessage,
      isAi: false,
      time: "Just now"
    };

    setComments([...comments, newComment]);
    setNewMessage('');
  };

  return (
    <>
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
                {POST_DETAILS.author[0]}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-text-main">{POST_DETAILS.author}</span>
                <span className="text-sm text-text-muted">@{POST_DETAILS.author}</span>
              </div>
              <button className="ml-auto text-text-muted hover:text-primary p-2">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-text-main mb-2">{POST_DETAILS.title}</h2>
              <p className="text-lg text-text-main leading-relaxed whitespace-pre-wrap">
                {POST_DETAILS.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {POST_DETAILS.tags.map(tag => (
                <span key={tag} className="text-primary hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Metadata */}
            <div className="py-4 border-y border-secondary/20 text-text-muted text-sm flex gap-4">
              <span>{POST_DETAILS.time}</span>
              <span>•</span>
              <span className="text-text-main font-semibold">{POST_DETAILS.views} <span className="font-normal text-text-muted">Views</span></span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between py-3 mt-1">
              <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-primary/10">
                  <MessageSquare size={20} />
                </div>
                <span className="text-sm">{comments.length}</span>
              </button>
              <button className="flex items-center gap-2 text-text-muted hover:text-green-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-green-50">
                  <Repeat size={20} />
                </div>
                <span className="text-sm">{POST_DETAILS.reposts}</span>
              </button>
              <button className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-accent/10">
                  <Heart size={20} />
                </div>
                <span className="text-sm">{POST_DETAILS.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-primary/10">
                  <Share size={20} />
                </div>
              </button>
            </div>
          </div>

          {/* Comments Feed */}
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 border-b border-secondary/20 hover:bg-bg-soft/50 transition-colors">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 
                    ${comment.isAi ? 'bg-accent/10 text-accent' : 'bg-secondary/30 text-text-muted'}`}>
                    {comment.isAi ? <Sparkles size={16} /> : comment.author[0]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text-main truncate">{comment.author}</span>
                      {comment.isAi && <span className="bg-accent/10 text-accent text-[10px] px-1.5 py-0.5 rounded font-bold">AI</span>}
                      <span className="text-text-muted text-sm">· {comment.time}</span>
                    </div>
                    
                    <p className="text-text-main leading-relaxed whitespace-pre-wrap">
                      {comment.text}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center justify-between mt-3 max-w-[80%]">
                      <button className="text-text-muted hover:text-primary p-1.5 -ml-2 rounded-full hover:bg-primary/10 transition-colors">
                        <MessageSquare size={16} />
                      </button>
                      <button className="text-text-muted hover:text-green-500 p-1.5 rounded-full hover:bg-green-50 transition-colors">
                        <Repeat size={16} />
                      </button>
                      <button className="text-text-muted hover:text-accent p-1.5 rounded-full hover:bg-accent/10 transition-colors">
                        <Heart size={16} />
                      </button>
                      <button className="text-text-muted hover:text-primary p-1.5 rounded-full hover:bg-primary/10 transition-colors">
                        <Share size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary/30 p-3">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-bold text-xs">
              Y
            </div>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Post your reply"
              className="flex-1 bg-bg-soft border-none outline-none text-text-main placeholder:text-text-muted text-lg py-2"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-1.5 rounded-full font-bold text-sm transition-colors"
            >
              Reply
            </button>
          </form>
        </div>
      </div>

      {/* DESKTOP LAYOUT (Split View) - Visible only on medium+ screens */}
      <div className="hidden md:flex max-w-6xl mx-auto h-[calc(100vh-6rem)] flex-col">
        {/* Header / Back */}
        <div className="mb-4 flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-medium">
            <ArrowLeft size={20} />
            <span>Back to Feed</span>
          </Link>
          <button className="text-text-muted hover:text-primary">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Left Side: Original Post */}
          <div className="w-1/3 flex-shrink-0 overflow-y-auto">
            <div className="bg-surface rounded-[2rem] shadow-xl shadow-primary/5 border border-secondary/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-bold text-lg">
                  {POST_DETAILS.author[0]}
                </div>
                <div>
                  <div className="font-bold text-primary-dark text-lg">{POST_DETAILS.author}</div>
                  <div className="text-sm text-text-muted">{POST_DETAILS.time}</div>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-primary-dark mb-4">{POST_DETAILS.title}</h1>
              <p className="text-text-main leading-relaxed mb-6 text-lg">
                {POST_DETAILS.content}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {POST_DETAILS.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-bg-soft text-sm font-medium text-primary-dark border border-secondary/30">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-secondary/30">
                <button className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors px-4 py-2 rounded-full hover:bg-accent/10">
                  <Heart size={20} />
                  <span className="font-medium">{POST_DETAILS.likes} Support</span>
                </button>
                <button className="flex items-center gap-2 text-text-muted hover:text-red-500 transition-colors px-4 py-2 rounded-full hover:bg-red-50 ml-auto">
                  <Flag size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Chat Room */}
          <div className="flex-1 flex flex-col bg-surface rounded-[2rem] shadow-xl shadow-primary/5 border border-secondary/30 overflow-hidden">
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/50">
              {comments.map((comment) => (
                <div key={comment.id} className={`flex gap-4 ${comment.author === 'You' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm
                    ${comment.isAi ? 'bg-gradient-to-br from-accent/20 to-accent/10 text-accent border border-accent/20' : 
                      comment.author === 'You' ? 'bg-primary text-white' : 'bg-white border border-secondary text-primary-dark'}`}>
                    {comment.isAi ? <Sparkles size={16} /> : comment.author[0]}
                  </div>
                  
                  <div className={`max-w-[85%] space-y-1 ${comment.author === 'You' ? 'items-end flex flex-col' : ''}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs font-bold text-text-muted">{comment.author}</span>
                      <span className="text-[10px] text-text-muted/60">{comment.time}</span>
                    </div>
                    <div className={`p-4 rounded-2xl text-base leading-relaxed shadow-sm
                      ${comment.isAi ? 'bg-gradient-to-r from-accent/5 to-transparent border border-accent/10 text-text-main rounded-tl-none' : 
                        comment.author === 'You' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-secondary/20 text-text-main rounded-tl-none'}`}>
                      {comment.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface border-t border-secondary/30">
              <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                <div className="flex-1 bg-bg-soft border border-secondary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl transition-all">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a supportive message..."
                    className="w-full p-4 bg-transparent outline-none resize-none min-h-[60px] max-h-[120px]"
                    rows={1}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all shadow-lg shadow-primary/20 hover:scale-105 h-[60px] w-[60px] flex items-center justify-center"
                >
                  <Send size={24} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
