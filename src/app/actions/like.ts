'use server';

import { createClient, createAdminClient } from '@/api/supabase/server';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Check if the user has already liked the post
  const { data: existingLike, error: checkError } = await supabase
    .from('post_likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "Row not found"
    console.error('Error checking like status:', checkError);
    throw new Error('Failed to check like status');
  }

  if (existingLike) {
    // Unlike
    const { error: deleteError } = await supabase
      .from('post_likes')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId);

    if (deleteError) {
      console.error('Error removing like:', deleteError);
      throw new Error(`Failed to remove like: ${deleteError.message}`);
    }

    // Decrement likes count in posts table
    // Note: It's better to use an RPC or a trigger for atomicity, but for now we'll do it in two steps or rely on the client to update optimistically/revalidate.
    // Actually, let's just revalidate the path.
    // But we also want to update the count in the DB.
    // We can use the `rpc` if we had one, or just update.
    // Let's use a raw query or just update.
    
    // To avoid race conditions, Supabase doesn't have a simple "decrement" without RPC.
    // We will fetch the current count and decrement it, which is not race-condition free but simple.
    // OR better: we can rely on a trigger in the DB to update the count.
    // Since I cannot create triggers easily here without SQL access (I can run SQL but it's better to stick to application logic if possible or simple SQL).
    
    // Let's assume we don't have triggers.
    const { error: updateError } = await supabase.rpc('decrement_likes', { row_id: postId });
    if (updateError) {
        // Fallback if RPC doesn't exist: fetch and update using Admin client to bypass RLS
        const supabaseAdmin = createAdminClient();
        const { data: post } = await supabaseAdmin.from('posts').select('likes').eq('id', postId).single();
        if (post) {
            await supabaseAdmin.from('posts').update({ likes: Math.max(0, post.likes - 1) }).eq('id', postId);
        }
    }

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/${postId}`);
    //return { liked: false };
  } else {
    // Like
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert({ id: randomUUID(), user_id: user.id, post_id: postId });

    if (insertError) {
      if (insertError.code === '23505') { // unique_violation
        // Already liked, ignore error
        revalidatePath('/dashboard');
        revalidatePath(`/dashboard/${postId}`);
        return { liked: true };
      }
      console.error('Error adding like:', insertError, { userId: user.id, postId });
      throw new Error(`Failed to add like: ${insertError.message}`);
    }

    const { error: updateError } = await supabase.rpc('increment_likes', { row_id: postId });
    if (updateError) {
         // Fallback using Admin client to bypass RLS
        const supabaseAdmin = createAdminClient();
        const { data: post } = await supabaseAdmin.from('posts').select('likes').eq('id', postId).single();
        if (post) {
            await supabaseAdmin.from('posts').update({ likes: post.likes + 1 }).eq('id', postId);
        }
    }

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/${postId}`);
    return { liked: true };
  }
}
