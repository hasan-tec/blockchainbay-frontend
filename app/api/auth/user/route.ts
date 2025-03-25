// app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';

export async function GET(request: NextRequest) {
  try {
    // Get the token from the Authorization header or cookies
    const authHeader = request.headers.get('Authorization');
    let token = authHeader?.split(' ')[1];
    
    // If not in headers, check cookies
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('jwt')?.value;
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token with Strapi
    const response = await fetch(`${API_URL}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userData = await response.json();
    
    // Return user data without sensitive information
    return NextResponse.json({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}