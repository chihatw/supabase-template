'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { PostgrestError } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { createTodo } from '../actions';

const CreateForm = () => {
  const form = useRef<null | HTMLFormElement>(null);
  const [isPending, startTransaction] = useTransition();
  const [props, setProps] = useState({ disabled: true, errMsg: '' });

  const handleChange = () => {
    if (!form.current) return;
    const formData = new FormData(form.current);
    const title = formData.get('title');
    if (!title) {
      setProps({ disabled: true, errMsg: '' });
      return;
    }
    setProps({ disabled: false, errMsg: '' });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;
    const formData = new FormData(form.current);
    const title = String(formData.get('title'));

    startTransaction(async () => {
      try {
        const result = await createTodo(title);
        const { error } = JSON.parse(result);
        if (error) throw error;
        form.current!.reset();
      } catch (error) {
        const { message } = error as PostgrestError;
        setProps((prev) => ({ ...prev, errMsg: message }));
      }
    });
  };

  return (
    <form
      ref={form}
      className='grid gap-4'
      onSubmit={handleSubmit}
      onChange={handleChange}
    >
      <Input placeholder='title' name='title' />
      <Button type='submit' disabled={props.disabled || isPending}>
        Create
        {isPending ? <Loader2 className='animate-spin' /> : null}
      </Button>
      {props.errMsg ? (
        <div className='text-red-500 text-xs'>{props.errMsg}</div>
      ) : null}
    </form>
  );
};

export default CreateForm;
