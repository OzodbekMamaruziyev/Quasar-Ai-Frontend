import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define routes that require authentication
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/builder');
  
  if (isProtectedRoute) {
    // Note: Since we use localStorage for tokens, the server-side middleware 
    // cannot easily verify JWTs unless they are in cookies. 
    // We will rely on Client-side routing in AuthContext, but we can prevent 
    // static pre-rendering leaks here by just checking if it is a protected route.
    
    // In a real production app with cookies you would do:
    // const token = request.cookies.get('accessToken')?.value;
    // if (!token) { return NextResponse.redirect(new URL('/login', request.url)); }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/builder/:path*'
  ]
};
