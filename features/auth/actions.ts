'use server';

import { createSupabaseServerActionClient } from '@/lib/supabase/actions';

export async function signInWithMagicLink(email: string) {
  const supabase = createSupabaseServerActionClient();
  const result = await supabase.auth.signInWithOtp({
    email,
  });
  return JSON.stringify(result);
}
