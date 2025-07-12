import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is signed in and the current path is / redirect to /h/new-chat
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/h/new-chat', req.url));
  }
  
  // If user is not signed in and the current path is not / redirect to /
  if (!session && req.nextUrl.pathname.startsWith('/h/')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/', '/h/:path*'],
};