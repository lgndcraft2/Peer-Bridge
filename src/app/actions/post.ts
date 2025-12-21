'use server';

import { createClient } from '@/api/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

  revalidatePath('/dashboard');
  redirect(`/dashboard/${data.id}`);
}
