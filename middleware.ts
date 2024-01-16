import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from './lib/supabase';

const HOME_PAGE = '/';
const AUTH_PAGE = '/login';
const WELCOME_PAGE = '/welcome';

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログインしていない、かつログインページでもウェルカムページでもない場合は、　ログインページを返す
  if (!user && ![WELCOME_PAGE, AUTH_PAGE].includes(pathname)) {
    return NextResponse.redirect(new URL(AUTH_PAGE, request.url));
  }

  // ログインしている、かつログインページまたはウェルカムページの場合は、　ホームページを返す
  if (!!user && [WELCOME_PAGE, AUTH_PAGE].includes(pathname)) {
    return NextResponse.redirect(new URL(HOME_PAGE, request.url));
  }

  // ログインしている、かつログインページ以外の場合は、リクエスト通りに返す
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
