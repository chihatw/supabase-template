'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { type AuthError } from '@supabase/supabase-js';
import { Loader2, Mailbox } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { signInWithMagicLink } from '../actions';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { isValidEmail } from '@/utils';

const INITIAL_STATE = {
  errMsg: '',
  email: '',
  isSent: false,
  disabled: true,
  open: false,
};

const LoginForm = () => {
  const form = useRef<null | HTMLFormElement>(null);
  const [props, setProps] = useState(INITIAL_STATE);
  const [isPending, startTransition] = useTransition();

  const handleChange = () => {
    if (!form.current) return;
    const formData = new FormData(form.current);
    const input = formData.get('email') as string;
    if (isValidEmail(input)) {
      setProps({
        ...INITIAL_STATE,
        disabled: false,
      });
      return;
    }
    setProps(INITIAL_STATE);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { target } = e;
    const formData = new FormData(target as HTMLFormElement);
    const email = formData.get('email') as string;

    startTransition(async () => {
      let newMessage = '';
      try {
        const result = await signInWithMagicLink(email);

        const { error } = JSON.parse(result);
        if (error) throw error;
        setProps((prev) => ({ ...prev, open: true }));
      } catch (error) {
        const { message } = error as AuthError;
        newMessage = message;
      } finally {
        setProps((prev) => ({
          ...prev,
          email,
          errMsg: newMessage,
          isSent: true,
        }));
      }
    });
  };

  const handleChangeOpen = (open: boolean) => {
    setProps((prev) => ({ ...prev, open }));
    if (!form.current) return;
    setProps((prev) => ({ ...prev, disabled: true }));
  };

  return (
    <>
      <div className='flex justify-center py-5'>
        <Mailbox
          size={120}
          className={cn('text-gray-800', props.isSent && 'animate-bounce')}
        />
      </div>
      <form
        ref={form}
        className='grid gap-4'
        onSubmit={handleSubmit}
        onChange={handleChange}
        autoComplete='off'
      >
        <Input placeholder='email' type='email' name='email' />
        <Button
          type='submit'
          className='space-x-1.5'
          disabled={isPending || props.disabled}
        >
          <span>Send Magic Link</span>
          {isPending ? <Loader2 className='animate-spin' /> : null}
        </Button>
        {props.errMsg ? (
          <div className='text-red-500 text-xs'>{props.errMsg}</div>
        ) : null}
      </form>
      <Dialog open={props.open} onOpenChange={handleChangeOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Please check your mailbox</DialogTitle>
          </DialogHeader>
          <div className='font-extralight pb-5'>
            <span>{`We sent an email to you at `}</span>
            <span className='font-bold'>{props.email}</span>
            <span>.</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
