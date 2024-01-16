'use server';

import { createSupabaseServerActionClient } from '@/lib/supabase/actions';
import { PROJECT_URL } from './constants';

const isDev = process.env.NODE_ENV === 'development';
const url = (isDev ? 'http://localhost:3000' : PROJECT_URL) + '/welcome';

export async function signInWithMagicLink(email: string) {
  const supabase = createSupabaseServerActionClient();
  const result = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: url },
  });
  return JSON.stringify(result);
}
