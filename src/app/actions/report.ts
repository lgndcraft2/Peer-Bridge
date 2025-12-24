'use server';

import { createClient } from '@/api/supabase/server';

export async function submitReport(postId: string, reason: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  if (!reason.trim()) {
    throw new Error('Reason is required');
  }

  const { error } = await supabase.from('reports').insert({
    post_id: postId,
    reporter_id: user.id,
    reason: reason,
    status: 'pending'
  });

  if (error) {
    console.error('Error submitting report:', error);
    throw new Error('Failed to submit report');
  }

  return { success: true };
}
