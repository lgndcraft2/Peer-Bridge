'use server';

import { createClient, createAdminClient } from '@/api/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { moderateContent, generateAIResponse } from '@/lib/ai';

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tagsString = formData.get('tags') as string;
  
  // Parse tags: split by comma, trim whitespace, remove empty strings
  const tags = tagsString
    ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  // AI Moderation
  const moderation = await moderateContent(`${title}\n${content}`);
  const isSelfHarm = moderation.categories.some(cat => cat.includes('self-harm'));

  if (moderation.flagged && !isSelfHarm) {
    throw new Error('Post content violates our community guidelines.');
  }

  const { data, error } = await supabase.from('posts').insert({
    user_id: user.id,
    title,
    content,
    tags,
    likes: 0,
    views: 0
  }).select().single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  // AI Intervention for self-harm posts
  if (moderation.flagged && isSelfHarm) {
    // Use Admin Client to post as AI (bypassing RLS)
    const adminSupabase = createAdminClient();
    const aiResponse = await generateAIResponse(content);

    await adminSupabase.from('comments').insert({
      post_id: data.id,
      content: aiResponse,
      is_ai: true,
      user_id: null // AI has no user profile ID, or you can create a specific one
    });
  }

  revalidatePath('/dashboard');
  return { id: data.id };
}

