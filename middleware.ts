// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/categories',
    '/categories/tree',
    '/categories/:path*',
  ];

  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path.replace(':path*', '')))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('refreshToken')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check if user is admin for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await response.json();
      if (!user || user.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};