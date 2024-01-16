'use client';

import { Session } from '@supabase/supabase-js';
import Link from 'next/link';

import { createSupabaseClientComponentClient } from '@/lib/supabase';
import { DoorClosed, DoorOpen, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, buttonVariants } from './ui/button';

const Header = () => {
  const router = useRouter();
  const supabase = createSupabaseClientComponentClient();
  const [session, setSession] = useState<null | Session>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.refresh();
  };

  return (
    <nav className='grid h-12 shadow'>
      <div className='container flex w-full items-center justify-between'>
        <Link
          href={'/'}
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
        >
          <Home />
        </Link>
        <div className='flex items-center gap-x-2'>
          {session ? (
            <Button variant={'ghost'} size={'icon'} onClick={signOut}>
              <DoorOpen />
            </Button>
          ) : (
            <Link
              href={'/login'}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <DoorClosed />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
