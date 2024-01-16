'use server';

import { createSupabaseServerActionClient } from '@/lib/supabase/actions';
import { DATABASE } from '@/lib/supabase/constants';

import { PostgrestError } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function createTodo(title: string) {
  const supabase = createSupabaseServerActionClient();
  const result: { error: null | PostgrestError } = { error: null };
  try {
    const { error } = await supabase
      .from(DATABASE.todo)
      .insert({ title })
      .single();
    if (error) throw error;
    revalidatePath('/todo');
  } catch (error) {
    result.error = error as PostgrestError;
  } finally {
    return JSON.stringify(result);
  }
}

export async function updateTodo(id: string, completed: boolean) {
  const supabase = createSupabaseServerActionClient();
  const result: {
    error: null | PostgrestError;
  } = {
    error: null,
  };
  try {
    const { error } = await supabase
      .from(DATABASE.todo)
      .update({ completed })
      .eq('id', id);
    revalidatePath('/todo');
    if (error) throw error;
  } catch (error) {
    result.error = error as PostgrestError;
  } finally {
    return JSON.stringify(result);
  }
}

export async function deleteTodo(id: string) {
  const supabase = createSupabaseServerActionClient();
  const result: { error: null | PostgrestError } = { error: null };
  try {
    const { error } = await supabase.from(DATABASE.todo).delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/todo');
  } catch (error) {
    result.error = error as PostgrestError;
  } finally {
    return JSON.stringify(result);
  }
}
