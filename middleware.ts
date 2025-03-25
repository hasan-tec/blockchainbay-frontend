// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';

export async function middleware(request: NextRequest) {
  // Only protect admin routes (except the login page)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    // Get the JWT token from cookies
    const jwt = request.cookies.get('jwt')?.value;

    // If no JWT token, redirect to login
    if (!jwt) {
      console.log('[Middleware] No JWT found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verify the token with Strapi
      const response = await fetch(`${API_URL}/api/users/me?populate=role`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.log('[Middleware] Invalid JWT, redirecting to login');
        // Clear the invalid JWT cookie before redirecting
        const res = NextResponse.redirect(new URL('/admin/login', request.url));
        res.cookies.delete('jwt');
        return res;
      }

      const user = await response.json();
      
      // Check if user has admin role
      const isAdmin = user.role?.name === 'Admin' || user.role?.type === 'admin';
      
      if (!isAdmin) {
        console.log('[Middleware] User is not an admin, redirecting to login');
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // User is authenticated and has admin role, proceed
      console.log('[Middleware] User authenticated, proceeding to admin page');
      return NextResponse.next();
    } catch (error) {
      console.error('[Middleware] Authentication error:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  } else if (request.nextUrl.pathname === '/admin/login') {
    // Check if user is already logged in, if so redirect to admin panel
    const jwt = request.cookies.get('jwt')?.value;
    
    if (jwt) {
      try {
        // Verify if the token is valid
        const response = await fetch(`${API_URL}/api/users/me?populate=role`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          cache: 'no-store',
        });
        
        if (response.ok) {
          const user = await response.json();
          const isAdmin = user.role?.name === 'Admin' || user.role?.type === 'admin';
          
          if (isAdmin) {
            console.log('[Middleware] Already logged in, redirecting to admin panel');
            return NextResponse.redirect(new URL('/admin/giveaways', request.url));
          }
        }
      } catch (error) {
        console.error('[Middleware] Error checking existing login:', error);
        // Continue to login page if there's an error
      }
    }
  }

  // For non-admin routes or login page with no valid session, proceed normally
  return NextResponse.next();
}

// Only run middleware on admin routes
export const config = {
  matcher: ['/admin/:path*'],
};