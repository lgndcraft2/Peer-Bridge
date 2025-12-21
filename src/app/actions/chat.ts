'use server';

import { createClient, createAdminClient } from '@/api/supabase/server';
import { revalidatePath } from 'next/cache';

// Mock AI Moderation Function (Replace with OpenAI/Azure call)
async function moderateContent(text: string): Promise<{ flagged: boolean; categories: string[] }> {
  const lower = text.toLowerCase();
  const flagged = lower.includes('suicide') || lower.includes('kill myself') || lower.includes('die');
  return {
    flagged,
    categories: flagged ? ['self-harm'] : []
  };
}

// Mock AI Response Function (Replace with OpenAI Chat Completion)
async function generateAIResponse(userContent: string): Promise<string> {
  // In reality, you would call OpenAI here with a system prompt like:
  // "You are a supportive, empathetic AI assistant. The user is expressing distress..."
  return "I hear how much pain you're in right now. Please know that you are not alone, and there are people who want to support you. If you're in immediate danger, please reach out to a crisis helpline.";
}

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
  if (moderation.flagged && moderation.categories.includes('self-harm')) {
    // Use Admin Client to post as AI (bypassing RLS)
    const adminSupabase = createAdminClient();
    const aiResponse = await generateAIResponse(content);

    await adminSupabase.from('comments').insert({
      post_id: postId,
      content: aiResponse,
      is_ai: true,
      user_id: null // AI has no user profile ID, or you can create a specific one
    });
  }

  revalidatePath(`/dashboard/${postId}`);
}
