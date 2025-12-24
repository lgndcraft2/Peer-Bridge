import React from 'react';
import { createClient } from '@/api/supabase/server';
import { notFound, redirect } from 'next/navigation';
import PostDetail from '@/components/PostDetail';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  // Fetch User Profile

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    console.error('Error fetching post:', error);
    notFound();
  }

  // Fetch user like status
  let userHasLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from('post_likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', id)
      .single();
    
    if (like) {
      userHasLiked = true;
    }
  }

  // Fetch comments
  const { data: commentsData } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (
        alias
      )
    `)
    .eq('post_id', id)
    .order('created_at', { ascending: true });

  const aiNames = [
    "cloud9", "Sentinel", "rustydave", "twinkr", "shillll", 
    "randomvillager101", "Shield", "Sol", "Luna", "riverrr009"
  ];

  const getAiName = (id: number | string) => {
    const num = typeof id === 'number' ? id : String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return aiNames[Math.abs(num) % aiNames.length];
  };

  const formattedComments = commentsData?.map((comment: any) => ({
    id: comment.id,
    author: comment.is_ai ? getAiName(comment.id) : (comment.profiles?.alias || 'Anonymous'),
    text: comment.content,
    isAi: comment.is_ai,
    time: new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Simple formatting
  })) || [];

  const formattedPost = {
    ...post,
    user_has_liked: userHasLiked,
    author_name: profile?.alias || 'Anonymous' // Placeholder
  };

  return (
    <PostDetail post={formattedPost} initialComments={formattedComments} />
  );
}
