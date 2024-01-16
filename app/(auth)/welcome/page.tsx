'use client';
import { buttonVariants } from '@/components/ui/button';
import { createSupabaseClientComponentClient } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const WelcomPage = () => {
  const router = useRouter();
  const supabase = createSupabaseClientComponentClient();
  const [props, setProps] = useState({ time: 0, points: '.' });

  useEffect(() => {
    const interval = setInterval(() => {
      setProps((props) => {
        const time = props.time + 1;
        const points = (() => {
          switch (props.points.length) {
            case 1:
              return '..';
            case 2:
              return '...';
            default:
              return '.';
          }
        })();
        return {
          points,
          time,
        };
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.refresh();
      }
    });
    return () => data.subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <div className='flex flex-col  items-center pt-20 space-y-32'>
      {props.time < 30 ? (
        <>
          <div className='font-extrabold text-4xl'>Thank you!!</div>
          <div className='font-extralight text-2xl'>
            <span>Now Loading</span>
            <span className='absolute'>{props.points}</span>
          </div>
        </>
      ) : (
        <>
          <div className='font-extralight text-gray-500 text-4xl'>
            <span>Sorry...</span>
            <br />
            <span>Something wrong.</span>
          </div>
          <Link href={'/login'} className={buttonVariants()}>
            Back to Login
          </Link>
        </>
      )}
    </div>
  );
};

export default WelcomPage;
