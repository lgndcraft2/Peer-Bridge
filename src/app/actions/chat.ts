'use server';

import { createClient, createAdminClient } from '@/api/supabase/server';
import { revalidatePath } from 'next/cache';
import { moderateContent, generateAIResponse } from '@/lib/ai';

export async function submitComment(postId: string, content: string) {
  const supabase = await createClient();
  
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 2. Moderate Content
  const moderation = await moderateContent(content);
  
  // If content is extremely harmful/toxic, you might reject it entirely.
  // For this example, we'll allow it but flag it for AI intervention.
  
  // 3. Insert User Comment
  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    content: content,
    is_ai: false
  });

  if (error) throw error;

  // 4. AI Intervention Check
  // Check for self-harm related categories
  const isSelfHarm = moderation.categories.some(cat => cat.includes('self-harm'));
  
  if (moderation.flagged && isSelfHarm) {
    // Use Admin Client to post as AI (bypassing RLS)
    const adminSupabase = createAdminClient();
    const aiResponse = await generateAIResponse(content);

    await adminSupabase.from('comments').insert({
      post_id: postId,
      content: aiResponse,
      is_ai: false,
      user_id: null // AI has no user profile ID, or you can create a specific one
    });
  }

  revalidatePath(`/dashboard/${postId}`);
}
