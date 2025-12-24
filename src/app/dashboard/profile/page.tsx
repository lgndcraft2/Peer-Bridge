import React from 'react';
import { createClient } from '@/api/supabase/server';
import { redirect } from 'next/navigation';
import { User, Calendar, Mail } from 'lucide-react';
import Feed from '@/components/Feed';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user's posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, comments(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch user likes to determine 'user_has_liked'
  let likedPostIds = new Set();
  const { data: likes } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', user.id);
  
  if (likes) {
    likedPostIds = new Set(likes.map(l => l.post_id));
  }

  const formattedPosts = (posts || []).map(post => ({
    ...post,
    comments_count: post.comments?.[0]?.count || 0,
    user_has_liked: likedPostIds.has(post.id),
    author_name: 'You' // Since it's the user's own profile
  }));

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-secondary/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User size={48} />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-2xl font-bold text-primary-dark">
              {profile?.full_name || profile?.alias || 'Anonymous User'}
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-4 text-text-muted text-sm">
              <div className="flex items-center gap-1">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-center">
            <div className="px-4 py-2 bg-bg-soft rounded-xl">
              <div className="text-xl font-bold text-primary">{posts?.length || 0}</div>
              <div className="text-xs text-text-muted font-bold uppercase tracking-wider">Posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-primary-dark px-2">Your Posts</h2>
        {formattedPosts.length > 0 ? (
          <Feed initialPosts={formattedPosts} currentUserId={user.id} />
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-secondary/20 border-dashed">
            <p className="text-text-muted">You haven't created any posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
