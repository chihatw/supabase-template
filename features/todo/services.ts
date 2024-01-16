import { createSupabaseServerComponentClient } from '@/lib/supabase/actions';
import { DATABASE } from '@/lib/supabase/constants';

import { PostgrestError } from '@supabase/supabase-js';

export async function readTodo() {
  const supabase = createSupabaseServerComponentClient();
  const result: {
    data: null | any[];
    error: null | PostgrestError;
  } = {
    data: null,
    error: null,
  };
  try {
    const { data, error } = await supabase.from(DATABASE.todo).select('*');
    if (error) throw error;
    result.data = data;
  } catch (error) {
    result.error = error as PostgrestError;
  } finally {
    return JSON.stringify(result);
  }
}
