import React from 'react';
import { createClient } from '@/api/supabase/server';
import Feed from '@/components/Feed';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  // Fetch posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, comments(count)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return <div>Error loading posts</div>;
  }

  // Fetch user likes to determine 'user_has_liked'
  let likedPostIds = new Set();
  if (user) {
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);
    
    if (likes) {
      likedPostIds = new Set(likes.map(l => l.post_id));
    }
  }

  const formattedPosts = posts.map(post => ({
    ...post,
    comments_count: post.comments?.[0]?.count || 0,
    user_has_liked: likedPostIds.has(post.id),
    author_name: 'Anonymous' // Placeholder until we have a profiles table
  }));

  return (
    <Feed initialPosts={formattedPosts} currentUserId={user?.id} />
  );
}
